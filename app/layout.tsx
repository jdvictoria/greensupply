import type React from "react";
import type { Metadata } from "next";

import { InventoryProvider } from "@/context/inventory-context";

import "./globals.css";

export const metadata: Metadata = {
  title: "GreenSupply Co - Inventory Management",
  description:
    "Multi-Warehouse Inventory Management System for eco-friendly products",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <InventoryProvider>{children}</InventoryProvider>
      </body>
    </html>
  );
}
