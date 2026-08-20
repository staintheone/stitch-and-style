# Stitch & Style - Full Stack E-Commerce

Stitch & Style is a full-stack, decoupled e-commerce web application. It features a modern, responsive storefront for customers to browse products, filter by attributes, and manage a shopping cart, alongside a secure administrative dashboard for store owners.

## 🏗️ Architecture

The project is structured as a mono-repo divided into two separate applications: a Frontend UI (`client`) and a Backend API (`server`). They run independently and communicate via HTTP REST endpoints.

### 1. Frontend (The `client` folder)
The frontend is a Single Page Application (SPA) responsible for all visual rendering, user interactions, and client-side routing. It runs on **Port 3000**.

**Tech Stack:**
* **React 18**: Core UI library.
* **TypeScript**: For static type checking and reliable code.
* **Vite**: Ultra-fast build tool and local development server.
* **Tailwind CSS**: Utility-first CSS framework for rapid UI styling without custom CSS files.
* **React Router v6**: Manages navigation between pages (Catalog, Cart, Login, Admin).

### 2. Backend (The `server` folder)
The backend is a RESTful API responsible for data persistence, business logic, and security/authentication. It runs on **Port 4000**.

**Tech Stack:**
* **Node.js & Express**: The core server framework.
* **TypeScript**: Type safety across the API logic.
* **Prisma ORM**: Modern database toolkit used to define the schema and query the database securely.
* **SQLite**: The local database engine (stored in `dev.db`). It requires no extra installation.
* **JSON Web Tokens (JWT)**: Used for secure, stateless user authentication.
* **Bcrypt.js**: Used to securely hash and salt user passwords in the database.

---

## 🚀 Key Features

* **Live Product Catalog**: Fetches real-time product data from the backend.
* **Advanced Filtering**: Client-side filtering by Size, Color, and Stock availability.
* **Authentication System**: Secure login system. Unauthenticated users cannot access the admin panel or backend admin routes.
* **Admin Dashboard**: A secure portal for store owners to view live stats (Total Products, Stock Levels) and manage inventory (e.g., delete products).
* **Shopping Cart**: Context-based cart state management allowing quantity adjustments and total calculation.

---

## 📂 Directory Structure

```text
stitch_and_style/
│
├── client/                     # FRONTEND
│   ├── src/
│   │   ├── admin/              # Admin dashboard components
│   │   ├── components/         # Reusable UI (Navbar, Cards, Sidebar)
│   │   ├── context/            # Global state (AuthContext, CartContext)
│   │   ├── pages/              # Main route views (Catalog, Login, etc.)
│   │   └── utils/api.ts        # Helper to fetch data and attach JWT tokens
│   ├── tailwind.config.ts      # Tailwind styling rules
│   └── vercel.json             # Deployment routing configuration
│
└── server/                     # BACKEND
    ├── prisma/
    │   └── schema.prisma       # Database schema (Models: User, Product, Order)
    ├── src/
    │   ├── middleware/         # Security (Require JWT, Require Admin)
    │   ├── routes/             # API Endpoints (Auth, Products, Orders, Admin)
    │   ├── server.ts           # Main Express application entry point
    │   └── seed.ts             # Script to populate initial products and admin user
    ├── dev.db                  # Live local SQLite database
    └── render.yaml             # Blueprint for cloud backend deployment
```

---

## 💻 How to Run Locally

Because this is a decoupled app, you must run **two separate terminal windows**.

### Step 1: Start the Backend Database & API
Open a terminal and navigate to the `server` folder:
```bash
cd server
npm install
npm run dev
```
*(The API will now be running on `http://localhost:4000`)*

### Step 2: Start the Frontend UI
Open a **second** terminal and navigate to the `client` folder:
```bash
cd client
npm install
npm run dev
```
*(The Website will now be running on `http://localhost:3000`)*

### Test Credentials
To access the Admin Dashboard at `http://localhost:3000/login`, use:
* **Email:** admin@stitchandstyle.com
* **Password:** admin123

---

## 🌍 Deployment Readiness
The architecture is pre-configured for modern cloud deployment:
1. **Frontend**: Ready to be dragged-and-dropped into **Vercel** (uses `.env.production` and `vercel.json`).
2. **Backend**: Ready to be deployed to **Render.com** (uses `render.yaml`). *Note: Prior to deploying, the Prisma schema provider must be switched from `sqlite` to `postgresql`.*
