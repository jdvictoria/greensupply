"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import productsData from "@/data/products.json";
import stockData from "@/data/stocks.json";
import warehousesData from "@/data/warehouses.json";
import transfersData from "@/data/transfers.json";
import alertsData from "@/data/alerts.json";

import type { Product, Stock, Warehouse, Transfer, Alert } from "@/lib/types";

type InventoryContextType = {
  products: Product[];
  stock: Stock[];
  warehouses: Warehouse[];
  transfers: Transfer[];
  alerts: Alert[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  addWarehouse: (warehouse: Omit<Warehouse, "id">) => void;
  updateWarehouse: (id: number, warehouse: Partial<Warehouse>) => void;
  deleteWarehouse: (id: number) => void;
  createTransfer: (
    transfer: Omit<Transfer, "id" | "createdAt" | "status">,
  ) => Promise<void>;
  getStockForProduct: (productId: number, warehouseId: number) => number;
  updateAlertStatus: (
    id: number,
    status: "pending" | "acknowledged" | "resolved" | "dismissed",
    notes?: string,
  ) => void;
  generateAlerts: () => void;
};

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined,
);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(
    productsData as Product[],
  );
  const [stock, setStock] = useState<Stock[]>(stockData as Stock[]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(
    warehousesData as Warehouse[],
  );
  const [transfers, setTransfers] = useState<Transfer[]>(
    transfersData as Transfer[],
  );
  const [alerts, setAlerts] = useState<Alert[]>(alertsData as Alert[]);

  const addProduct = (product: Omit<Product, "id">) => {
    const newId = Math.max(...products.map((p) => p.id), 0) + 1;
    setProducts([...products, { ...product, id: newId }]);
  };

  const updateProduct = (id: number, updatedProduct: Partial<Product>) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)),
    );
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
    setStock(stock.filter((s) => s.productId !== id));
  };

  const addWarehouse = (warehouse: Omit<Warehouse, "id">) => {
    const newId = Math.max(...warehouses.map((w) => w.id), 0) + 1;
    setWarehouses([...warehouses, { ...warehouse, id: newId }]);
  };

  const updateWarehouse = (
    id: number,
    updatedWarehouse: Partial<Warehouse>,
  ) => {
    setWarehouses(
      warehouses.map((w) => (w.id === id ? { ...w, ...updatedWarehouse } : w)),
    );
  };

  const deleteWarehouse = (id: number) => {
    setWarehouses(warehouses.filter((w) => w.id !== id));
    setStock(stock.filter((s) => s.warehouseId !== id));
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
    transfer: Omit<Transfer, "id" | "createdAt" | "status">,
  ): Promise<void> => {
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newId = Math.max(...transfers.map((t) => t.id), 0) + 1;
    const newTransfer: Transfer = {
      ...transfer,
      id: newId,
      createdAt: new Date().toISOString(),
      status: "completed",
      completedAt: new Date().toISOString(),
    };

    // Update stock levels
    setStock((prevStock) => {
      const updatedStock = [...prevStock];

      // Find or create stock entries
      const fromStockIndex = updatedStock.findIndex(
        (s) =>
          s.productId === transfer.productId &&
          s.warehouseId === transfer.fromWarehouseId,
      );
      const toStockIndex = updatedStock.findIndex(
        (s) =>
          s.productId === transfer.productId &&
          s.warehouseId === transfer.toWarehouseId,
      );

      // Deduct from source warehouse
      if (fromStockIndex !== -1) {
        updatedStock[fromStockIndex] = {
          ...updatedStock[fromStockIndex],
          quantity: updatedStock[fromStockIndex].quantity - transfer.quantity,
        };
      }

      // Add to destination warehouse
      if (toStockIndex !== -1) {
        updatedStock[toStockIndex] = {
          ...updatedStock[toStockIndex],
          quantity: updatedStock[toStockIndex].quantity + transfer.quantity,
        };
      } else {
        // Create new stock entry if it doesn't exist
        const newStockId = Math.max(...updatedStock.map((s) => s.id), 0) + 1;
        updatedStock.push({
          id: newStockId,
          productId: transfer.productId,
          warehouseId: transfer.toWarehouseId,
          quantity: transfer.quantity,
        });
      }

      return updatedStock;
    });

    setTransfers([newTransfer, ...transfers]);
  };

  const updateAlertStatus = (
    id: number,
    status: "pending" | "acknowledged" | "resolved" | "dismissed",
    notes?: string,
  ) => {
    setAlerts(
      alerts.map((alert) => {
        if (alert.id === id) {
          const timestamp = new Date().toISOString();
          return {
            ...alert,
            status,
            notes: notes || alert.notes,
            acknowledgedAt:
              status === "acknowledged" ? timestamp : alert.acknowledgedAt,
            resolvedAt: status === "resolved" ? timestamp : alert.resolvedAt,
            dismissedAt: status === "dismissed" ? timestamp : alert.dismissedAt,
          };
        }
        return alert;
      }),
    );
  };

  const generateAlerts = () => {
    const newAlerts: Alert[] = [];
    const maxAlertId = Math.max(...alerts.map((a) => a.id), 0);
    let nextId = maxAlertId + 1;

    products.forEach((product) => {
      const totalStock = stock
        .filter((s) => s.productId === product.id)
        .reduce((sum, s) => sum + s.quantity, 0);

      // Skip if alert already exists for this product
      const existingAlert = alerts.find(
        (a) => a.productId === product.id && a.status === "pending",
      );
      if (existingAlert) return;

      let alertLevel: Alert["alertLevel"];
      let recommendedOrderQuantity = 0;

      if (totalStock === 0) {
        alertLevel = "critical";
        recommendedOrderQuantity = product.reorderPoint * 3;
      } else if (totalStock < product.reorderPoint * 0.5) {
        alertLevel = "critical";
        recommendedOrderQuantity = product.reorderPoint * 2.5 - totalStock;
      } else if (totalStock < product.reorderPoint) {
        alertLevel = "low";
        recommendedOrderQuantity = product.reorderPoint * 2 - totalStock;
      } else if (totalStock >= product.reorderPoint * 5) {
        alertLevel = "overstocked";
        recommendedOrderQuantity = 0;
      } else {
        alertLevel = "adequate";
        recommendedOrderQuantity = 0;
      }

      if (alertLevel === "critical" || alertLevel === "low") {
        newAlerts.push({
          id: nextId++,
          productId: product.id,
          totalStock,
          reorderPoint: product.reorderPoint,
          alertLevel,
          status: "pending",
          recommendedOrderQuantity: Math.ceil(recommendedOrderQuantity),
          createdAt: new Date().toISOString(),
        });
      }
    });

    if (newAlerts.length > 0) {
      setAlerts([...newAlerts, ...alerts]);
    }
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
