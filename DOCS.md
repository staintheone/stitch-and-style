# Stitch & Style — Complete Technical Documentation

A full-stack e-commerce clothing store with a React frontend, Express backend, Prisma ORM, and support for both local (SQLite) and cloud (PostgreSQL) databases.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Folder Structure](#2-folder-structure)
3. [Frontend — The `client` Folder](#3-frontend--the-client-folder)
4. [Backend — The `server` Folder](#4-backend--the-server-folder)
5. [Database & Prisma](#5-database--prisma)
6. [Authentication System](#6-authentication-system)
7. [API Reference](#7-api-reference)
8. [Local vs Cloud Database Switching](#8-local-vs-cloud-database-switching)
9. [Running Locally](#9-running-locally)
10. [Deploying to Production](#10-deploying-to-production)
11. [Environment Variables](#11-environment-variables)
12. [Test Credentials](#12-test-credentials)

---

## 1. Project Overview

Stitch & Style is a **decoupled, monorepo** application. "Decoupled" means the frontend and backend are completely separate codebases that communicate with each other over HTTP (like two different apps that speak the same language). "Monorepo" means both live in the same GitHub repository, in separate folders.

```
stitch_and_style/
├── client/   ← The React website (what users see)
└── server/   ← The Express API (data, auth, business logic)
```

The website and the API run on **different ports** and are deployed to **different cloud services**:

| Part | Technology | Local Port | Cloud Host |
|------|-----------|-----------|-----------|
| Frontend | React + Vite | 3000 | Vercel |
| Backend API | Node.js + Express | 4000 | Render |
| Database (local) | SQLite (`dev.db`) | — | — |
| Database (cloud) | PostgreSQL | — | Render |

---

## 2. Folder Structure

```
stitch_and_style/
│
├── client/                           # FRONTEND
│   ├── public/                       # Static assets (favicon, etc.)
│   ├── src/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx    # Admin panel — stats + product table
│   │   │   └── AddProductPage.tsx    # Form to create a new product
│   │   ├── components/
│   │   │   ├── Navbar.tsx            # Top nav (shows Login/Logout, Admin link)
│   │   │   ├── Footer.tsx            # Bottom footer
│   │   │   └── ProtectedRoute.tsx    # Blocks non-admins from /admin routes
│   │   ├── context/
│   │   │   ├── AuthContext.tsx       # Global login state (user + JWT token)
│   │   │   └── CartContext.tsx       # Global shopping cart state
│   │   ├── pages/
│   │   │   ├── HomePage.tsx          # Landing / hero page
│   │   │   ├── CatalogPage.tsx       # Product grid with filters
│   │   │   ├── ProductDetailPage.tsx # Single product view + Add to Cart
│   │   │   ├── CartPage.tsx          # Cart summary + quantity controls
│   │   │   ├── CheckoutPage.tsx      # Checkout form
│   │   │   └── LoginPage.tsx         # Admin login form
│   │   ├── utils/
│   │   │   └── api.ts                # fetch() wrapper — attaches JWT token
│   │   ├── App.tsx                   # All routes defined here
│   │   └── main.tsx                  # App entry point (mounts to #root)
│   ├── .env                          # Local API URL (VITE_API_URL=http://localhost:4000/api)
│   ├── .env.production               # Live API URL (VITE_API_URL=https://...onrender.com/api)
│   ├── vercel.json                   # Tells Vercel how to handle SPA routing
│   ├── tailwind.config.ts            # Tailwind CSS configuration
│   └── vite.config.ts                # Vite build configuration
│
└── server/                           # BACKEND
    ├── prisma/
    │   ├── schema.prisma             # Database models (User, Product, Order, OrderItem)
    │   └── dev.db                    # Local SQLite database file (auto-created)
    ├── src/
    │   ├── middleware/
    │   │   └── auth.ts               # JWT verification + role checks
    │   ├── routes/
    │   │   ├── auth.ts               # POST /api/auth/login + /register
    │   │   ├── products.ts           # CRUD for products
    │   │   ├── orders.ts             # POST /api/orders (place an order)
    │   │   └── admin.ts              # GET /api/admin/stats (admin-only)
    │   ├── server.ts                 # Express app entry point
    │   └── seed.ts                   # Populates DB with 12 products + admin user
    ├── switch-db.js                  # Toggles Prisma between sqlite ↔ postgresql
    ├── render.yaml                   # Render.com deployment blueprint
    ├── .env                          # Local env vars (DATABASE_URL, JWT_SECRET, PORT)
    └── package.json                  # npm scripts
```

---

## 3. Frontend — The `client` Folder

### Tech Stack
- **React 18** — UI library
- **TypeScript** — type safety
- **Vite** — build tool and local dev server (fast hot reload)
- **Tailwind CSS** — utility-first styling (no custom CSS files needed)
- **React Router v6** — client-side routing between pages

### How Pages Connect

```
/                  → HomePage.tsx
/catalog           → CatalogPage.tsx      (fetches products from API)
/product/:id       → ProductDetailPage.tsx (fetches single product from API)
/cart              → CartPage.tsx         (reads from CartContext)
/checkout          → CheckoutPage.tsx     (submits order to API)
/login             → LoginPage.tsx        (authenticates via API)
/admin             → AdminDashboard.tsx   (PROTECTED — admin only)
/admin/add-product → AddProductPage.tsx   (PROTECTED — admin only)
```

### Global State (Context)

**`AuthContext.tsx`** — Manages who is logged in.
- Stores `user` (id, email, name, role) and `token` (JWT string) in `localStorage` so you stay logged in after a browser refresh.
- Provides `login(token, user)` and `logout()` functions.
- The `Navbar` reads from this to decide whether to show "Login" or "Logout (Admin)".

**`CartContext.tsx`** — Manages the shopping cart.
- Stores an array of cart items in memory (cleared on page refresh).
- Provides `addToCart`, `removeFromCart`, `updateQuantity`, and `clearCart` functions.
- The cart icon in the Navbar shows the live item count from this context.

### The `api.ts` Utility

All API calls go through `src/utils/api.ts` instead of calling `fetch()` directly. This utility does two things automatically:

1. **Prepends the base URL** — reads `VITE_API_URL` from the environment file so you don't hardcode `http://localhost:4000/api` everywhere.
2. **Attaches the JWT token** — reads the token from `localStorage` and adds it as an `Authorization: Bearer <token>` header. Without this header, protected routes return a `401 Unauthorized` error.

```typescript
// Example usage anywhere in the app:
const products = await apiFetch('/products');                    // GET
const product  = await apiFetch('/products/3');                  // GET single
await apiFetch('/products', { method: 'POST', body: JSON.stringify(data) }); // POST
await apiFetch('/products/3', { method: 'DELETE' });             // DELETE
```

### Protected Routes

`ProtectedRoute.tsx` wraps any route that requires authentication. It checks `AuthContext`:
- If the user is **not logged in** → redirects to `/login`.
- If the route requires **admin** and the user is not an admin → redirects to `/`.
- If the user **is** an admin → renders the children (the actual page).

---

## 4. Backend — The `server` Folder

### Tech Stack
- **Node.js + Express** — HTTP server and routing
- **TypeScript** — compiled to JavaScript before running
- **Prisma ORM** — database toolkit (defines schema, generates a type-safe client)
- **SQLite** (local) / **PostgreSQL** (cloud) — database engine
- **JWT (jsonwebtoken)** — stateless authentication tokens
- **Bcrypt.js** — password hashing

### How a Request Flows

```
Browser/Client
     │  POST https://api.example.com/api/auth/login
     ▼
Express server (server.ts)
     │  matches /api/auth → authRoutes
     ▼
Route handler (auth.ts)
     │  validates input → queries DB via Prisma → compares password
     ▼
Prisma Client
     │  executes SQL against SQLite/PostgreSQL
     ▼
Response  { token: "...", user: { ... } }  back to browser
```

### Middleware (`src/middleware/auth.ts`)

Two middleware functions protect sensitive routes:

- **`requireAuth`** — checks that a valid JWT `Bearer` token exists in the `Authorization` header. Attaches the decoded user to `req.user`. Returns `401` if missing or expired.
- **`requireAdmin`** — runs after `requireAuth`. Checks that `req.user.role === 'admin'`. Returns `403` if the user is a regular customer.

---

## 5. Database & Prisma

### Models (`prisma/schema.prisma`)

**`User`**
| Field | Type | Description |
|-------|------|-------------|
| id | Int (PK) | Auto-increment |
| email | String (unique) | Login email |
| password | String | Bcrypt hashed |
| name | String | Display name |
| role | String | `"customer"` or `"admin"` |
| createdAt | DateTime | Auto-set on create |
| orders | Order[] | Relation to orders |

**`Product`**
| Field | Type | Description |
|-------|------|-------------|
| id | Int (PK) | Auto-increment |
| name | String | e.g. "Denim Jacket" |
| price | Float | e.g. 79.99 |
| image | String | Unsplash URL |
| sizes | String | JSON string e.g. `'["S","M","L"]'` |
| colors | String | JSON string e.g. `'["Blue","Black"]'` |
| inStock | Boolean | Default `true` |
| createdAt / updatedAt | DateTime | Auto-managed |

> **Why store sizes/colors as a JSON string?** SQLite doesn't support array column types. We stringify the arrays before saving and parse them back to arrays when reading. PostgreSQL on Render works the same way for consistency.

**`Order`** — created when a user checks out.

**`OrderItem`** — each line item in an order (product, size, color, quantity, price).

### Prisma Commands Reference

```bash
npx prisma generate   # regenerate the TypeScript client after schema changes
npx prisma db push    # apply schema changes to the database (no migration files)
npx prisma studio     # open a visual browser GUI to inspect/edit data (premium on Render)
```

---

## 6. Authentication System

### Flow

```
1. User enters email + password on /login
2. POST /api/auth/login is sent to Express
3. Backend finds the user by email in the DB
4. bcrypt.compare() checks if the password matches the stored hash
5. If valid → generate a JWT token signed with JWT_SECRET
6. Token is returned to the frontend
7. Frontend stores token in localStorage via AuthContext
8. Every subsequent API call attaches the token in the Authorization header
9. Protected routes verify the token with requireAuth middleware
```

### JWT Token Structure

The token payload contains:
```json
{
  "userId": 1,
  "email": "admin@stitchandstyle.com",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

Tokens expire in **7 days**. After expiry, the user is automatically logged out on their next API call.

---

## 7. API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | None | Create a new customer account |
| POST | `/api/auth/login` | None | Login, returns JWT token |

**Login request body:**
```json
{ "email": "admin@stitchandstyle.com", "password": "admin123" }
```
**Login response:**
```json
{ "token": "eyJ...", "user": { "id": 1, "email": "...", "name": "Admin", "role": "admin" } }
```

---

### Products — `/api/products`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | None | Get all products (supports `?size=M&color=Blue&stock=inStock`) |
| GET | `/api/products/:id` | None | Get a single product by ID |
| POST | `/api/products` | Admin JWT | Create a new product |
| PUT | `/api/products/:id` | Admin JWT | Update a product |
| DELETE | `/api/products/:id` | Admin JWT | Delete a product |

**POST/PUT body:**
```json
{
  "name": "Silk Scarf",
  "price": 24.99,
  "image": "https://images.unsplash.com/...",
  "sizes": ["One Size"],
  "colors": ["Red", "Blue", "Gold"],
  "inStock": true
}
```

---

### Orders — `/api/orders`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | Customer/Admin JWT | Place a new order |

**POST body:**
```json
{
  "firstName": "Riya",
  "lastName": "Sharma",
  "email": "riya@example.com",
  "address": "123 Main St",
  "city": "Mumbai",
  "zip": "400001",
  "items": [
    { "productId": 2, "size": "M", "color": "Blue", "quantity": 1, "price": 79.99 }
  ]
}
```

---

### Admin — `/api/admin`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/stats` | Admin JWT | Returns `{ totalProducts, inStock, outOfStock }` |

---

### Health Check

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | None | Returns `{ status: "ok", timestamp: "..." }` — use this to verify the server is alive |

---

## 8. Local vs Cloud Database Switching

Because SQLite is perfect for local development (zero setup, just a file) but cloud platforms like Render require PostgreSQL, we built an automatic switcher.

**`server/switch-db.js`** rewrites the `provider` line in `prisma/schema.prisma` before the server starts.

The npm scripts call it automatically:

```json
{
  "dev":   "node switch-db.js sqlite && npx prisma generate && ts-node-dev ...",
  "build": "node switch-db.js postgresql && tsc"
}
```

| Command | Environment | Database |
|---------|------------|----------|
| `npm run dev` | Local | SQLite (`dev.db` file) |
| `npm run build` (Render) | Cloud | PostgreSQL (via `DATABASE_URL`) |

You **never need to manually edit `schema.prisma`**.

---

## 9. Running Locally

### Requirements
- Node.js 18+
- npm

### Steps

**Terminal 1 — Backend API:**
```bash
cd server
npm install
npm run dev          # auto-switches to SQLite, starts on localhost:4000
npm run db:seed      # (first time only) seeds 12 products + admin user
```

**Terminal 2 — Frontend:**
```bash
cd client
npm install
npm run dev          # starts on localhost:3000
```

Open **http://localhost:3000** in your browser.

### Batch File (Windows shortcut)

Double-click `run-local.bat` in the project root to open both terminals at once:
```bat
start "" cmd /k "cd server && npm run dev"
start "" cmd /k "cd client && npm run dev"
```

---

## 10. Deploying to Production

### Step 1 — Push code to GitHub
```bash
git add .
git commit -m "your message"
git push
```

### Step 2 — Deploy backend on Render
1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repository
3. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npm run build && npm run db:generate`
   - **Start Command:** `npm run db:push && npm start`
4. Add **Environment Variables** in Render dashboard:
   - `DATABASE_URL` — from your Render PostgreSQL database's Internal URL
   - `JWT_SECRET` — any long random string
   - `FRONTEND_URL` — your Vercel URL (e.g. `https://your-app.vercel.app`)
5. Run the seed (first deploy only):
   - Temporarily change Start Command to: `npm run db:push && npm run db:seed && npm start`
   - After products appear on your live site, change it back.

### Step 3 — Deploy frontend on Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project** → Import GitHub repo
2. Set **Root Directory** to `client`
3. Add **Environment Variable:**
   - `VITE_API_URL` = `https://your-render-service.onrender.com/api`
4. Click **Deploy**

Every future `git push` will automatically trigger new deployments on both platforms.

---

## 11. Environment Variables

### `server/.env` (local)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=4000
```

### `server` Render Dashboard Variables (production)
```env
DATABASE_URL="postgresql://user:pass@host/db"  ← from Render PostgreSQL
JWT_SECRET="long-random-string"
FRONTEND_URL="https://your-app.vercel.app"
PORT=10000  ← Render sets this automatically
```

### `client/.env` (local)
```env
VITE_API_URL=http://localhost:4000/api
```

### `client/.env.production` (Vercel build)
```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

---

## 12. Test Credentials

### Admin Account
| Field | Value |
|-------|-------|
| Email | `admin@stitchandstyle.com` |
| Password | `admin123` |
| Role | `admin` |

The admin can:
- Access `/admin` dashboard
- View store statistics
- Add new products (`/admin/add-product`)
- Delete products

### Customer Account (seeded)
| Field | Value |
|-------|-------|
| Email | `customer@example.com` |
| Password | `customer123` |
| Role | `customer` |

The customer can:
- Browse the catalog
- Add items to cart
- Place orders
- Cannot access `/admin`

---

*Last updated: August 2026*
