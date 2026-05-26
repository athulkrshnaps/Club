# NAVODHAYAM VAYANASHALA AMARAKUNI

A modern full-stack community club management platform for library services, sports and events, charity support, medical equipment requests, member self-service, and admin operations.

## Stack

- React + Vite + Tailwind CSS
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication with admin/member roles
- Multer-ready image/file uploads
- Responsive dark/light UI

## Quick Start

```bash
npm install
cp server/.env.example server/.env
npm run seed
npm run dev
```

The client runs at `http://localhost:5173` and the API runs at `http://localhost:5000`.

## Demo Accounts

After running `npm run seed`:

- Admin: `admin@navodhayam.org` / `Admin@12345`
- Member phone: `9876543210` / `Member@12345`

## Project Guides

- [Architecture](docs/ARCHITECTURE.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [API Structure](docs/API.md)
- [Authentication Flow](docs/AUTH_FLOW.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
