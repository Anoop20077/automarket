# 🚗 AutoMarket — Full-Stack Car & Bike Marketplace

AutoMarket is a full-stack, responsive web application for buying and selling certified pre-owned cars and bikes across India.

---

## ⚡ Quick Start

### 1. Automated Setup
Install all dependencies for root, server, and client, push the Prisma schema, and seed the database:

```bash
npm run setup
```

### 2. Start Development Servers
Start both the Next.js frontend (port 3000) and the Express backend (port 4000) concurrently:

```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)

---

## 👥 Demo Accounts

The database comes pre-seeded with 1 administrator and 3 registered users, alongside 24 verified vehicle listings (12 cars and 12 bikes):

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@automarket.com` | `Admin@123` |
| **User (Seller 1)** | `rahul@automarket.com` | `User@123` |
| **User (Seller 2)** | `priya@automarket.com` | `User@123` |
| **User (Seller 3)** | `amit@automarket.com` | `User@123` |

---

## 🛠️ Architecture & Tech Stack

- **Frontend (`client/`)**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
  - Centralized Axios client with request/response interceptors & auto token refreshing
  - Dark/Light mode theme provider
  - Toast notification system
  - Vehicle comparison context (up to 3 vehicles)
  - 5-second polling real-time chat
  - Skeleton loaders & responsive mobile-first UI
- **Backend (`server/`)**: Node.js + Express + TypeScript
  - Clean layered architecture: Routes → Controllers → Services → Prisma ORM
  - Zod request validation, Centralized Error Handling
  - Security: Helmet, CORS, Rate limiting
  - Authentication: JWT access & refresh tokens with bcryptjs password hashing
  - Local multi-image uploads via Multer to `server/uploads`
- **Database (`server/prisma/`)**:
  - SQLite for zero-setup local development (`dev.db`)
  - Schema is 100% compatible with PostgreSQL (simply update `provider = "postgresql"` in [schema.prisma](file:///c:/Users/anoop/Downloads/auto%20market/server/prisma/schema.prisma))

---

## 📡 REST API Reference (`/api/v1`)

### Authentication
- `POST /auth/register` — Register a new account (`email`, `name`, `password`, `phone?`)
- `POST /auth/login` — Sign in (`email`, `password`)
- `POST /auth/refresh` — Refresh access token using `refreshToken`
- `POST /auth/logout` — Invalidate current session

### Users
- `GET /users/me` — Get current authenticated user profile
- `PUT /users/me` — Update user profile details (`name`, `phone`)

### Vehicle Listings
- `GET /listings` — Search & filter listings (`search`, `type`, `brand`, `minPrice`, `maxPrice`, `minYear`, `maxYear`, `fuelType`, `transmission`, `condition`, `location`, `sort`, `page`, `limit`)
- `GET /listings/:id` — Get listing details (increments view count)
- `GET /listings/mine` — Get current seller's listings
- `POST /listings` — Create a new listing (status set to `PENDING`)
- `PUT /listings/:id` — Update listing details
- `DELETE /listings/:id` — Delete a listing
- `PATCH /listings/:id/sold` — Mark listing as `SOLD`
- `POST /listings/:id/images` — Upload vehicle images (multipart form-data)

### Favorites
- `GET /favorites` — Get saved listings for the current user
- `POST /favorites/:listingId` — Save vehicle to favorites
- `DELETE /favorites/:listingId` — Remove vehicle from favorites

### Real-Time Chat (5s Polling)
- `GET /conversations` — Get active conversations with latest messages
- `POST /conversations` — Start a conversation for a listing
- `GET /conversations/:id/messages` — Get message thread
- `POST /messages` — Send a message in a conversation

### Reports
- `POST /listings/:id/report` — Submit a listing report with reason & description

### Admin (`Role: ADMIN`)
- `GET /admin/stats` — Platform metrics (users, listings by status, reports)
- `GET /admin/listings/pending` — View listings waiting for approval
- `PATCH /admin/listings/:id/approve` — Approve pending listing
- `PATCH /admin/listings/:id/reject` — Reject pending listing
- `GET /admin/users` — View all registered users
- `PATCH /admin/users/:id/ban` — Toggle user ban status
- `GET /admin/reports` — Review user submitted reports

---

## 🖥️ Frontend Pages Overview

1. **Home (`/`)**: Hero banner, search bar, Cars & Bikes category cards, featured listings, and trust metrics.
2. **Browse Listings (`/listings`)**: Filter sidebar (Type, Price, Year, Fuel, Transmission, Condition, Location), sorting dropdown, pagination, and vehicle cards.
3. **Vehicle Detail (`/listings/[id]`)**: Full image gallery, specs table, EMI loan calculator, seller details, contact seller, favorite toggle, compare button, and report modal.
4. **Sell Vehicle (`/sell`)**: Multi-step post ad form with live image previews and specifications selector.
5. **My Listings (`/my-listings`)**: Status badges (`PENDING`, `APPROVED`, `REJECTED`, `SOLD`), view counts, edit ad link, mark sold, and delete options.
6. **Favorites (`/favorites`)**: Saved vehicle cards with one-click removal.
7. **Vehicle Comparison (`/compare`)**: Side-by-side spec comparison table for up to 3 selected vehicles.
8. **Inbox & Chat (`/chat`)**: Two-pane inbox and conversation view with 5-second polling updates.
9. **User Profile (`/profile`)**: View account details and update contact phone and name.
10. **Admin Portal (`/admin`)**: Metric cards, listing moderation queue, user ban management, and report reviewer.
11. **Authentication (`/login`, `/register`)**: Form validation, error feedback, and demo credential reminders.
