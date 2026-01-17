export type Product = {
  id: number;
  sku: string;
  name: string;
  category: string;
  unitCost: number;
  reorderPoint: number;
};

export type Stock = {
  id: number;
  productId: number;
  warehouseId: number;
  quantity: number;
};

export type Warehouse = {
  id: number;
  name: string;
  location: string;
  code: string;
};

export type InventoryItem = {
  product: Product;
  totalStock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
};

export type Transfer = {
  id: number;
  productId: number;
  fromWarehouseId: number;
  toWarehouseId: number;
  quantity: number;
  initiatedBy: string;
  status: "pending" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
  completedAt?: string;
};

export type Alert = {
  id: number;
  productId: number;
  totalStock: number;
  reorderPoint: number;
  alertLevel: "critical" | "low" | "adequate" | "overstocked";
  status: "pending" | "acknowledged" | "resolved" | "dismissed";
  recommendedOrderQuantity: number;
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  dismissedAt?: string;
  notes?: string;
};
