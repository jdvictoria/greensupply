"use client";

import { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  CircularProgress,
  Alert,
  MenuItem,
} from "@mui/material";
import { ArrowRightLeft, Package } from "lucide-react";

import { useInventory } from "@/context/inventory-context";

import { ToastNotification } from "@/components/toast-notification";

export default function TransfersPage() {
  const {
    products,
    warehouses,
    transfers,
    createTransfer,
    getStockForProduct,
  } = useInventory();

  const [formData, setFormData] = useState({
    productId: "",
    fromWarehouseId: "",
    toWarehouseId: "",
    quantity: "",
    initiatedBy: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productId) newErrors.productId = "Product is required";
    if (!formData.fromWarehouseId)
      newErrors.fromWarehouseId = "Source warehouse is required";
    if (!formData.toWarehouseId)
      newErrors.toWarehouseId = "Destination warehouse is required";
    if (!formData.quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (Number.parseInt(formData.quantity) <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }
    if (!formData.initiatedBy)
      newErrors.initiatedBy = "Initiated by is required";

    if (formData.fromWarehouseId === formData.toWarehouseId) {
      newErrors.toWarehouseId = "Destination must be different from source";
    }

    // Check if source warehouse has enough stock
    if (formData.productId && formData.fromWarehouseId && formData.quantity) {
      const availableStock = getStockForProduct(
        Number.parseInt(formData.productId),
        Number.parseInt(formData.fromWarehouseId),
      );
      if (Number.parseInt(formData.quantity) > availableStock) {
        newErrors.quantity = `Insufficient stock. Available: ${availableStock}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      await createTransfer({
        productId: Number.parseInt(formData.productId),
        fromWarehouseId: Number.parseInt(formData.fromWarehouseId),
        toWarehouseId: Number.parseInt(formData.toWarehouseId),
        quantity: Number.parseInt(formData.quantity),
        initiatedBy: formData.initiatedBy,
        notes: formData.notes || undefined,
      });

      setToast({
        open: true,
        message: "Transfer completed successfully!",
        severity: "success",
      });

      // Reset form
      setFormData({
        productId: "",
        fromWarehouseId: "",
        toWarehouseId: "",
        quantity: "",
        initiatedBy: "",
        notes: "",
      });
      setErrors({});
    } catch (error) {
      console.error(error);
      setSubmitError("Failed to create transfer. Please try again.");
      setToast({
        open: true,
        message: "Failed to create transfer",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      if (errors[field]) {
        setErrors({ ...errors, [field]: "" });
      }
      setSubmitError("");
    };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const getProductName = (productId: number) => {
    return products.find((p) => p.id === productId)?.name || "Unknown Product";
  };

  const getWarehouseName = (warehouseId: number) => {
    return (
      warehouses.find((w) => w.id === warehouseId)?.name || "Unknown Warehouse"
    );
  };

  const availableStock =
    formData.productId && formData.fromWarehouseId
      ? getStockForProduct(
          Number.parseInt(formData.productId),
          Number.parseInt(formData.fromWarehouseId),
        )
      : null;

  const isFormValid =
    formData.productId &&
    formData.fromWarehouseId &&
    formData.toWarehouseId &&
    formData.quantity &&
    formData.initiatedBy &&
    formData.fromWarehouseId !== formData.toWarehouseId &&
    Object.keys(errors).length === 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Stock Transfers
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Initiate and track inventory transfers between warehouses
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Transfer Form */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <ArrowRightLeft size={24} className="text-primary" />
              <Typography variant="h6" fontWeight={600}>
                New Transfer
              </Typography>
            </Box>

            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    select
                    fullWidth
                    label="Product"
                    value={formData.productId}
                    onChange={handleChange("productId")}
                    error={!!errors.productId}
                    helperText={errors.productId}
                    required
                  >
                    {products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="From Warehouse"
                    value={formData.fromWarehouseId}
                    onChange={handleChange("fromWarehouseId")}
                    error={!!errors.fromWarehouseId}
                    helperText={errors.fromWarehouseId}
                    required
                  >
                    {warehouses.map((warehouse) => (
                      <MenuItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="To Warehouse"
                    value={formData.toWarehouseId}
                    onChange={handleChange("toWarehouseId")}
                    error={!!errors.toWarehouseId}
                    helperText={errors.toWarehouseId}
                    required
                  >
                    {warehouses.map((warehouse) => (
                      <MenuItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Quantity"
                    value={formData.quantity}
                    onChange={handleChange("quantity")}
                    error={!!errors.quantity}
                    helperText={
                      errors.quantity ||
                      (availableStock !== null
                        ? `Available stock: ${availableStock}`
                        : "")
                    }
                    required
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Initiated By"
                    value={formData.initiatedBy}
                    onChange={handleChange("initiatedBy")}
                    error={!!errors.initiatedBy}
                    helperText={errors.initiatedBy}
                    required
                    placeholder="Enter your name"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Notes (Optional)"
                    value={formData.notes}
                    onChange={handleChange("notes")}
                    multiline
                    rows={3}
                    placeholder="Add any additional notes about this transfer"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={!isFormValid || loading}
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Package size={20} />
                      )
                    }
                  >
                    {loading ? "Processing Transfer..." : "Initiate Transfer"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Transfer History */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Transfer History
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {transfers.length} total transfers
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Product</strong>
                    </TableCell>
                    <TableCell>
                      <strong>From → To</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Qty</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Initiated By</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Date</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transfers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((transfer) => (
                      <TableRow key={transfer.id} hover>
                        <TableCell>
                          {getProductName(transfer.productId)}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              fontSize: "0.875rem",
                            }}
                          >
                            {getWarehouseName(transfer.fromWarehouseId)}
                            <ArrowRightLeft size={14} />
                            {getWarehouseName(transfer.toWarehouseId)}
                          </Box>
                        </TableCell>
                        <TableCell align="right">{transfer.quantity}</TableCell>
                        <TableCell>{transfer.initiatedBy}</TableCell>
                        <TableCell>
                          <Chip
                            label={transfer.status}
                            size="small"
                            color={
                              transfer.status === "completed"
                                ? "success"
                                : "warning"
                            }
                            sx={{ textTransform: "capitalize" }}
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(transfer.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={transfers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>

      <ToastNotification
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Container>
  );
}
