# Side Project Starter

Monorepo starter for a TypeScript side project using:

- Next.js for the frontend
- Bun for runtime and scripts
- Hono for the API layer
- Drizzle ORM with PostgreSQL

## Layout

- `apps/web` - Next.js frontend
- `apps/api` - Bun + Hono backend
- `packages/db` - Drizzle schema and database client
- `packages/shared` - shared types for future expansion

## Quick Start

1. Copy `.env.example` to `.env`
2. Start PostgreSQL with `docker compose up -d`
3. Install dependencies with `bun install`
4. Run the frontend and backend in separate terminals:
   - `bun run dev:web`
   - `bun run dev:api`

## Database

- Generate migrations with `bun run db:generate`
- Apply migrations with `bun run db:migrate`
- Open Drizzle Studio with `bun run db:studio`
