#!/bin/bash

# Script to build Next.js application for development
# Usage: ./scripts/build-dev.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Load environment variables from .env.development
if [ -f "$PROJECT_ROOT/.env.development" ]; then
    export $(cat "$PROJECT_ROOT/.env.development" | grep -v '^#' | xargs)
else
    echo "⚠️  .env.development not found. Using default values..."
    echo "💡 Run './scripts/setup-env.sh' to create .env.development"
fi

# Set NODE_ENV to development
export NODE_ENV=development

cd "$PROJECT_ROOT"

echo "🔨 Building Next.js application for DEVELOPMENT..."
echo "📦 Using DATABASE_URL from .env.development"

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Build Next.js
echo "🏗️  Building Next.js..."
next build

echo "✅ Development build complete!"

