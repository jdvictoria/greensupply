"use client";

import type { Alert } from "@/lib/types";
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

    // Check if there's any existing alert for this product
    const existingAlert = alerts.find((a) => a.productId === product.id);

    // If alert exists and is not resolved/dismissed, skip creating a new one
    if (
      existingAlert &&
      existingAlert.status !== "resolved" &&
      existingAlert.status !== "dismissed"
    ) {
      return;
    }

    // If alert exists but is resolved/dismissed, check if we should create a new one
    if (
      existingAlert &&
      (existingAlert.status === "resolved" ||
        existingAlert.status === "dismissed")
    ) {
      // Calculate what the alert level would be
      const wouldBeCritical =
        totalStock === 0 || totalStock < product.reorderPoint * 0.5;
      const wouldBeLow =
        totalStock < product.reorderPoint &&
        totalStock >= product.reorderPoint * 0.5;

      // Only create a new alert if:
      // 1. Stock situation warrants an alert (critical or low)
      // 2. AND stock level is different from the resolved alert
      if (wouldBeCritical || wouldBeLow) {
        // Don't create duplicate if stock level is exactly the same
        // This prevents immediate duplicates after resolving an alert
        if (existingAlert.totalStock === totalStock) {
          return;
        }
        // Also don't create if stock is very similar (within small margin)
        // This handles cases where stock might have changed slightly due to transfers
        if (Math.abs(existingAlert.totalStock - totalStock) <= 5) {
          return;
        }
      } else {
        // Stock situation doesn't warrant an alert, so don't create one
        return;
      }
    }

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
