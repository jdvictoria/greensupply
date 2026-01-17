"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import type { Product, Stock, Warehouse, Transfer, Alert } from "@/lib/types";
import {
  getProducts,
  getStock,
  getWarehouses,
  getTransfers,
  getAlerts,
} from "@/lib/storage";
import * as productActions from "@/app/actions/products";
import * as warehouseActions from "@/app/actions/warehouses";
import * as transferActions from "@/app/actions/transfers";
import * as alertActions from "@/app/actions/alerts";
import * as stockActions from "@/app/actions/stock";

type InventoryContextType = {
  products: Product[];
  stock: Stock[];
  warehouses: Warehouse[];
  transfers: Transfer[];
  alerts: Alert[];
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  addWarehouse: (warehouse: Omit<Warehouse, "id">) => Promise<void>;
  updateWarehouse: (id: number, warehouse: Partial<Warehouse>) => Promise<void>;
  deleteWarehouse: (id: number) => Promise<void>;
  createTransfer: (
    transfer: Omit<Transfer, "id" | "createdAt" | "status">,
  ) => Promise<void>;
  getStockForProduct: (productId: number, warehouseId: number) => number;
  updateAlertStatus: (
    id: number,
    status: "pending" | "acknowledged" | "resolved" | "dismissed",
    notes?: string,
  ) => Promise<void>;
  generateAlerts: () => Promise<void>;
};

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined,
);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [stock, setStock] = useState<Stock[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      const [
        productsData,
        stockData,
        warehousesData,
        transfersData,
        alertsData,
      ] = await Promise.all([
        productActions.getProductsAction(),
        stockActions.getStockAction(),
        warehouseActions.getWarehousesAction(),
        transferActions.getTransfersAction(),
        alertActions.getAlertsAction(),
      ]);
      setProducts(productsData);
      setStock(stockData);
      setWarehouses(warehousesData);
      setTransfers(transfersData);
      setAlerts(alertsData);
    };
    loadData();
  }, []);

  const addProduct = async (product: Omit<Product, "id">) => {
    const newProduct = await productActions.createProductAction(product);
    const updatedProducts = await productActions.getProductsAction();
    const updatedStock = await stockActions.getStockAction();
    setProducts(updatedProducts);
    setStock(updatedStock);
  };

  const updateProduct = async (
    id: number,
    updatedProduct: Partial<Product>,
  ) => {
    await productActions.updateProductAction(id, updatedProduct);
    const updatedProducts = await productActions.getProductsAction();
    setProducts(updatedProducts);
  };

  const deleteProduct = async (id: number) => {
    await productActions.deleteProductAction(id);
    const updatedProducts = await productActions.getProductsAction();
    const updatedStock = await stockActions.getStockAction();
    setProducts(updatedProducts);
    setStock(updatedStock);
  };

  const addWarehouse = async (warehouse: Omit<Warehouse, "id">) => {
    await warehouseActions.createWarehouseAction(warehouse);
    const updatedWarehouses = await warehouseActions.getWarehousesAction();
    const updatedStock = await stockActions.getStockAction();
    setWarehouses(updatedWarehouses);
    setStock(updatedStock);
  };

  const updateWarehouse = async (
    id: number,
    updatedWarehouse: Partial<Warehouse>,
  ) => {
    await warehouseActions.updateWarehouseAction(id, updatedWarehouse);
    const updatedWarehouses = await warehouseActions.getWarehousesAction();
    setWarehouses(updatedWarehouses);
  };

  const deleteWarehouse = async (id: number) => {
    await warehouseActions.deleteWarehouseAction(id);
    const updatedWarehouses = await warehouseActions.getWarehousesAction();
    const updatedStock = await stockActions.getStockAction();
    setWarehouses(updatedWarehouses);
    setStock(updatedStock);
  };

  const getStockForProduct = (
    productId: number,
    warehouseId: number,
  ): number => {
    const stockItem = stock.find(
      (s) => s.productId === productId && s.warehouseId === warehouseId,
    );
    return stockItem?.quantity || 0;
  };

  const createTransfer = async (
    transfer: Omit<Transfer, "id" | "createdAt" | "status" | "completedAt">,
  ): Promise<void> => {
    await transferActions.createTransferAction(transfer);
    const updatedTransfers = await transferActions.getTransfersAction();
    const updatedStock = await stockActions.getStockAction();
    setTransfers(updatedTransfers);
    setStock(updatedStock);
  };

  const updateAlertStatus = async (
    id: number,
    status: "pending" | "acknowledged" | "resolved" | "dismissed",
    notes?: string,
  ) => {
    await alertActions.updateAlertStatusAction(id, status, notes);
    const updatedAlerts = await alertActions.getAlertsAction();
    setAlerts(updatedAlerts);
  };

  const generateAlerts = async () => {
    const updatedAlerts = await alertActions.generateAlertsAction();
    setAlerts(updatedAlerts);
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        stock,
        warehouses,
        transfers,
        alerts,
        addProduct,
        updateProduct,
        deleteProduct,
        addWarehouse,
        updateWarehouse,
        deleteWarehouse,
        createTransfer,
        getStockForProduct,
        updateAlertStatus,
        generateAlerts,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
