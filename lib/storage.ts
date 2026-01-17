"use client";

import type { Product, Stock, Warehouse, Transfer, Alert } from "@/lib/types";
import productsData from "@/data/products.json";
import warehousesData from "@/data/warehouses.json";
import stockData from "@/data/stocks.json";
import transfersData from "@/data/transfers.json";
import alertsData from "@/data/alerts.json";

const STORAGE_KEYS = {
  products: "greensupply_products",
  warehouses: "greensupply_warehouses",
  stock: "greensupply_stock",
  transfers: "greensupply_transfers",
  alerts: "greensupply_alerts",
} as const;

// Initialize with default data if not present
function initializeStorage() {
  if (typeof window === "undefined") return;

  // Only initialize if storage is empty
  if (!localStorage.getItem(STORAGE_KEYS.products)) {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(productsData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.warehouses)) {
    localStorage.setItem(
      STORAGE_KEYS.warehouses,
      JSON.stringify(warehousesData),
    );
  }
  if (!localStorage.getItem(STORAGE_KEYS.stock)) {
    localStorage.setItem(STORAGE_KEYS.stock, JSON.stringify(stockData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.transfers)) {
    localStorage.setItem(STORAGE_KEYS.transfers, JSON.stringify(transfersData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.alerts)) {
    localStorage.setItem(STORAGE_KEYS.alerts, JSON.stringify(alertsData));
  }
}

// Initialize on module load
if (typeof window !== "undefined") {
  initializeStorage();
}

export function getProducts(): Product[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.products);
  return data ? JSON.parse(data) : [];
}

export function setProducts(products: Product[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
}

export function getWarehouses(): Warehouse[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.warehouses);
  return data ? JSON.parse(data) : [];
}

export function setWarehouses(warehouses: Warehouse[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.warehouses, JSON.stringify(warehouses));
}

export function getStock(): Stock[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.stock);
  return data ? JSON.parse(data) : [];
}

export function setStock(stock: Stock[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.stock, JSON.stringify(stock));
}

export function getTransfers(): Transfer[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.transfers);
  return data ? JSON.parse(data) : [];
}

export function setTransfers(transfers: Transfer[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.transfers, JSON.stringify(transfers));
}

export function getAlerts(): Alert[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.alerts);
  return data ? JSON.parse(data) : [];
}

export function setAlerts(alerts: Alert[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.alerts, JSON.stringify(alerts));
}

export function resetAllData(): void {
  if (typeof window === "undefined") return;

  // Clear all localStorage
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });

  // Reinitialize with default data
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(productsData));
  localStorage.setItem(STORAGE_KEYS.warehouses, JSON.stringify(warehousesData));
  localStorage.setItem(STORAGE_KEYS.stock, JSON.stringify(stockData));
  localStorage.setItem(STORAGE_KEYS.transfers, JSON.stringify(transfersData));
  localStorage.setItem(STORAGE_KEYS.alerts, JSON.stringify(alertsData));
}
