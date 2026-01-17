# GreenSupply - Inventory Management System

A modern, full-featured inventory management system built with Next.js, React, and Material-UI. GreenSupply helps businesses track products, manage warehouses, monitor stock levels, and handle inventory transfers across multiple locations.

## Features

### 📦 Product Management

- Create, read, update, and delete products
- Track SKU, name, category, unit cost, and reorder points
- Comprehensive product listing with pagination

### 🏢 Warehouse Management

- Manage multiple warehouse locations
- View detailed warehouse information
- Track inventory by warehouse
- Warehouse-specific stock levels and values

### 📊 Inventory Overview

- Real-time inventory dashboard
- Total products, warehouses, and inventory value
- Stock status indicators (In Stock, Low Stock, Out of Stock)
- Product-level inventory tracking

### 🔄 Stock Transfers

- Initiate transfers between warehouses
- Track transfer history
- Automatic stock level updates
- Transfer status management

### 🚨 Stock Alerts

- Automatic low stock detection
- Critical and low stock alerts
- Alert status management (pending, acknowledged, resolved, dismissed)
- Recommended order quantities
- Alert generation based on reorder points

### 💾 Data Persistence

- All data persisted to browser localStorage
- Automatic data initialization from JSON files
- Reset functionality to restore default data

## Tech Stack

- **Framework**: Next.js 16.1.3 (App Router)
- **UI Library**: Material-UI (MUI) v7.3.7
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4, Emotion
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Context API
- **Storage**: Browser localStorage

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd greensupply
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
greensupply/
├── app/
│   ├── actions/          # Server actions for CRUD operations
│   │   ├── products.ts
│   │   ├── warehouses.ts
│   │   ├── transfers.ts
│   │   ├── alerts.ts
│   │   ├── stock.ts
│   │   └── reset.ts
│   ├── dashboard/        # Dashboard pages
│   │   ├── page.tsx      # Overview dashboard
│   │   ├── products/
│   │   ├── warehouses/
│   │   ├── transfers/
│   │   └── alerts/
│   └── layout.tsx
├── components/           # Reusable UI components
├── context/             # React context providers
├── data/                # Default JSON data files
├── lib/                 # Utility functions and types
└── public/              # Static assets
```

## Usage

### Dashboard Overview

The main dashboard provides an at-a-glance view of your inventory:

- Total products count
- Total warehouses
- Total inventory value
- Pending alerts count
- Detailed inventory table with unit costs and total values

### Managing Products

1. Navigate to **Products** from the sidebar
2. Click **Add Product** to create a new product
3. Use the edit/delete icons to modify existing products
4. All changes are automatically saved to localStorage

### Managing Warehouses

1. Navigate to **Warehouses** from the sidebar
2. Click **Add Warehouse** to create a new location
3. Click on a warehouse row to view detailed information
4. Edit or delete warehouses as needed

### Stock Transfers

1. Navigate to **Transfers** from the sidebar
2. Fill out the transfer form:
   - Select product
   - Choose source and destination warehouses
   - Enter quantity
   - Add notes (optional)
3. View transfer history in the table below

### Stock Alerts

1. Navigate to **Alerts** from the sidebar
2. View all stock alerts with their status
3. Click **Take Action** on pending alerts to update status
4. Use **Refresh Alerts** to regenerate alerts based on current stock levels

### Resetting Data

- Click the **Reset Data** button on the main dashboard
- Confirm to restore all data to default values
- Page will reload automatically

## Development

### Code Quality

- ESLint for linting
- Prettier for code formatting
- TypeScript for type safety

Run linting:

```bash
npm run lint
```

## Implementation Summary

**Developer**: Joshua Victoria  
**Completion Time**: 5:30 PM PH Time

### Features Completed

✅ **Full CRUD Operations**

- Products: Create, Read, Update, Delete
- Warehouses: Create, Read, Update, Delete
- Transfers: Create, Read
- Alerts: Read, Update status, Generate alerts
- Stock: Read operations

✅ **Data Persistence**

- All CRUD operations persist to browser localStorage
- Automatic initialization from JSON data files
- Data reset functionality to restore defaults

✅ **Dashboard Features**

- Overview dashboard with key metrics
- Inventory overview table with unit costs and total values
- Real-time stock status indicators
- Reset data button with confirmation

✅ **User Interface**

- Responsive design with Material-UI v7
- Modern, clean interface
- Toast notifications for user feedback
- Confirmation dialogs for destructive actions
- Pagination for large datasets

✅ **Alert System**

- Automatic alert generation based on reorder points
- Alert status management (pending, acknowledged, resolved, dismissed)
- Duplicate prevention logic
- Recommended order quantities

✅ **Stock Management**

- Real-time stock level tracking
- Stock transfers with automatic updates
- Warehouse-specific stock views
- Stock value calculations

### Key Technical Decisions

1. **Next.js Server Actions Pattern**: Implemented CRUD operations using Next.js server actions pattern (with "use client" for localStorage access), providing a clean separation of concerns and type-safe operations.

2. **localStorage for Persistence**: Chose localStorage over a database for simplicity and to meet requirements. All data is automatically initialized from JSON files on first load.

3. **React Context API**: Used Context API for global state management, providing a centralized inventory context that all components can access.

4. **Material-UI v7 Grid System**: Migrated from legacy Grid API to the new `size` prop-based Grid2 API for better type safety and modern patterns.

5. **TypeScript Throughout**: Full TypeScript implementation with proper type definitions for all data models and function signatures.

6. **Duplicate Alert Prevention**: Implemented sophisticated logic to prevent duplicate alerts when status is updated, checking stock levels and alert history.

7. **Client-Side Actions**: Server actions are marked as "use client" to access localStorage, maintaining the server actions pattern while working with browser APIs.

### Known Limitations

1. **Browser Storage Only**: Data is stored in localStorage, which means:
   - Data is browser-specific (not shared across devices)
   - Limited storage capacity (~5-10MB)
   - Data can be cleared by user or browser settings

2. **No Backend**: All operations are client-side only. No server-side validation, authentication, or data backup.

3. **No Real-time Sync**: Changes are not synchronized across multiple browser tabs or devices.

4. **No Data Export/Import**: No functionality to export or import data in bulk.

5. **Alert Generation**: Alerts are generated on-demand and may not reflect real-time stock changes until manually refreshed.

6. **No Audit Trail**: Transfer and alert history don't include detailed audit logs of who made changes and when.

7. **Limited Validation**: Form validation is basic; no advanced business rule validation.

### Testing Instructions

1. **Initial Setup**:

   ```bash
   npm install
   npm run dev
   ```

2. **Test Product CRUD**:
   - Navigate to Products page
   - Add a new product with valid data
   - Edit the product and verify changes persist
   - Delete the product and verify removal
   - Refresh page to confirm localStorage persistence

3. **Test Warehouse CRUD**:
   - Navigate to Warehouses page
   - Add a new warehouse
   - Click on warehouse to view details
   - Edit warehouse information
   - Delete warehouse and verify related stock is removed

4. **Test Stock Transfers**:
   - Navigate to Transfers page
   - Create a transfer between warehouses
   - Verify stock levels update automatically
   - Check transfer appears in history
   - Verify source warehouse stock decreases
   - Verify destination warehouse stock increases

5. **Test Alerts**:
   - Navigate to Alerts page
   - Click "Refresh Alerts" to generate alerts
   - Take action on a pending alert
   - Verify status updates correctly
   - Verify no duplicate alerts are created
   - Refresh alerts again to test duplicate prevention

6. **Test Data Reset**:
   - Make some changes (add products, warehouses, etc.)
   - Navigate to Dashboard
   - Click "Reset Data" button
   - Confirm reset
   - Verify all data returns to default values

7. **Test Data Persistence**:
   - Make changes to any data
   - Close browser tab
   - Reopen application
   - Verify all changes are still present

8. **Test Responsive Design**:
   - Resize browser window
   - Test on mobile viewport
   - Verify all pages are responsive

### Video Walkthrough

[Video walkthrough link - to be added]

### New Dependencies Added

The following dependencies were added during implementation:

- **prettier** (^3.8.0) - Code formatting tool
  - Added to devDependencies for consistent code style

All other dependencies were part of the initial project setup:

- @mui/material (^7.3.7) - UI component library
- next (16.1.3) - React framework
- react (19.2.3) - UI library
- react-dom (19.2.3) - React DOM renderer
- typescript (^5) - Type safety
- lucide-react (^0.562.0) - Icon library
- recharts (^3.6.0) - Chart library (if used in stock page)

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.
