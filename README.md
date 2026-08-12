# BiteSpeed - Order Management Food Delivery Application

A TypeScript monorepo-based Order Management application built to implement a functional food delivery flow.

## 🚀 Project Overview

The goal of this application is to create a simple, functional order management system allowing users to browse a food menu, manage cart selections, checkout with delivery details, and track live order progress in real-time.

---

## 🛠️ Feature Coverage & Implementation

### 1. Menu Display
- **Backend API**: Serves products categorized under distinct menu types (Pizza, Burgers, Sides, Beverages, Desserts) via `GET /products` and `GET /categories` with support for search and category filtering.
- **Frontend UI**: Renders a visually refined, high-contrast responsive grid of available dishes with image assets, prices, and descriptions.

### 2. Order Placement
- **Cart Management**: Real-time cart state allows users to add items, modify quantities, and remove selections in a slide-out cart drawer.
- **Checkout Details**: Users proceed to confirm checkout by selecting saved addresses or entering new delivery details (name, phone number, address).
- **Backend API**: Processes orders, stores items, and calculates total payment amounts via `POST /orders`.

### 3. Order Status & Real-Time Tracking
- **Order Tracker Page**: Renders a dynamic timeline showing the stage of the food preparation (`Order Received` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered`).
- **Simulated Back-End Updates**: System Administrators can use the built-in **Admin Control Center** dropdown options to change any order status, which updates the tracker view immediately.

### 4. Technical Architecture
- [apps/web](file:///c:/work/project/apps/web) - Next.js frontend styled with Tailwind CSS (running on port `3000`).
- [apps/api](file:///c:/work/project/apps/api) - Bun + Hono REST API backend (running on port `4000`).
- [packages/db](file:///c:/work/project/packages/db) - PostgreSQL schema definitions, migration scripts, and Drizzle ORM client.
- [packages/shared](file:///c:/work/project/packages/shared) - Shared Typescript interfaces and validation schemas.

---

## 🏃 Quick Start Guide

### 1. Setup Environment
Copy the template variables and install the monorepo dependencies:
```bash
copy .env.example .env
bun install
```

### 2. Run Database Services
Boot up the local PostgreSQL container using Docker Compose:
```bash
docker compose up -d
```

### 3. Migrate and Seed Database
Generate Drizzle schemas, execute migrations, and seed sample food data:
```bash
# Generate schemas
bun run db:generate

# Run migrations
bun run db:migrate

# Seed sample foods
bun run db:seed
```

### 4. Run Development Servers
Start the frontend and backend servers in separate terminals or processes:
```bash
# Start frontend application
bun run dev:web

# Start backend server
bun run dev:api
```
- **Web App URL**: `http://localhost:3000`
- **Backend API URL**: `http://localhost:4000`

---

## 🧪 Test-Driven Development (TDD)

API endpoints are covered by automated tests using `bun:test` to validate CRUD operations for orders, inputs validation, and status updates.

To execute the test suite:
```bash
bun test
```
*(Ensure your database is running and migrated before launching tests. If you are pointing to a remote server that requires SSL/TLS, make sure your connection parameters are configured with `?sslmode=require`).*
