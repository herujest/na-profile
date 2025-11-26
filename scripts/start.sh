#!/bin/sh
set -e

# Set npm cache directory to a writable location (avoid permission issues)
export npm_config_cache=/tmp/.npm
export NPM_CONFIG_CACHE=/tmp/.npm
mkdir -p /tmp/.npm

echo "🔧 Generating Prisma Client..."
# Generate Prisma Client at runtime to avoid Docker build issues
# This is necessary because Prisma generation fails during Docker builds with assertion errors
npx prisma generate --schema=./prisma/schema.prisma || {
  echo "⚠️  Prisma generation failed, trying with yarn..."
  yarn prisma generate --schema=./prisma/schema.prisma || {
    echo "❌ Prisma generation failed with both npm and yarn"
    exit 1
  }
}

echo "🔍 Checking Prisma migration status..."

# Mark failed migration as rolled back if it exists
if npx prisma migrate status 2>&1 | grep -q "20251119094039_rename_photographers_to_tags.*failed"; then
  echo "⚠️  Found failed migration, marking as rolled back..."
  npx prisma migrate resolve --rolled-back 20251119094039_rename_photographers_to_tags || true
fi

# Deploy migrations
echo "📦 Deploying Prisma migrations..."
npx prisma migrate deploy

# Start the application
echo "🚀 Starting Next.js server..."
exec node server.js

