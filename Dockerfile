# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

# Copy package files first for layer caching
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

# Install all dependencies (including devDeps needed for build)
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build frontend (Vite) + backend (esbuild)
RUN pnpm build

# ─── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist

# Copy drizzle schema for migrations (optional, if running db:push at startup)
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

# Expose the port Railway will use
EXPOSE 3000

# Start the production server
ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "dist/index.js"]
