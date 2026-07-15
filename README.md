<div align="center">

# 🏡 NestFind — Server

### REST API powering the NestFind real estate platform

[![Live API](https://img.shields.io/badge/API-live-2563eb?style=for-the-badge)](https://nest-find-server.vercel.app)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Native%20Driver-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

[Live API](https://nest-find-server.vercel.app) · [Frontend Repo](https://github.com/u2404057-cuet/Nest-find) · [Report an Issue](https://github.com/u2404057-cuet/Nest-find-server/issues)

</div>

---

## 📖 Overview

This is the backend service for **NestFind**, a full-stack real estate listing platform. It's a RESTful API built with Express.js and TypeScript, backed by MongoDB, that handles property listings, agent/buyer accounts, inquiries, and dashboard analytics. It's consumed by the [NestFind frontend](https://github.com/u2404057-cuet/Nest-find).

## ✨ Features

- 🏠 **Property CRUD** — create, read, update, and delete property listings
- 🔎 **Search & Filtering** — query properties by type, listing type, price range, bedrooms, and location
- 👤 **Role-Based Accounts** — buyer, agent, and admin roles
- 💬 **Inquiries** — buyers submit inquiries on properties, agents manage inquiry status
- 📊 **Dashboard Stats** — aggregated data for views, inquiries, and listing status (feeds the frontend's Recharts dashboard)
- 🔒 **Secure by Default** — CORS configuration, environment-based secrets, and auth-protected routes for write operations
- ☁️ **Serverless-Ready** — deployed on Vercel

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Runtime | [Node.js](https://nodejs.org/) |
| Framework | [Express.js](https://expressjs.com/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Database | [MongoDB](https://www.mongodb.com/) (native driver) |
| Middleware | [cors](https://www.npmjs.com/package/cors), [dotenv](https://www.npmjs.com/package/dotenv) |
| Deployment | [Vercel](https://vercel.com/) |

## 🚀 Live Deployment

| Environment | URL |
|---|---|
| Backend API | [nest-find-server.vercel.app](https://nest-find-server.vercel.app) |
| Frontend | [nest-find-eta.vercel.app](https://nest-find-eta.vercel.app) |

## 🧑‍💻 Getting Started

### Prerequisites

- Node.js 18 or later
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/u2404057-cuet/Nest-find-server.git
cd Nest-find-server

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_better_auth_secret
```

> When deploying, set these as Environment Variables in your **Backend** Vercel project. Your **Frontend** Vercel project (`nest-find-eta.vercel.app`) needs its own variables — `NEXT_PUBLIC_API_URL` (this backend's URL) and `NEXT_PUBLIC_BETTER_AUTH_URL`.

### Run the Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:8000`.

### Build for Production

```bash
npm run build
npm run start
```

## 📡 API Reference

Base URL: `https://nest-find-server.vercel.app`

### Properties

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/properties` | List all properties (supports query filters) | Public |
| `GET` | `/api/properties/:id` | Get a single property by ID | Public |
| `GET` | `/api/properties/:id/related` | Get related properties | Public |
| `POST` | `/api/properties` | Create a new property listing | Agent |
| `PUT` | `/api/properties/:id` | Update a property listing | Agent (owner) |
| `DELETE` | `/api/properties/:id` | Delete a property listing | Agent (owner) |

**Query parameters for `GET /api/properties`:** `search`, `propertyType`, `listingType`, `minPrice`, `maxPrice`, `bedrooms`, `location`, `sort`, `page`, `limit`, `agentId`

### Inquiries

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/inquiries` | Submit an inquiry on a property | Buyer |
| `GET` | `/api/inquiries/mine` | Get inquiries for the logged-in user | Authenticated |
| `PATCH` | `/api/inquiries/:id/status` | Update inquiry status | Agent |

### Dashboard

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Aggregated views/inquiries/status stats | Agent |

### Example Request

```bash
curl "https://nest-find-server.vercel.app/api/properties?propertyType=apartment&listingType=sale&sort=newest"
```

## 📂 Project Structure

```
Nest-find-server/
├── index.js          # Express app, MongoDB connection, and all API routes
├── .env               # PORT, MONGO_URI, BETTER_AUTH_SECRET (not committed)
├── .gitignore
├── vercel.json
├── package.json
└── package-lock.json
```

> The server is intentionally kept as a single `index.js` file — all routes, the MongoDB connection (`MongoClient`), and helper functions like `parseId()` for safely converting string IDs to Mongo `ObjectId`s live here.

## 🔗 Related Repositories

| Repo | Description |
|---|---|
| [Nest-find-server](https://github.com/u2404057-cuet/Nest-find-server) | Backend API (this repo) |
| [Nest-find](https://github.com/u2404057-cuet/Nest-find) | Frontend application |


## 👤 Author

**Rahimul Houqe**
Full-Stack Developer · CSE Student at CUET

- GitHub: [@u2404057-cuet](https://github.com/u2404057-cuet)

---

<div align="center">
Made with ❤️ using Express.js and TypeScript
</div>
