import productsData from "@/data/products.json"
import stockData from "@/data/stocks.json"
import warehousesData from "@/data/warehouses.json"

import type { Product, Stock, Warehouse, InventoryItem } from "@/lib/types"

export const products: Product[] = productsData
export const stock: Stock[] = stockData
export const warehouses: Warehouse[] = warehousesData

export function getInventoryOverview(): InventoryItem[] {
  return products.map((product) => {
    const productStock = stock.filter((s) => s.productId === product.id)
    const totalStock = productStock.reduce((sum, s) => sum + s.quantity, 0)

    let status: "In Stock" | "Low Stock" | "Out of Stock"
    if (totalStock === 0) {
      status = "Out of Stock"
    } else if (totalStock <= product.reorderPoint) {
      status = "Low Stock"
    } else {
      status = "In Stock"
    }

    return {
      product,
      totalStock,
      status,
    }
  })
}

export function getTotalInventoryValue(): number {
  return products.reduce((total, product) => {
    const productStock = stock.filter((s) => s.productId === product.id)
    const totalQuantity = productStock.reduce((sum, s) => sum + s.quantity, 0)
    return total + totalQuantity * product.unitCost
  }, 0)
}

export function getStockByWarehouse(warehouseId: number) {
  return stock.filter((s) => s.warehouseId === warehouseId)
}

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getWarehouseById(id: number): Warehouse | undefined {
  return warehouses.find((w) => w.id === id)
}
