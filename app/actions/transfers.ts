"use client";

import type { Transfer } from "@/lib/types";
import { getTransfers, setTransfers, getStock, setStock } from "@/lib/storage";

export async function getTransfersAction(): Promise<Transfer[]> {
  return getTransfers();
}

export async function createTransferAction(
  transfer: Omit<Transfer, "id" | "createdAt" | "status" | "completedAt">,
): Promise<Transfer> {
  const transfers = getTransfers();
  const stock = getStock();

  const newId = Math.max(...transfers.map((t) => t.id), 0) + 1;
  const newTransfer: Transfer = {
    ...transfer,
    id: newId,
    createdAt: new Date().toISOString(),
    status: "completed",
    completedAt: new Date().toISOString(),
  };

  // Update stock levels
  const updatedStock = [...stock];

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

  setStock(updatedStock);
  setTransfers([newTransfer, ...transfers]);

  return newTransfer;
}
