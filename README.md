# Retailer Sales Representative App

A comprehensive backend application built with **NestJS**, **Prisma**, and **PostgreSQL** for managing retailers, sales representatives, regions, areas, and assignments. Features JWT authentication, role-based access control, and bulk operations support.

---

## 🚀 Features

### **Authentication & Authorization**

* JWT-based authentication
* Role-based access control (ADMIN, SALES_REP)

### **Core Functionality**

* Complete CRUD operations for regions, areas, and retailers
* Bulk retailer import via CSV
* Bulk assign/unassign retailers to sales representatives

### **Tech Stack**

* NestJS framework
* Prisma ORM
* PostgreSQL database
* Fully Dockerized setup

---

## 📁 Project Structure

```
.
├── docker-compose.yml         # Multi-service Docker setup
├── Dockerfile                 # App Docker build
├── .env                       # Environment variables
├── prisma/
│   ├── schema.prisma          # Prisma DB schema
│   ├── seed.ts                # DB seeding script
│   └── migrations/            # Prisma migrations
├── src/
│   ├── app.module.ts          # Main NestJS module
│   ├── app.controller.ts      # Health check/root
│   ├── admin/                 # Admin routes, service, module
│   ├── auth/                  # Auth logic, guards, JWT
│   ├── prisma/                # Prisma service/module
│   ├── retailers/             # Retailer routes, service, module
│   └── ...                    # Other modules
├── docs/
│   └── api.http               # Example API requests
└── test/                      # E2E tests
```

---

## 📋 Prerequisites

* Docker & Docker Compose
* Node.js (for local development)

---

## 🐳 Quick Start (Docker)

### 1. Clone the repository

```bash
git clone <repository-url>
cd retailer-sales-app
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Update .env with your configuration (especially JWT_SECRET)
```

### 3. Build and start the services

```bash
docker compose up --build -d
```

### 4. Seed the database (if not auto-run)

```bash
docker compose exec app npx ts-node prisma/seed.ts
```

**API URL:** [http://localhost:3000](http://localhost:3000)

---

## 💻 Local Development

### Install dependencies

```bash
npm install
```

### Generate Prisma client

```bash
npx prisma generate
```

### Run database migrations

```bash
npx prisma migrate dev
```

### Seed the database

```bash
npx ts-node prisma/seed.ts
```

### Start the development server

```bash
npm run start:dev
```

---

## 🔐 Authentication

Use the `/auth/login` endpoint with username/password credentials to obtain a JWT token.

### **Default Seeded Users**

| Role      | Username   | Password        |
| --------- | ---------- | --------------- |
| Admin     | `admin`    | `adminpassword` |
| Sales Rep | `salesrep` | `reppassword`   |

Use the token:

```http
Authorization: Bearer <your-token>
```

---

## 📚 API Documentation

See `docs/api.http` for ready-to-use HTTP requests covering all available endpoints.

---

## 🛠️ Useful Commands

| Command                                              | Description                               |
| ---------------------------------------------------- | ----------------------------------------- |
| `docker compose up --build -d`                       | Build and run containers in detached mode |
| `docker compose down`                                | Stop and remove containers                |
| `docker compose logs app`                            | View application logs                     |
| `docker compose exec app npx ts-node prisma/seed.ts` | Run database seed script                  |
| `npx prisma studio`                                  | Open Prisma Studio (database GUI)         |
| `npm run test`                                       | Run tests                                 |

---

## 📝 License

MIT

Built with ❤️ using **NestJS**, **Prisma**, and **PostgreSQL**.
