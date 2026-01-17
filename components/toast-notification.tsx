"use client";

import { Snackbar, Alert, type AlertColor } from "@mui/material";

interface ToastNotificationProps {
  open: boolean;
  message: string;
  severity?: AlertColor;
  onClose: () => void;
}

export function ToastNotification({
  open,
  message,
  severity = "success",
  onClose,
}: ToastNotificationProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
