"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Chip,
  TablePagination,
  CircularProgress,
  Button,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import Link from "next/link";
import {
  Package,
  MapPin,
  Building2,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

import { useInventory } from "@/context/inventory-context";
import type { Stock, Transfer, Product, Warehouse } from "@/lib/types";

import { MetricCard } from "@/components/metric-card";
import { ViewDialog } from "@/components/view-dialog";

type SelectedStockItem = Stock & { product: Product | undefined };
type SelectedTransferItem = Transfer & {
  product: Product | undefined;
  fromWarehouse: Warehouse | undefined;
  toWarehouse: Warehouse | undefined;
};
type SelectedItem = SelectedStockItem | SelectedTransferItem | null;

export default function WarehouseDetailPage() {
  const params = useParams();
  const warehouseId = Number.parseInt(params.id as string);

  const { warehouses, stock, products, transfers } = useInventory();
  const [loading, setLoading] = useState(true);
  const [stockPage, setStockPage] = useState(0);
  const [stockRowsPerPage, setStockRowsPerPage] = useState(10);
  const [transferPage, setTransferPage] = useState(0);
  const [transferRowsPerPage, setTransferRowsPerPage] = useState(10);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  const [dialogType, setDialogType] = useState<"stock" | "transfer">("stock");

  const warehouse = warehouses.find((w) => w.id === warehouseId);
  const warehouseStock = stock.filter((s) => s.warehouseId === warehouseId);
  const warehouseTransfers = transfers.filter(
    (t) => t.fromWarehouseId === warehouseId || t.toWarehouseId === warehouseId,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          py: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (!warehouse) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h5" color="error">
          Warehouse not found
        </Typography>
        <Button component={Link} href="/dashboard/warehouses" sx={{ mt: 2 }}>
          Back to Warehouses
        </Button>
      </Container>
    );
  }

  const totalProducts = warehouseStock.length;
  const totalStockQuantity = warehouseStock.reduce(
    (sum, s) => sum + s.quantity,
    0,
  );
  const totalValue = warehouseStock.reduce((sum, s) => {
    const product = products.find((p) => p.id === s.productId);
    return sum + (product ? product.unitCost * s.quantity : 0);
  }, 0);

  const handleStockRowClick = (stockItem: (typeof warehouseStock)[0]) => {
    const product = products.find((p) => p.id === stockItem.productId);
    setSelectedItem({
      ...stockItem,
      product,
    });
    setDialogType("stock");
    setViewDialogOpen(true);
  };

  const handleTransferRowClick = (transfer: (typeof warehouseTransfers)[0]) => {
    const product = products.find((p) => p.id === transfer.productId);
    const fromWarehouse = warehouses.find(
      (w) => w.id === transfer.fromWarehouseId,
    );
    const toWarehouse = warehouses.find((w) => w.id === transfer.toWarehouseId);
    setSelectedItem({
      ...transfer,
      product,
      fromWarehouse,
      toWarehouse,
    });
    setDialogType("transfer");
    setViewDialogOpen(true);
  };

  const paginatedStock = warehouseStock.slice(
    stockPage * stockRowsPerPage,
    stockPage * stockRowsPerPage + stockRowsPerPage,
  );
  const paginatedTransfers = warehouseTransfers.slice(
    transferPage * transferRowsPerPage,
    transferPage * transferRowsPerPage + transferRowsPerPage,
  );

  const isSelectedStockItem = (
    item: SelectedItem,
  ): item is SelectedStockItem => {
    return (
      item !== null && "warehouseId" in item && !("fromWarehouseId" in item)
    );
  };

  const isSelectedTransferItem = (
    item: SelectedItem,
  ): item is SelectedTransferItem => {
    return item !== null && "fromWarehouseId" in item;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <MuiLink
          component={Link}
          href="/dashboard/warehouses"
          underline="hover"
          color="inherit"
        >
          Warehouses
        </MuiLink>
        <Typography color="text.primary">{warehouse.name}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {warehouse.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <MapPin size={16} />
            <Typography variant="body1" color="text.secondary">
              {warehouse.location}
            </Typography>
            <Chip
              label={warehouse.code}
              size="small"
              sx={{ ml: 1, fontFamily: "monospace" }}
            />
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            title="Total Products"
            value={totalProducts}
            icon={Package}
            subtitle="Unique SKUs"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            title="Total Stock Quantity"
            value={totalStockQuantity.toLocaleString()}
            icon={Building2}
            subtitle="Items in warehouse"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            title="Inventory Value"
            value={`$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={TrendingUp}
            subtitle="Total value"
          />
        </Grid>
      </Grid>

      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Stock Details
      </Typography>
      <Paper
        elevation={0}
        sx={{ border: 1, borderColor: "divider", overflow: "hidden", mb: 4 }}
      >
        <Box sx={{ overflowX: "auto" }}>
          <Box
            component="table"
            sx={{ width: "100%", borderCollapse: "collapse" }}
          >
            <Box component="thead" sx={{ bgcolor: "grey.50" }}>
              <Box component="tr">
                <Box
                  component="th"
                  sx={{
                    p: 2,
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  SKU
                </Box>
                <Box
                  component="th"
                  sx={{
                    p: 2,
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Product Name
                </Box>
                <Box
                  component="th"
                  sx={{
                    p: 2,
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Category
                </Box>
                <Box
                  component="th"
                  sx={{
                    p: 2,
                    textAlign: "right",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Quantity
                </Box>
                <Box
                  component="th"
                  sx={{
                    p: 2,
                    textAlign: "right",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Unit Cost
                </Box>
                <Box
                  component="th"
                  sx={{
                    p: 2,
                    textAlign: "right",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Total Value
                </Box>
              </Box>
            </Box>
            <Box component="tbody">
              {paginatedStock.map((stockItem) => {
                const product = products.find(
                  (p) => p.id === stockItem.productId,
                );
                if (!product) return null;
                const totalValue = product.unitCost * stockItem.quantity;
                return (
                  <Box
                    component="tr"
                    key={stockItem.id}
                    onClick={() => handleStockRowClick(stockItem)}
                    sx={{
                      borderTop: 1,
                      borderColor: "divider",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Box
                      component="td"
                      sx={{
                        p: 2,
                        fontSize: "0.875rem",
                        fontFamily: "monospace",
                      }}
                    >
                      {product.sku}
                    </Box>
                    <Box
                      component="td"
                      sx={{ p: 2, fontSize: "0.875rem", fontWeight: 500 }}
                    >
                      {product.name}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        p: 2,
                        fontSize: "0.875rem",
                        color: "text.secondary",
                      }}
                    >
                      {product.category}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        p: 2,
                        fontSize: "0.875rem",
                        textAlign: "right",
                        fontWeight: 600,
                      }}
                    >
                      {stockItem.quantity.toLocaleString()}
                    </Box>
                    <Box
                      component="td"
                      sx={{ p: 2, fontSize: "0.875rem", textAlign: "right" }}
                    >
                      ${product.unitCost.toFixed(2)}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        p: 2,
                        fontSize: "0.875rem",
                        textAlign: "right",
                        fontWeight: 600,
                      }}
                    >
                      ${totalValue.toFixed(2)}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
        <TablePagination
          component="div"
          count={warehouseStock.length}
          page={stockPage}
          onPageChange={(_, newPage) => setStockPage(newPage)}
          rowsPerPage={stockRowsPerPage}
          onRowsPerPageChange={(e) => {
            setStockRowsPerPage(Number.parseInt(e.target.value, 10));
            setStockPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Transfer History
      </Typography>
      <Paper
        elevation={0}
        sx={{ border: 1, borderColor: "divider", overflow: "hidden" }}
      >
        <Box sx={{ overflowX: "auto" }}>
          <Box
            component="table"
            sx={{ width: "100%", borderCollapse: "collapse" }}
          >
            <Box component="thead" sx={{ bgcolor: "grey.50" }}>
              <Box component="tr">
                <Box
                  component="th"
                  sx={{
                    p: 2,
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Product
                </Box>
                <Box
                  component="th"
                  sx={{
                    p: 2,
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  From
                </Box>
                <Box
                  component="th"
                  sx={{
                    p: 2,
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  To
                </Box>
                <Box
                  component="th"
                  sx={{
                    p: 2,
                    textAlign: "right",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Quantity
                </Box>
                <Box
                  component="th"
                  sx={{
                    p: 2,
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Status
                </Box>
                <Box
                  component="th"
                  sx={{
                    p: 2,
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Date
                </Box>
              </Box>
            </Box>
            <Box component="tbody">
              {paginatedTransfers.map((transfer) => {
                const product = products.find(
                  (p) => p.id === transfer.productId,
                );
                const fromWarehouse = warehouses.find(
                  (w) => w.id === transfer.fromWarehouseId,
                );
                const toWarehouse = warehouses.find(
                  (w) => w.id === transfer.toWarehouseId,
                );
                const isOutbound = transfer.fromWarehouseId === warehouseId;
                return (
                  <Box
                    component="tr"
                    key={transfer.id}
                    onClick={() => handleTransferRowClick(transfer)}
                    sx={{
                      borderTop: 1,
                      borderColor: "divider",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Box
                      component="td"
                      sx={{ p: 2, fontSize: "0.875rem", fontWeight: 500 }}
                    >
                      {product?.name || "Unknown"}
                    </Box>
                    <Box component="td" sx={{ p: 2, fontSize: "0.875rem" }}>
                      {fromWarehouse?.name || "Unknown"}
                    </Box>
                    <Box component="td" sx={{ p: 2, fontSize: "0.875rem" }}>
                      {toWarehouse?.name || "Unknown"}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        p: 2,
                        fontSize: "0.875rem",
                        textAlign: "right",
                        fontWeight: 600,
                        color: isOutbound ? "error.main" : "success.main",
                      }}
                    >
                      {isOutbound ? "-" : "+"}
                      {transfer.quantity}
                    </Box>
                    <Box component="td" sx={{ p: 2 }}>
                      <Chip
                        label={transfer.status.toUpperCase()}
                        size="small"
                        sx={{
                          bgcolor:
                            transfer.status === "completed"
                              ? "success.light"
                              : transfer.status === "pending"
                                ? "warning.light"
                                : "error.light",
                          color:
                            transfer.status === "completed"
                              ? "success.dark"
                              : transfer.status === "pending"
                                ? "warning.dark"
                                : "error.dark",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                        }}
                      />
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        p: 2,
                        fontSize: "0.875rem",
                        color: "text.secondary",
                      }}
                    >
                      {new Date(transfer.createdAt).toLocaleDateString()}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
        <TablePagination
          component="div"
          count={warehouseTransfers.length}
          page={transferPage}
          onPageChange={(_, newPage) => setTransferPage(newPage)}
          rowsPerPage={transferRowsPerPage}
          onRowsPerPageChange={(e) => {
            setTransferRowsPerPage(Number.parseInt(e.target.value, 10));
            setTransferPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {selectedItem &&
        dialogType === "stock" &&
        isSelectedStockItem(selectedItem) && (
          <ViewDialog
            open={viewDialogOpen}
            title="Stock Details"
            fields={[
              {
                label: "Product",
                value: selectedItem.product?.name || "Unknown",
              },
              { label: "SKU", value: selectedItem.product?.sku || "N/A" },
              {
                label: "Category",
                value: selectedItem.product?.category || "N/A",
              },
              {
                label: "Quantity",
                value: selectedItem.quantity.toLocaleString(),
              },
              {
                label: "Unit Cost",
                value: selectedItem.product?.unitCost
                  ? `$${selectedItem.product.unitCost.toFixed(2)}`
                  : "N/A",
              },
              {
                label: "Total Value",
                value:
                  selectedItem.product?.unitCost !== undefined
                    ? `$${(selectedItem.product.unitCost * selectedItem.quantity).toFixed(2)}`
                    : "N/A",
              },
              {
                label: "Reorder Point",
                value: selectedItem.product?.reorderPoint || "N/A",
              },
            ]}
            onClose={() => setViewDialogOpen(false)}
          />
        )}

      {selectedItem &&
        dialogType === "transfer" &&
        isSelectedTransferItem(selectedItem) && (
          <ViewDialog
            open={viewDialogOpen}
            title="Transfer Details"
            fields={[
              {
                label: "Product",
                value: selectedItem.product?.name || "Unknown",
              },
              {
                label: "From Warehouse",
                value: selectedItem.fromWarehouse?.name || "Unknown",
              },
              {
                label: "To Warehouse",
                value: selectedItem.toWarehouse?.name || "Unknown",
              },
              {
                label: "Quantity",
                value: selectedItem.quantity.toLocaleString(),
              },
              { label: "Status", value: selectedItem.status.toUpperCase() },
              { label: "Initiated By", value: selectedItem.initiatedBy },
              {
                label: "Created At",
                value: new Date(selectedItem.createdAt).toLocaleString(),
              },
              {
                label: "Completed At",
                value: selectedItem.completedAt
                  ? new Date(selectedItem.completedAt).toLocaleString()
                  : "N/A",
              },
              { label: "Notes", value: selectedItem.notes || "No notes" },
            ]}
            onClose={() => setViewDialogOpen(false)}
          />
        )}
    </Container>
  );
}
