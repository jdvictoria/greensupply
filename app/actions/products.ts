"use client";

import type { Product } from "@/lib/types";
import { getProducts, setProducts, getStock, setStock } from "@/lib/storage";

export async function getProductsAction(): Promise<Product[]> {
  return getProducts();
}

export async function createProductAction(
  product: Omit<Product, "id">,
): Promise<Product> {
  const products = getProducts();
  const newId = Math.max(...products.map((p) => p.id), 0) + 1;
  const newProduct: Product = { ...product, id: newId };
  setProducts([...products, newProduct]);
  return newProduct;
}

export async function updateProductAction(
  id: number,
  product: Partial<Product>,
): Promise<Product> {
  const products = getProducts();
  const updated = products.map((p) => (p.id === id ? { ...p, ...product } : p));
  setProducts(updated);
  const updatedProduct = updated.find((p) => p.id === id);
  if (!updatedProduct) throw new Error("Product not found");
  return updatedProduct;
}

export async function deleteProductAction(id: number): Promise<void> {
  const products = getProducts();
  const stock = getStock();

  setProducts(products.filter((p) => p.id !== id));
  setStock(stock.filter((s) => s.productId !== id));
}
