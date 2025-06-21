FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies into temp directory
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Build the web app
FROM base AS web-build
WORKDIR /app/web
COPY ../../web/package.json ../../web/bun.lockb ./
RUN bun install --frozen-lockfile
COPY ../../web .
RUN bun run build

# Copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=install /temp/dev/node_modules node_modules
COPY src ./src
COPY package.json .
COPY --from=web-build /app/web/dist ../web/dist

# Expose port and run the application
EXPOSE 3000
ENTRYPOINT ["bun", "run", "src/server.ts"]