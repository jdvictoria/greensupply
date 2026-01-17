"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  TablePagination,
  CircularProgress,
  FormHelperText,
} from "@mui/material";

import { Edit, Trash2, Plus } from "lucide-react";

import type { Warehouse } from "@/lib/types";

import { useInventory } from "@/context/inventory-context";
import { ToastNotification } from "@/components/toast-notification";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";

export default function WarehousesPage() {
  const router = useRouter();
  const { warehouses, addWarehouse, updateWarehouse, deleteWarehouse } =
    useInventory();

  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    code: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    location: "",
    code: "",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState<number | null>(
    null,
  );

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
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

  const validateForm = () => {
    const newErrors = {
      name: "",
      location: "",
      code: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Warehouse name is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (!formData.code.trim()) {
      newErrors.code = "Warehouse code is required";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleAdd = () => {
    setEditingWarehouse(null);
    setFormData({ name: "", location: "", code: "" });
    setErrors({ name: "", location: "", code: "" });
    setOpenDialog(true);
  };

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      location: warehouse.location,
      code: warehouse.code,
    });
    setErrors({ name: "", location: "", code: "" });
    setOpenDialog(true);
  };

  const handleRowClick = (warehouse: Warehouse) => {
    router.push(`/dashboard/warehouses/${warehouse.id}`);
  };

  const handleDeleteClick = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setWarehouseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (warehouseToDelete !== null) {
      try {
        await deleteWarehouse(warehouseToDelete);
        setDeleteDialogOpen(false);
        setWarehouseToDelete(null);
        setToastMessage("Warehouse deleted successfully");
        setToastOpen(true);
      } catch (error) {
        setToastMessage("Failed to delete warehouse");
        setToastOpen(true);
      }
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (editingWarehouse) {
        await updateWarehouse(editingWarehouse.id, formData);
        setToastMessage("Warehouse updated successfully");
      } else {
        await addWarehouse(formData);
        setToastMessage("Warehouse added successfully");
      }
      setOpenDialog(false);
      setToastOpen(true);
    } catch (error) {
      setToastMessage("Failed to save warehouse");
      setToastOpen(true);
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.location.trim() !== "" &&
      formData.code.trim() !== ""
    );
  };

  const paginatedWarehouses = warehouses.slice(
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Warehouses
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your warehouse locations
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={handleAdd}
          sx={{
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          Add Warehouse
        </Button>
      </Box>

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
                  Code
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
                  Warehouse Name
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
                  Location
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
              {paginatedWarehouses.map((warehouse) => (
                <Box
                  component="tr"
                  key={warehouse.id}
                  onClick={() => handleRowClick(warehouse)}
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
                      fontWeight: 600,
                    }}
                  >
                    {warehouse.code}
                  </Box>
                  <Box
                    component="td"
                    sx={{ p: 2, fontSize: "0.875rem", fontWeight: 500 }}
                  >
                    {warehouse.name}
                  </Box>
                  <Box
                    component="td"
                    sx={{ p: 2, fontSize: "0.875rem", color: "text.secondary" }}
                  >
                    {warehouse.location}
                  </Box>
                  <Box component="td" sx={{ p: 2 }}>
                    <Box
                      sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(warehouse);
                        }}
                        sx={{ color: "primary.main" }}
                      >
                        <Edit size={18} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => handleDeleteClick(warehouse.id, e)}
                        sx={{ color: "error.main" }}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <TablePagination
          component="div"
          count={warehouses.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingWarehouse ? "Edit Warehouse" : "Add Warehouse"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <Box>
              <TextField
                label="Warehouse Code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                fullWidth
                error={!!errors.code}
                required
              />
              {errors.code && (
                <FormHelperText error>{errors.code}</FormHelperText>
              )}
            </Box>
            <Box>
              <TextField
                label="Warehouse Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                fullWidth
                error={!!errors.name}
                required
              />
              {errors.name && (
                <FormHelperText error>{errors.name}</FormHelperText>
              )}
            </Box>
            <Box>
              <TextField
                label="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                fullWidth
                error={!!errors.location}
                required
              />
              {errors.location && (
                <FormHelperText error>{errors.location}</FormHelperText>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!isFormValid()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        title="Delete Warehouse"
        message="Are you sure you want to delete this warehouse? This action cannot be undone."
        onCancel={() => {
          setDeleteDialogOpen(false);
          setWarehouseToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />

      <ToastNotification
        open={toastOpen}
        message={toastMessage}
        severity="success"
        onClose={() => setToastOpen(false)}
      />
    </Container>
  );
}
