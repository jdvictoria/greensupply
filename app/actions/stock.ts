"use client";

import type { Stock } from "@/lib/types";
import { getStock } from "@/lib/storage";

export async function getStockAction(): Promise<Stock[]> {
  return getStock();
}

export async function getStockForProductAction(
  productId: number,
  warehouseId: number,
): Promise<number> {
  const stock = getStock();
  const stockItem = stock.find(
    (s) => s.productId === productId && s.warehouseId === warehouseId,
  );
  return stockItem?.quantity || 0;
}
