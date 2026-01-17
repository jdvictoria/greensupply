"use client";

import React, { useState, useEffect } from "react";

import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Chip,
  TablePagination,
  CircularProgress,
  Button,
} from "@mui/material";

import {
  Package,
  Warehouse,
  DollarSign,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

import { MetricCard } from "@/components/metric-card";
import { ViewDialog } from "@/components/view-dialog";

import {
  getInventoryOverview,
  getTotalInventoryValue,
  products,
  warehouses,
} from "@/lib/utils";

import { useInventory } from "@/context/inventory-context";
import { resetDataAction } from "@/app/actions/reset";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [inventoryItems, setInventoryItems] = useState<
    ReturnType<typeof getInventoryOverview>
  >([]);
  const [totalValue, setTotalValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    ReturnType<typeof getInventoryOverview>[0] | null
  >(null);
  const { alerts } = useInventory();

  useEffect(() => {
    const timer = setTimeout(() => {
      setInventoryItems(getInventoryOverview());
      setTotalValue(getTotalInventoryValue());
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const totalProducts = products.length;
  const totalWarehouses = warehouses.length;
  const pendingAlertsCount = alerts.filter(
    (a) => a.status === "pending",
  ).length;

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (item: ReturnType<typeof getInventoryOverview>[0]) => {
    setSelectedItem(item);
    setViewDialogOpen(true);
  };

  const paginatedItems = inventoryItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

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

  const handleReset = async () => {
    if (
      confirm(
        "Are you sure you want to reset all data? This will restore all data to default values.",
      )
    ) {
      await resetDataAction();
      window.location.reload();
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor your inventory across all warehouse locations
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="error"
          startIcon={<RotateCcw size={20} />}
          onClick={handleReset}
          sx={{ minWidth: "auto" }}
        >
          Reset Data
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Total Products"
            value={totalProducts}
            icon={Package}
            subtitle="Unique SKUs"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Total Warehouses"
            value={totalWarehouses}
            icon={Warehouse}
            subtitle="Active locations"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Total Inventory Value"
            value={`$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={DollarSign}
            subtitle="Across all warehouses"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Pending Alerts"
            value={pendingAlertsCount}
            icon={AlertCircle}
            subtitle="Requires attention"
          />
        </Grid>
      </Grid>

      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Inventory Overview
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
                <Box
                  component="th"
                  sx={{
                    p: 2,
                    textAlign: "right",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Total Stock
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
                  Reorder Point
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
              </Box>
            </Box>
            <Box component="tbody">
              {paginatedItems.map((item) => (
                <Box
                  component="tr"
                  key={item.product.id}
                  onClick={() => handleRowClick(item)}
                  sx={{
                    borderTop: 1,
                    borderColor: "divider",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <Box
                    component="td"
                    sx={{ p: 2, fontSize: "0.875rem", fontFamily: "monospace" }}
                  >
                    {item.product.sku}
                  </Box>
                  <Box
                    component="td"
                    sx={{ p: 2, fontSize: "0.875rem", fontWeight: 500 }}
                  >
                    {item.product.name}
                  </Box>
                  <Box
                    component="td"
                    sx={{ p: 2, fontSize: "0.875rem", color: "text.secondary" }}
                  >
                    {item.product.category}
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      p: 2,
                      fontSize: "0.875rem",
                      textAlign: "right",
                      color: "text.secondary",
                    }}
                  >
                    ${item.product.unitCost.toFixed(2)}
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
                    $
                    {(item.product.unitCost * item.totalStock).toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}
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
                    {item.totalStock.toLocaleString()}
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      p: 2,
                      fontSize: "0.875rem",
                      textAlign: "right",
                      color: "text.secondary",
                    }}
                  >
                    {item.product.reorderPoint}
                  </Box>
                  <Box component="td" sx={{ p: 2 }}>
                    <Chip
                      label={item.status}
                      size="small"
                      sx={{
                        bgcolor:
                          item.status === "In Stock"
                            ? "success.light"
                            : item.status === "Low Stock"
                              ? "warning.light"
                              : "error.light",
                        color:
                          item.status === "In Stock"
                            ? "success.dark"
                            : item.status === "Low Stock"
                              ? "warning.dark"
                              : "error.dark",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <TablePagination
          component="div"
          count={inventoryItems.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {selectedItem && (
        <ViewDialog
          open={viewDialogOpen}
          title="Product Details"
          fields={[
            { label: "SKU", value: selectedItem.product.sku },
            { label: "Product Name", value: selectedItem.product.name },
            { label: "Category", value: selectedItem.product.category },
            {
              label: "Unit Cost",
              value: `$${selectedItem.product.unitCost.toFixed(2)}`,
            },
            {
              label: "Total Stock",
              value: selectedItem.totalStock.toLocaleString(),
            },
            {
              label: "Reorder Point",
              value: selectedItem.product.reorderPoint,
            },
            { label: "Status", value: selectedItem.status },
          ]}
          onClose={() => setViewDialogOpen(false)}
        />
      )}
    </Container>
  );
}
