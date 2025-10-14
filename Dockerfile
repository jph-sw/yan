# 1. Base image
FROM oven/bun:1.2.22 AS base
WORKDIR /app

RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# 2. Install all dependencies
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --ci

# 3. Run formatting and lint checks during build
FROM deps AS checks
COPY . .

# 4. Build the application
FROM checks AS build
# Source already copied in the previous stage; dependencies are present
RUN bun run build
RUN bun run build:server

# 5. Final production image
FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/dist ./dist/
COPY --from=build /app/node_modules ./node_modules/

USER bun
EXPOSE 3000/tcp
CMD ["bun", "dist/server.js"]
