# Multi-stage build for production
# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json yarn.lock* package-lock.json* ./

# Install dependencies
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
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

# Remove existing Prisma Client if exists and generate new one
RUN rm -rf node_modules/.prisma && npx prisma generate

# Build Next.js application
RUN yarn build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Next.js build files
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Copy styles folder (CSS files)
COPY --from=builder --chown=nextjs:nodejs /app/styles ./styles

# Copy data folder (JSON files used at runtime)
COPY --from=builder --chown=nextjs:nodejs /app/data ./data

# Copy _posts folder (blog markdown files)
COPY --from=builder --chown=nextjs:nodejs /app/_posts ./_posts

# Copy assets folder
COPY --from=builder --chown=nextjs:nodejs /app/assets ./assets

# Copy webpack folder (for GSAP mock)
COPY --from=builder --chown=nextjs:nodejs /app/webpack ./webpack

# Copy config files needed at runtime
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./next.config.js
COPY --from=builder --chown=nextjs:nodejs /app/tailwind.config.js ./tailwind.config.js
COPY --from=builder --chown=nextjs:nodejs /app/postcss.config.js ./postcss.config.js

# Copy Prisma files
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Copy package.json and node_modules (needed for Next.js to run)
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

EXPOSE 5175

ENV PORT=5175
ENV HOSTNAME="0.0.0.0"

# Run migrations and start the app
CMD ["sh", "-c", "npx prisma migrate deploy && node_modules/.bin/next start -p 5175"]
