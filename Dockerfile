# Multi-stage build for production
# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json yarn.lock* package-lock.json* ./

# Install dependencies (skip postinstall scripts - we'll run prisma generate in builder stage)
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile --ignore-scripts; \
  elif [ -f package-lock.json ]; then npm ci --ignore-scripts; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy Prisma schema first
COPY prisma ./prisma

# Copy the rest of the application
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Provide a dummy DATABASE_URL during build to allow Prisma Client to initialize
# The actual DATABASE_URL will be provided at runtime
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"

# Remove existing Prisma Client if exists and generate new one
RUN rm -rf node_modules/.prisma && npx prisma generate

# Build Next.js application
RUN npm run build || yarn build

# Stage 3: Runner
FROM node:18-alpine AS runner
# Accept build version as build argument
ARG BUILD_VERSION
LABEL version="${BUILD_VERSION}"

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build from builder (includes minimal server and dependencies)
# Standalone output creates a self-contained server in .next/standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Copy static files (standalone doesn't include static assets)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy public folder (standalone doesn't include it)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy additional runtime files needed
COPY --from=builder --chown=nextjs:nodejs /app/styles ./styles
COPY --from=builder --chown=nextjs:nodejs /app/lib/data ./lib/data
COPY --from=builder --chown=nextjs:nodejs /app/app/content ./app/content
COPY --from=builder --chown=nextjs:nodejs /app/assets ./assets
COPY --from=builder --chown=nextjs:nodejs /app/webpack ./webpack

# Copy Prisma files (needed for runtime - standalone may not include them properly)
# Check if they exist in standalone first, if not copy from builder
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Copy startup script
COPY --from=builder --chown=nextjs:nodejs /app/scripts/start.sh ./scripts/start.sh
RUN chmod +x ./scripts/start.sh

USER nextjs

EXPOSE 5175

ENV PORT=5175
ENV HOSTNAME="0.0.0.0"

# Run migrations and start the app using startup script
CMD ["./scripts/start.sh"]
