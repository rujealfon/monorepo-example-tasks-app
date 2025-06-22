# Local Development Setup

## PostgreSQL with Docker

This project uses PostgreSQL for the database. For local development, we use Docker to run PostgreSQL.

### Prerequisites

- Docker and Docker Compose installed
- Bun package manager installed

### Quick Start

1. **Start PostgreSQL Database**

   ```bash
   docker-compose up -d
   ```

   This starts PostgreSQL on port 5433 (to avoid conflicts with any local PostgreSQL installation).

2. **Set up Environment Variables**

   ```bash
   cd apps/api
   cp .env.example .env
   ```

   The `.env` file should contain:

   ```
   DATABASE_URL=postgres://postgres:password@localhost:5433/tasks_app_dev
   ```

3. **Run Database Migrations**

   ```bash
   cd apps/api
   bun run db:migrate
   ```

4. **Start Development Server**

   ```bash
   # From project root
   nr dev
   ```

   This starts both the API server and web app. The API runs on port 3000.

### Database Management

- **View Database**: You can connect to the database using any PostgreSQL client:

  - Host: `localhost`
  - Port: `5433`
  - Database: `tasks_app_dev`
  - Username: `postgres`
  - Password: `password`

- **Stop Database**: `docker-compose down`
- **Reset Database**: `docker-compose down -v` (removes all data)
- **View Logs**: `docker-compose logs postgres`

## Connecting to Production Database (fly.io)

You can connect to your production PostgreSQL database on fly.io from your local machine in several ways:

### Method 1: Direct Connection (Recommended)

```bash
flyctl postgres connect -a api-fragrant-cherry-5252-db
```

This opens a direct psql session to your production database.

### Method 2: Proxy Connection

For connecting with external tools (like database GUIs), create a proxy:

```bash
# Start proxy (runs in background)
flyctl proxy 5434:5432 -a api-fragrant-cherry-5252-db
```

Then connect using any PostgreSQL client:

- **Host**: `localhost`
- **Port**: `5434`
- **Database**: `api_fragrant_cherry_5252`
- **Username**: `api_fragrant_cherry_5252`
- **Password**: `mwRpxanLEOann3F`

### Method 3: psql via Proxy

```bash
# In one terminal, start the proxy
flyctl proxy 5434:5432 -a api-fragrant-cherry-5252-db

# In another terminal, connect with psql
PGPASSWORD=mwRpxanLEOann3F psql -h localhost -p 5434 -U api_fragrant_cherry_5252 -d api_fragrant_cherry_5252
```

### Production Database Info

- **App**: `api-fragrant-cherry-5252`
- **Database Cluster**: `api-fragrant-cherry-5252-db`
- **Database Name**: `api_fragrant_cherry_5252`
- **Username**: `api_fragrant_cherry_5252`
- **Tables**: `account`, `authenticator`, `session`, `tasks`, `user`, `verificationToken`

⚠️ **Warning**: Be careful when working with production data. Consider creating a staging environment for testing.

### Troubleshooting

- **Port 5432 in use**: If you have PostgreSQL running locally, this setup uses port 5433 to avoid conflicts
- **Database connection errors**: Make sure the Docker container is running with `docker-compose ps`
- **Migration errors**: Ensure the DATABASE_URL in your `.env` file matches the Docker setup
- **Proxy connection fails**: Make sure flyctl is authenticated with `flyctl auth login`

### Production vs Development

- **Production**: Uses PostgreSQL on fly.io with auto-migrations
- **Development**: Uses local PostgreSQL in Docker on port 5433
