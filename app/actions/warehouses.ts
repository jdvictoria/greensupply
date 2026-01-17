"use client";

import type { Warehouse } from "@/lib/types";
import {
  getWarehouses,
  setWarehouses,
  getStock,
  setStock,
} from "@/lib/storage";

export async function getWarehousesAction(): Promise<Warehouse[]> {
  return getWarehouses();
}

export async function createWarehouseAction(
  warehouse: Omit<Warehouse, "id">,
): Promise<Warehouse> {
  const warehouses = getWarehouses();
  const newId = Math.max(...warehouses.map((w) => w.id), 0) + 1;
  const newWarehouse: Warehouse = { ...warehouse, id: newId };
  setWarehouses([...warehouses, newWarehouse]);
  return newWarehouse;
}

export async function updateWarehouseAction(
  id: number,
  warehouse: Partial<Warehouse>,
): Promise<Warehouse> {
  const warehouses = getWarehouses();
  const updated = warehouses.map((w) =>
    w.id === id ? { ...w, ...warehouse } : w,
  );
  setWarehouses(updated);
  const updatedWarehouse = updated.find((w) => w.id === id);
  if (!updatedWarehouse) throw new Error("Warehouse not found");
  return updatedWarehouse;
}

export async function deleteWarehouseAction(id: number): Promise<void> {
  const warehouses = getWarehouses();
  const stock = getStock();

  setWarehouses(warehouses.filter((w) => w.id !== id));
  setStock(stock.filter((s) => s.warehouseId !== id));
}
