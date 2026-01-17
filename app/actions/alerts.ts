"use client";

import type { Alert, Product, Stock } from "@/lib/types";
import { getAlerts, setAlerts, getProducts, getStock } from "@/lib/storage";

export async function getAlertsAction(): Promise<Alert[]> {
  return getAlerts();
}

export async function updateAlertStatusAction(
  id: number,
  status: "pending" | "acknowledged" | "resolved" | "dismissed",
  notes?: string,
): Promise<Alert> {
  const alerts = getAlerts();
  const updated = alerts.map((alert) => {
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
  });
  setAlerts(updated);
  const updatedAlert = updated.find((a) => a.id === id);
  if (!updatedAlert) throw new Error("Alert not found");
  return updatedAlert;
}

export async function generateAlertsAction(): Promise<Alert[]> {
  const alerts = getAlerts();
  const products = getProducts();
  const stock = getStock();

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
    const updatedAlerts = [...newAlerts, ...alerts];
    setAlerts(updatedAlerts);
    return updatedAlerts;
  }

  return alerts;
}
