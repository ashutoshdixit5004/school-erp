# School ERP

Full-stack school automation system covering:

- Student & Admission management
- Attendance & Timetable
- Fees & Accounting
- Exams & Report Cards
- Staff / HR & Payroll
- Library, Transport, Hostel

**Stack:** React + TypeScript (frontend), NestJS + Prisma + PostgreSQL (backend), JWT auth with role-based access control.

## Project structure

```
school-erp/
  backend/         NestJS API (one module folder per feature)
  frontend/        React SPA
  docker-compose.yml   Local PostgreSQL
```

## 1. Start the database

```bash
docker compose up -d
```

This starts PostgreSQL on `localhost:5432` (user `postgres`, password `postgres`, db `school_erp`).

## 2. Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate      # creates all tables from prisma/schema.prisma
npm run prisma:seed         # loads a demo school + admin user
npm run start:dev
```

The API runs at `http://localhost:3000`. Swagger docs are at `http://localhost:3000/api/docs`.

Demo login (created by the seed script):
- email: `admin@greenwood.edu`
- password: `password123`

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and proxies `/api` requests to the backend.

## Architecture notes

- **Multi-school ready**: every table roots back to `School`, so this can serve one school or many without a schema rewrite.
- **RBAC**: every endpoint is guarded by `JwtAuthGuard` + `RolesGuard`, with roles defined per-route via `@Roles(...)`.
- **Admission → Student conversion**: approving an admission application runs inside a Prisma transaction that creates the `Student`, links the `Guardian`, and marks the application `APPROVED` — so the two records can never drift out of sync.
- **Fee status**: `FeeInvoice.status` is recalculated from the sum of `FeePayment` rows on every payment, rather than being hand-set, so it can't go stale.
- **Attendance**: marked per section per day via upsert — resubmitting a day's roster replaces that day's entries rather than duplicating them.
- **Report cards**: computed on the fly from `ExamResult` rows rather than stored, so there's no risk of a cached report card going out of date after a mark correction.

## What to build next

The scaffold intentionally leaves some things simple so you can extend them:

- **Frontend**: attendance page marks everyone "present" by default — wire it to fetch the section roster and let a teacher toggle each student's status.
- **File uploads**: admission documents and staff/student photos currently just take a `fileUrl` string — plug in S3 (or any object storage) and upload from the frontend before saving the URL.
- **Notifications**: no email/SMS is wired up yet for admission decisions, fee due dates, or payroll runs.
- **Timetable UI**: the `TimetableSlot` model exists but there's no frontend page for it yet.
- **Multi-school switch**: the schema supports multiple schools, but the frontend assumes a single school context per logged-in user — add a school switcher for `SUPER_ADMIN` users if you go multi-tenant.

## Extending to new modules

Follow the existing module pattern: a Prisma model in `schema.prisma`, a `*.service.ts` for business logic, a `*.controller.ts` with `@Roles(...)` guards, and a `*.module.ts` registered in `app.module.ts`. Every module in this scaffold follows that same shape, so a new one is a copy-paste-and-adapt job.
