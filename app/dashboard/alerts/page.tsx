"use client";

import { useState, useEffect } from "react";

import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  Button,
  TablePagination,
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { AlertCircle, Package, AlertTriangle, CheckCircle } from "lucide-react";

import { useInventory } from "@/context/inventory-context";

import { MetricCard } from "@/components/metric-card";
import { ToastNotification } from "@/components/toast-notification";

export default function AlertsPage() {
  const { alerts, products, updateAlertStatus, generateAlerts } =
    useInventory();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedAlert, setSelectedAlert] = useState<(typeof alerts)[0] | null>(
    null,
  );
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState<
    "acknowledged" | "resolved" | "dismissed"
  >("acknowledged");
  const [actionNotes, setActionNotes] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    const timer = setTimeout(async () => {
      await generateAlerts();
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount, not when generateAlerts changes

  const pendingAlerts = alerts.filter((a) => a.status === "pending");
  const criticalAlerts = alerts.filter(
    (a) => a.alertLevel === "critical" && a.status === "pending",
  );
  const lowStockAlerts = alerts.filter(
    (a) => a.alertLevel === "low" && a.status === "pending",
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionClick = (alert: (typeof alerts)[0]) => {
    setSelectedAlert(alert);
    setActionStatus("acknowledged");
    setActionNotes("");
    setActionDialogOpen(true);
  };

  const handleActionConfirm = async () => {
    if (selectedAlert) {
      try {
        await updateAlertStatus(selectedAlert.id, actionStatus, actionNotes);
        setToast({
          open: true,
          message: `Alert ${actionStatus} successfully`,
          severity: "success",
        });
        setActionDialogOpen(false);
        setSelectedAlert(null);
      } catch {
        setToast({
          open: true,
          message: "Failed to update alert",
          severity: "error",
        });
      }
    }
  };

  const getProductName = (productId: number) => {
    return products.find((p) => p.id === productId)?.name || "Unknown Product";
  };

  const getProductSKU = (productId: number) => {
    return products.find((p) => p.id === productId)?.sku || "N/A";
  };

  const paginatedAlerts = alerts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );
  console.log(paginatedAlerts);

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Stock Alerts
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and manage low stock situations across all warehouses
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={async () => {
            try {
              await generateAlerts();
              setToast({
                open: true,
                message: "Alerts refreshed",
                severity: "success",
              });
            } catch {
              setToast({
                open: true,
                message: "Failed to refresh alerts",
                severity: "error",
              });
            }
          }}
          sx={{ height: "fit-content" }}
        >
          Refresh Alerts
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4, mt: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            title="Pending Alerts"
            value={pendingAlerts.length}
            icon={AlertCircle}
            subtitle="Requires action"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            title="Critical Alerts"
            value={criticalAlerts.length}
            icon={AlertTriangle}
            subtitle="Immediate attention needed"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            title="Low Stock Alerts"
            value={lowStockAlerts.length}
            icon={Package}
            subtitle="Reorder soon"
          />
        </Grid>
      </Grid>

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
                  Product
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
                  Current Stock
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
                  Alert Level
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
                  Recommended Order
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
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Actions
                </Box>
              </Box>
            </Box>
            <Box component="tbody">
              {paginatedAlerts.map((alert) => (
                <Box
                  component="tr"
                  key={alert.id}
                  sx={{
                    borderTop: 1,
                    borderColor: "divider",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <Box
                    component="td"
                    sx={{ p: 2, fontSize: "0.875rem", fontFamily: "monospace" }}
                  >
                    {getProductSKU(alert.productId)}
                  </Box>
                  <Box
                    component="td"
                    sx={{ p: 2, fontSize: "0.875rem", fontWeight: 500 }}
                  >
                    {getProductName(alert.productId)}
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
                    {alert.totalStock}
                  </Box>
                  <Box
                    component="td"
                    sx={{ p: 2, fontSize: "0.875rem", textAlign: "right" }}
                  >
                    {alert.reorderPoint}
                  </Box>
                  <Box component="td" sx={{ p: 2 }}>
                    <Chip
                      label={alert.alertLevel.toUpperCase()}
                      size="small"
                      icon={
                        alert.alertLevel === "critical" ? (
                          <AlertTriangle size={14} />
                        ) : alert.alertLevel === "low" ? (
                          <AlertCircle size={14} />
                        ) : (
                          <CheckCircle size={14} />
                        )
                      }
                      sx={{
                        bgcolor:
                          alert.alertLevel === "critical"
                            ? "error.light"
                            : alert.alertLevel === "low"
                              ? "warning.light"
                              : "success.light",
                        color:
                          alert.alertLevel === "critical"
                            ? "error.dark"
                            : alert.alertLevel === "low"
                              ? "warning.dark"
                              : "success.dark",
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
                      textAlign: "right",
                      fontWeight: 600,
                    }}
                  >
                    {alert.recommendedOrderQuantity > 0
                      ? alert.recommendedOrderQuantity
                      : "—"}
                  </Box>
                  <Box component="td" sx={{ p: 2 }}>
                    <Chip
                      label={alert.status.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor:
                          alert.status === "pending"
                            ? "info.light"
                            : alert.status === "acknowledged"
                              ? "warning.light"
                              : alert.status === "resolved"
                                ? "success.light"
                                : "grey.300",
                        color:
                          alert.status === "pending"
                            ? "info.dark"
                            : alert.status === "acknowledged"
                              ? "warning.dark"
                              : alert.status === "resolved"
                                ? "success.dark"
                                : "text.secondary",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    />
                  </Box>
                  <Box component="td" sx={{ p: 2, textAlign: "center" }}>
                    {alert.status === "pending" && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActionClick(alert);
                        }}
                        sx={{ fontSize: "0.75rem" }}
                      >
                        Take Action
                      </Button>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <TablePagination
          component="div"
          count={alerts.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      <Dialog
        open={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Alert Status</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              select
              fullWidth
              label="Status"
              value={actionStatus}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setActionStatus(
                  e.target.value as "acknowledged" | "resolved" | "dismissed",
                )
              }
            >
              <MenuItem value="acknowledged">Acknowledged</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="dismissed">Dismissed</MenuItem>
            </TextField>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes (Optional)"
              value={actionNotes}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setActionNotes(e.target.value)
              }
              placeholder="Add any notes about this action..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleActionConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <ToastNotification
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Container>
  );
}
