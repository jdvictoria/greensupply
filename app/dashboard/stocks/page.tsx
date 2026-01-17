"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { stock, products, warehouses, getInventoryOverview } from "@/lib/utils";

export default function StockLevelsPage() {
  const [loading, setLoading] = useState(true);
  const [inventoryItems, setInventoryItems] = useState<
    ReturnType<typeof getInventoryOverview>
  >([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInventoryItems(getInventoryOverview());
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  // Stock by warehouse
  const stockByWarehouse = warehouses.map((warehouse) => {
    const warehouseStock = stock.filter((s) => s.warehouseId === warehouse.id);
    const totalQuantity = warehouseStock.reduce(
      (sum, s) => sum + s.quantity,
      0,
    );
    return {
      name: warehouse.code,
      quantity: totalQuantity,
    };
  });

  // Stock status distribution
  const statusCounts = inventoryItems.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const statusData = [
    {
      name: "In Stock",
      value: statusCounts["In Stock"] || 0,
      color: "#4caf50",
    },
    {
      name: "Low Stock",
      value: statusCounts["Low Stock"] || 0,
      color: "#ff9800",
    },
    {
      name: "Out of Stock",
      value: statusCounts["Out of Stock"] || 0,
      color: "#f44336",
    },
  ];

  // Top products by stock
  const topProducts = inventoryItems
    .sort((a, b) => b.totalStock - a.totalStock)
    .slice(0, 6)
    .map((item) => ({
      name:
        item.product.name.length > 20
          ? item.product.name.substring(0, 20) + "..."
          : item.product.name,
      stock: item.totalStock,
    }));

  const paginatedProducts = products.slice(
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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Stock Levels
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Analyze stock distribution and levels
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{ border: 1, borderColor: "divider", height: "100%" }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Stock by Warehouse
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockByWarehouse}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="quantity"
                    fill="hsl(var(--primary))"
                    name="Total Quantity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{ border: 1, borderColor: "divider", height: "100%" }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Stock Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`
                    }
                    outerRadius={80}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card elevation={0} sx={{ border: 1, borderColor: "divider" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Top Products by Stock Level
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="stock"
                    fill="hsl(var(--accent))"
                    name="Stock Quantity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Detailed Stock by Warehouse
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
                {warehouses.map((warehouse) => (
                  <Box
                    key={warehouse.id}
                    component="th"
                    sx={{
                      p: 2,
                      textAlign: "center",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                    }}
                  >
                    {warehouse.code}
                  </Box>
                ))}
                <Box
                  component="th"
                  sx={{
                    p: 2,
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Total
                </Box>
              </Box>
            </Box>
            <Box component="tbody">
              {paginatedProducts.map((product) => {
                const productStock = stock.filter(
                  (s) => s.productId === product.id,
                );
                const totalStock = productStock.reduce(
                  (sum, s) => sum + s.quantity,
                  0,
                );

                return (
                  <Box
                    component="tr"
                    key={product.id}
                    sx={{
                      borderTop: 1,
                      borderColor: "divider",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Box
                      component="td"
                      sx={{ p: 2, fontSize: "0.875rem", fontWeight: 500 }}
                    >
                      {product.name}
                    </Box>
                    {warehouses.map((warehouse) => {
                      const stockItem = stock.find(
                        (s) =>
                          s.productId === product.id &&
                          s.warehouseId === warehouse.id,
                      );
                      return (
                        <Box
                          key={warehouse.id}
                          component="td"
                          sx={{
                            p: 2,
                            fontSize: "0.875rem",
                            textAlign: "center",
                          }}
                        >
                          {stockItem ? stockItem.quantity : 0}
                        </Box>
                      );
                    })}
                    <Box
                      component="td"
                      sx={{
                        p: 2,
                        fontSize: "0.875rem",
                        textAlign: "center",
                        fontWeight: 700,
                      }}
                    >
                      {totalStock}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
        <TablePagination
          component="div"
          count={products.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>
    </Container>
  );
}
