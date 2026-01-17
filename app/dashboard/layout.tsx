"use client";

import type React from "react";

import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "hsl(155, 52%, 42%)",
      light: "hsl(145, 88%, 75%)",
      dark: "hsl(145, 45%, 35%)",
      contrastText: "hsl(140, 99%, 98%)",
    },
    secondary: {
      main: "hsl(145, 88%, 75%)",
      light: "hsl(140, 94%, 88%)",
      dark: "hsl(150, 52%, 60%)",
      contrastText: "hsl(150, 20%, 20%)",
    },
    background: {
      default: "hsl(140, 98%, 98%)",
      paper: "hsl(0, 0%, 100%)",
    },
    text: {
      primary: "hsl(150, 20%, 20%)",
      secondary: "hsl(150, 52%, 45%)",
    },
    success: {
      main: "#4caf50",
      light: "#e8f5e9",
      dark: "#2e7d32",
    },
    warning: {
      main: "#ff9800",
      light: "#fff3e0",
      dark: "#e65100",
    },
    error: {
      main: "#f44336",
      light: "#ffebee",
      dark: "#c62828",
    },
  },
  typography: {
    fontFamily:
      '"Geist", "Geist Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Navbar />
        <main>{children}</main>
      </div>
    </ThemeProvider>
  );
}
