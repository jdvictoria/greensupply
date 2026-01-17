"use client"

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from "@mui/material"

interface ViewDialogProps {
  open: boolean
  title: string
  fields: Array<{ label: string; value: string | number }>
  onClose: () => void
}

export function ViewDialog({ open, title, fields, onClose }: ViewDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {fields.map((field, index) => (
            <Box key={index}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                {field.label}
              </Typography>
              <Typography variant="body1">{field.value}</Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
