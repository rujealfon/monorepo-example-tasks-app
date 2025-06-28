# Migration from SQLite (D1) to PostgreSQL

This guide outlines the changes made to migrate from Cloudflare D1 (SQLite) to PostgreSQL.

## Changes Made

### 1. Dependencies Updated

- **Removed**: `@libsql/client` (SQLite client)
- **Added**: `@neondatabase/serverless` (PostgreSQL client for edge environments)

### 2. Database Schema Migration

- Converted from `sqliteTable` to `pgTable`
- Updated column types:
  - `integer({ mode: "number" }).primaryKey({ autoIncrement: true })` → `serial("id").primaryKey()`
  - `text()` → `varchar()` with length constraints
  - `integer({ mode: "boolean" })` → `boolean()`
  - `integer({ mode: "timestamp_ms" })` → `timestamp({ mode: "date" })`

### 3. Configuration Updates

- **Drizzle Config**: Changed dialect from `"sqlite"` to `"postgresql"` and updated to read `DATABASE_URL` from environment variables
- **Database Connection**: Replaced D1 binding with PostgreSQL connection string
- **Environment Variables**: Replaced `DB` binding with `DATABASE_URL`

### 4. Wrangler Configuration

- Removed D1 database configuration
- Added `DATABASE_URL` environment variable

## Deployment Requirements

### 1. PostgreSQL Database Setup

You need a PostgreSQL database that's accessible from Cloudflare Workers. Recommended providers:

- **Neon** (recommended for Cloudflare Workers): https://neon.tech
- **Supabase**: https://supabase.com
- **PlanetScale** (MySQL alternative): https://planetscale.com
- **Turso** (SQLite-compatible but with PostgreSQL features): https://turso.tech

### 2. Environment Variables

For local development, create a `.dev.vars` file at the root of your project:

```
DATABASE_URL=postgresql://username:password@host:5432/database_name
```

For production deployment, use Wrangler to add your database connection string as a secret:

```bash
pnpm dlx wrangler secret put DATABASE_URL
```

When prompted, paste your PostgreSQL connection string.

### 3. Deploy Database Schema

The Drizzle config has been updated to automatically load the `DATABASE_URL` from your `.dev.vars` file. It will throw a clear error if the file is missing or `DATABASE_URL` is not defined.

Run the migration to create the PostgreSQL tables:

```bash
# For local development (reads from .dev.vars automatically)
pnpm db:push

# Or apply migrations manually to your production database
# The migration file is: src/db/migrations/0000_sparkling_korvac.sql
```

### 4. Update Wrangler Configuration

Remove any D1 database configuration from your `wrangler.toml`. The `DATABASE_URL` should be configured as:

- **Local development**: Using `.dev.vars` file (as shown in step 2)
- **Production**: Using Wrangler secrets (as shown in step 2)

Do not add `DATABASE_URL` to the `[vars]` section in `wrangler.toml` for security reasons.

### 5. Deploy to Cloudflare Workers

```bash
pnpm deploy
```

## Database Schema Comparison

### Before (SQLite/D1)

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);
```

### After (PostgreSQL)

```sql
CREATE TABLE "tasks" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(500) NOT NULL,
  "done" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
```

## Benefits of PostgreSQL Migration

1. **Better Performance**: PostgreSQL generally offers better performance for complex queries
2. **Rich Data Types**: Support for JSON, arrays, and other advanced data types
3. **ACID Compliance**: Full ACID transaction support
4. **Scalability**: Better horizontal and vertical scaling options
5. **Ecosystem**: Larger ecosystem of tools and extensions

## Rollback Plan

If you need to rollback to SQLite/D1:

1. Revert the git changes to this migration
2. Restore the D1 configuration in `wrangler.toml`
3. Run `pnpm install` to restore old dependencies
4. Deploy the previous version

## Testing

Make sure to test all functionality after migration:

1. CRUD operations on tasks
2. Authentication flows
3. All API endpoints
4. Database queries and performance

## Support

For any issues with this migration, check:

1. Database connection string format
2. Network connectivity from Cloudflare Workers to your PostgreSQL instance
3. Database permissions and user access
