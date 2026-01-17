"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  TablePagination,
  CircularProgress,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { Edit, Trash2, Plus } from "lucide-react";

import type { Product } from "@/lib/types";
import { products as initialProducts } from "@/lib/utils";

import { ToastNotification } from "@/components/toast-notification";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";

const categories = [
  "Personal Care",
  "Kitchen",
  "Accessories",
  "Drinkware",
  "Electronics",
  "Household",
  "Office",
  "Clothing",
  "Fitness",
];

type FormState = {
  sku: string;
  name: string;
  category: string;
  unitCost: string;
  reorderPoint: string;
};

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    product: Product | null;
  }>({
    open: false,
    product: null,
  });
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState<FormState>({
    sku: "",
    name: "",
    category: "",
    unitCost: "",
    reorderPoint: "",
  });

  const [errors, setErrors] = useState<FormState>({
    sku: "",
    name: "",
    category: "",
    unitCost: "",
    reorderPoint: "",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(initialProducts);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    const nextErrors: FormState = {
      sku: formData.sku ? "" : "SKU is required",
      name: formData.name ? "" : "Product name is required",
      category: formData.category ? "" : "Category is required",
      unitCost:
        formData.unitCost && Number(formData.unitCost) > 0
          ? ""
          : "Unit cost must be greater than 0",
      reorderPoint:
        formData.reorderPoint && Number(formData.reorderPoint) >= 0
          ? ""
          : "Reorder point must be 0 or greater",
    };

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingProduct) {
      // Edit existing product
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                sku: formData.sku,
                name: formData.name,
                category: formData.category,
                unitCost: Number(formData.unitCost),
                reorderPoint: Number(formData.reorderPoint),
              }
            : p,
        ),
      );
      setToast({
        open: true,
        message: "Product updated successfully!",
        severity: "success",
      });
    } else {
      // Add new product
      setProducts((prev) => [
        ...prev,
        {
          id: Math.max(...prev.map((p) => p.id)) + 1,
          sku: formData.sku,
          name: formData.name,
          category: formData.category,
          unitCost: Number(formData.unitCost),
          reorderPoint: Number(formData.reorderPoint),
        },
      ]);
      setToast({
        open: true,
        message: "Product added successfully!",
        severity: "success",
      });
    }

    handleCloseDialog();
  };

  const handleEdit = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      category: product.category,
      unitCost: product.unitCost.toString(),
      reorderPoint: product.reorderPoint.toString(),
    });
    setOpenDialog(true);
  };

  const handleDeleteClick = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialog({ open: true, product });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.product) {
      setProducts((prev) =>
        prev.filter((p) => p.id !== deleteDialog.product?.id),
      );
      setToast({
        open: true,
        message: "Product deleted successfully!",
        severity: "success",
      });
      setDeleteDialog({ open: false, product: null });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormData({
      sku: "",
      name: "",
      category: "",
      unitCost: "",
      reorderPoint: "",
    });
    setErrors({
      sku: "",
      name: "",
      category: "",
      unitCost: "",
      reorderPoint: "",
    });
  };

  const paginatedProducts = products.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  if (loading) {
    return (
      <Container sx={{ py: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Products
        </Typography>
        <Button
          startIcon={<Plus />}
          variant="contained"
          onClick={() => setOpenDialog(true)}
        >
          Add Product
        </Button>
      </Box>

      <Paper elevation={0} sx={{ border: 1, borderColor: "divider" }}>
        <Box
          component="table"
          sx={{ width: "100%", borderCollapse: "collapse" }}
        >
          <Box component="thead">
            <Box component="tr">
              {["SKU", "Name", "Category", "Cost", "Reorder", "Actions"].map(
                (h) => (
                  <Box key={h} component="th" sx={{ p: 2, textAlign: "left" }}>
                    {h}
                  </Box>
                ),
              )}
            </Box>
          </Box>
          <Box component="tbody">
            {paginatedProducts.map((p) => (
              <Box key={p.id} component="tr">
                <Box component="td" sx={{ p: 2 }}>
                  {p.sku}
                </Box>
                <Box component="td" sx={{ p: 2 }}>
                  {p.name}
                </Box>
                <Box component="td" sx={{ p: 2 }}>
                  {p.category}
                </Box>
                <Box component="td" sx={{ p: 2 }}>
                  ${p.unitCost}
                </Box>
                <Box component="td" sx={{ p: 2 }}>
                  {p.reorderPoint}
                </Box>
                <Box component="td" sx={{ p: 2 }}>
                  <IconButton
                    onClick={(e) => handleEdit(p, e)}
                    aria-label={`Edit ${p.name}`}
                  >
                    <Edit size={16} />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={(e) => handleDeleteClick(p, e)}
                    aria-label={`Delete ${p.name}`}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        <TablePagination
          component="div"
          count={products.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))}
        />
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingProduct ? "Edit Product" : "Add Product"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="SKU"
              value={formData.sku}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, sku: e.target.value }))
              }
              error={!!errors.sku}
              helperText={errors.sku}
              fullWidth
            />

            <TextField
              label="Product Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
            />

            <FormControl error={!!errors.category} required fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                label="Category"
                value={formData.category || ""}
                onChange={(e: SelectChangeEvent) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.category}</FormHelperText>
            </FormControl>

            <TextField
              label="Unit Cost"
              type="number"
              value={formData.unitCost}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, unitCost: e.target.value }))
              }
              error={!!errors.unitCost}
              helperText={errors.unitCost}
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField
              label="Reorder Point"
              type="number"
              value={formData.reorderPoint}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  reorderPoint: e.target.value,
                }))
              }
              error={!!errors.reorderPoint}
              helperText={errors.reorderPoint}
              fullWidth
              inputProps={{ min: 0 }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={Object.values(errors).some(Boolean)}
          >
            {editingProduct ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteDialog.open}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteDialog.product?.name}"? This action cannot be undone.`}
        onCancel={() => setDeleteDialog({ open: false, product: null })}
        onConfirm={handleDeleteConfirm}
      />

      <ToastNotification
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Container>
  );
}
