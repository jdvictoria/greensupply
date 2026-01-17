"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Badge,
} from "@mui/material"
import { Leaf, MenuIcon } from "lucide-react"

import { useInventory } from "@/context/inventory-context"

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Products", href: "/dashboard/products" },
  { label: "Warehouses", href: "/dashboard/warehouses" },
  { label: "Stock Levels", href: "/dashboard/stock-levels" },
  { label: "Transfers", href: "/dashboard/transfers" },
  { label: "Alerts", href: "/dashboard/alerts", showBadge: true },
]

export function Navbar() {
  const pathname = usePathname()
  const { alerts } = useInventory()

  const [mobileOpen, setMobileOpen] = useState(false)

  const pendingAlertsCount = alerts.filter((a) => a.status === "pending").length

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ gap: 2 }}>
            <Leaf className="text-primary" size={32} />
            <Typography
              variant="h6"
              component={Link}
              href="/dashboard"
              sx={{
                mr: "auto",
                fontWeight: 700,
                color: "text.primary",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              GreenSupply Co
            </Typography>

            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  sx={{
                    color: pathname === item.href ? "primary.main" : "text.secondary",
                    fontWeight: pathname === item.href ? 600 : 400,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  {item.showBadge && pendingAlertsCount > 0 ? (
                    <Badge badgeContent={pendingAlertsCount} color="error">
                      {item.label}
                    </Badge>
                  ) : (
                    item.label
                  )}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
              <IconButton color="inherit" aria-label="open drawer" edge="end" onClick={handleDrawerToggle}>
                <MenuIcon size={24} />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Navigation
          </Typography>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.href} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  selected={pathname === item.href}
                  onClick={handleDrawerToggle}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    "&.Mui-selected": {
                      bgcolor: "primary.light",
                      color: "primary.main",
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: "primary.light",
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      item.showBadge && pendingAlertsCount > 0 ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {item.label}
                          <Badge badgeContent={pendingAlertsCount} color="error" />
                        </Box>
                      ) : (
                        item.label
                      )
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  )
}
