# Hono + React / Vite + bun workspaces monorepo

A monorepo setup using bun workspaces with a Hono API and React / vite client. Deploy to either Fly.io or Vercel.

Features:

- Run tasks in parallel across apps / packages with bun
- Hono API running natively on Bun with [proxied with vite](./apps/web/vite.config.ts) during development
- Hono [RPC client](packages/api-client/src/index.ts) built during development for faster inference
- PostgreSQL database with Drizzle ORM
- Multiple deployment options: Fly.io (Docker) or Vercel (Serverless)
- Shared Zod validators with drizzle-zod
- Shared eslint config
- Shared tsconfig

Tech Stack:

- api
  - hono
  - hono openapi
  - authjs
  - stoker
  - drizzle
  - drizzle-zod
- web
  - react
  - vite
  - react-hook-form
  - tanstack router
- dev tooling
  - typescript
  - eslint with `@antfu/eslint-config`

Tour:

- Base [tsconfig.json](./tsconfig.json) with default settings lives in the root
- Shared packages live in [/packages] directory
  - Base [eslint.config.js](./packages/eslint-config/eslint.config.js) with default settings
- Applications live in [/apps] directory
  - Use any cli to create new apps in here
  - If cloning a git repo in here be sure to delete the `.git` folder so it is not treated as a submodule

> All bun commands are run from the root of the repo.

## Local Setup

### Install dependencies

```sh
bun install
```

### Set up PostgreSQL database

Create a `.env` file in `apps/api/` with your database connection:

```sh
DATABASE_URL="postgresql://username:password@localhost:5432/tasks_app"
AUTH_SECRET="your-auth-secret-here"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### Generate and run database migrations

```sh
cd apps/api
bun run db:generate
bun run db:migrate
```

### Start Apps

```sh
bun run dev
```

Visit [http://localhost:5173](http://localhost:5173)

All requests to `/api` will be proxied to the hono server running on [http://localhost:3000](http://localhost:3000)

## Production Setup

Choose between two deployment options:

### Option 1: Deploy to Fly.io (Recommended for full-stack apps)

#### Install Fly CLI

[Install the Fly CLI](https://fly.io/docs/getting-started/installing-flyctl/) and authenticate:

```sh
flyctl auth login
```

#### Deploy to Fly.io

```sh
cd apps/api
fly launch --no-deploy
```

Set your production environment variables:

```sh
fly secrets set DATABASE_URL="your-production-database-url"
fly secrets set AUTH_SECRET="your-production-auth-secret"
fly secrets set GITHUB_CLIENT_ID="your-github-client-id"
fly secrets set GITHUB_CLIENT_SECRET="your-github-client-secret"
```

Deploy:

```sh
bun run deploy:fly
```

### Option 2: Deploy to Vercel (Serverless)

#### Install Vercel CLI

```sh
npm i -g vercel
```

#### Deploy to Vercel

```sh
cd apps/api
vercel login
```

Set your production environment variables in Vercel dashboard or via CLI:

```sh
vercel env add DATABASE_URL
vercel env add AUTH_SECRET
vercel env add GITHUB_CLIENT_ID
vercel env add GITHUB_CLIENT_SECRET
```

Deploy:

```sh
bun run deploy:vercel
```

Note: For Vercel deployment, you'll need to use a serverless-compatible PostgreSQL service like:

- Vercel Postgres
- Supabase
- Neon
- PlanetScale

## Tasks

### Lint

```sh
bun run lint
```

### Test

```sh
bun run test
```

### Build

```sh
bun run build
```
