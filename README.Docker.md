# Docker Setup

This project includes Docker configuration for easy local development and production deployment.

## Quick Start

### Production Build

To run the complete application with production builds:

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build
```

The application will be available at:
- **Web App**: http://localhost
- **API**: http://localhost:3000
- **Database**: localhost:5432

### Development Mode

For development with hot reload:

```bash
# Start with development profile
docker-compose --profile dev up --build

# Run in background
docker-compose --profile dev up -d --build
```

The development services will be available at:
- **Web App**: http://localhost:5173
- **API**: http://localhost:3001
- **Database**: localhost:5432

## Services

### Database (PostgreSQL)
- **Image**: postgres:16-alpine
- **Port**: 5432
- **Database**: tasks_app
- **User**: postgres
- **Password**: postgres

### API Service
- **Framework**: Hono.js running on Node.js
- **Port**: 3000 (production) / 3001 (development)
- **Environment**: See `.env.example`

### Web Service
- **Framework**: Vite + React
- **Port**: 80 (production) / 5173 (development)
- **Reverse Proxy**: Nginx (production)

## Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Update the environment variables in `.env` as needed.

3. For GitHub OAuth, register a new OAuth App in GitHub:
   - Homepage URL: `http://localhost`
   - Authorization callback URL: `http://localhost/api/auth/callback/github`

## Database Management

Run database migrations:

```bash
# Generate migrations
docker-compose exec api pnpm db:generate

# Run migrations
docker-compose exec api pnpm db:migrate

# Open Drizzle Studio
docker-compose exec api pnpm db:studio
```

## Useful Commands

```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f web

# Stop all services
docker-compose down

# Remove all containers and volumes
docker-compose down -v

# Rebuild specific service
docker-compose build api
docker-compose up -d api
```

## Troubleshooting

### Database Connection Issues
- Ensure the database service is healthy: `docker-compose ps`
- Check database logs: `docker-compose logs db`

### API Issues
- Check API logs: `docker-compose logs api`
- Verify environment variables are set correctly

### Web Service Issues
- Check web logs: `docker-compose logs web`
- Ensure API service is running and accessible

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Web      │    │     API     │    │  Database   │
│   (Nginx)   │────│  (Node.js)  │────│ (PostgreSQL)│
│   Port 80   │    │  Port 3000  │    │  Port 5432  │
└─────────────┘    └─────────────┘    └─────────────┘
```

The web service proxies `/api/*` requests to the API service, providing a seamless development and production experience.