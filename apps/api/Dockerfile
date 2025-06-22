# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /app

# Copy package.json and bun.lock from root
COPY package.json bun.lock* ./

# Copy workspace package.json files
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# Install dependencies (without frozen to handle any lockfile differences)
RUN bun install

# Copy all source code
COPY . .

# Build only the web app and api-client (api will run from source)
ENV NODE_ENV=production
RUN bun run build

# Switch to API directory for runtime
WORKDIR /app/apps/api

# Expose port 3000
EXPOSE 3000

# Run the app directly from source
USER bun
CMD ["bun", "run", "src/server.ts"]