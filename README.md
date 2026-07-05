# NaijaBot 🇳🇬 – Enterprise WhatsApp Group Management Platform

NaijaBot is a production-ready, full-stack WhatsApp Group Management SaaS platform built with **Node.js, Express, TypeScript, and React**. It establishes a clean, modular foundation based on SOLID principles, Clean Architecture, and Dependency Injection to easily manage thousands of WhatsApp groups from an interactive web control center.

---

## 🛠️ Architecture & Tech Stack

This repository implements **Phase 1** of our enterprise roadmap, focusing on core server modularity, routing, environment validation, logging, and an interactive command and control interface.

*   **Backend Server:** Node.js 22+ with Express.js
*   **Logging Engine:** Pino & `pino-pretty` (high-performance structured logs)
*   **Asset Bundling:** Vite + `esbuild` full-stack compilation (front-end to static static, server transpiled to single-file CommonJS `dist/server.cjs` to eliminate runtime relative import path overhead)
*   **Configuration & Validation:** `Zod` (strict validation for env schemas)
*   **User Interface:** React + Tailwind CSS with premium dark emerald theme accents and `motion` layout animations.

---

## 📂 Directory Structure

```text
/
├── .github/workflows/ci.yml # GitHub Actions continuous integration pipeline
├── src/
│   ├── api/                 # REST API endpoints & routers
│   │   ├── controllers/     # Controller modules (health, groups, logs, users)
│   │   └── middleware/      # Express middlewares (errorHandler, requestLogger)
│   ├── config/              # Zod environment variable configurations
│   ├── database/            # Database layer (Prisma prepared, mockDb in-memory for Phase 1)
│   ├── logger/              # Pino logger configuration
│   ├── components/          # Modular UI components (Dashboard, Groups, Users, Console)
│   ├── App.tsx              # Frontend application coordinator
│   ├── main.tsx             # React SPA entry point
│   └── types.ts             # Global TypeScript interface definitions
├── server.ts                # Express server bootstrapper with integrated Vite middleware
├── Dockerfile               # Multi-stage optimized Docker deployment specification
├── docker-compose.yml       # Docker compose development environment with optional postgres
├── render.yaml              # Render blueprint specification file
├── tsconfig.json            # Strict-mode TypeScript options
├── vite.config.ts           # Vite transpilation directives
└── package.json             # NPM dependencies & pipeline scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have the following installed:
*   Node.js (v22 or higher)
*   NPM

### 2. Environment Setup

The application automatically reads environment variables. Customize them by copying `.env.example`:

```bash
cp .env.example .env
```

### 3. Installation

Install all required packages:

```bash
npm install
```

### 4. Running the Development Server

Start the full-stack server with automatic hot reloading of both backend controllers and frontend UI (via Vite middleware):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) inside your web browser.

### 5. Compiling for Production

Create an optimized build ready for container orchestration:

```bash
npm run build
```

The build compiles React assets into `dist/` and compiles/bundles the server code to a single production file inside `dist/server.cjs`.

### 6. Starting Production Server

Run the production-compiled CommonJS bundle:

```bash
npm run start
```

---

## 🛡️ CI/CD & Production Deployment

*   **GitHub Actions:** Each pull request or commit to `main` automatically runs `.github/workflows/ci.yml` checking lint compliance and build integrity.
*   **Docker:** Run standard compose builds locally:
    ```bash
    docker-compose up --build
    ```
*   **Render:** Push to GitHub and connect to your Render account using `render.yaml` to deploy to a Web Service container instantly.
