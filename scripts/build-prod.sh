#!/bin/bash

# Script to build Next.js application for production
# Usage: ./scripts/build-prod.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Load environment variables from .env.production
if [ -f "$PROJECT_ROOT/.env.production" ]; then
    export $(cat "$PROJECT_ROOT/.env.production" | grep -v '^#' | xargs)
else
    echo "⚠️  .env.production not found!"
    echo "💡 Run './scripts/setup-env.sh prod' to create .env.production"
    echo "⚠️  Continuing with environment variables from current shell..."
fi

# Set NODE_ENV to production
export NODE_ENV=production

cd "$PROJECT_ROOT"

echo "🔨 Building Next.js application for PRODUCTION..."
echo "📦 Using DATABASE_URL from .env.production"

# Generate Prisma Client
# Note: For production build, we might use a dummy DATABASE_URL
# since Prisma Client generation doesn't need a real connection
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Build Next.js
echo "🏗️  Building Next.js..."
next build

echo "✅ Production build complete!"

