#!/bin/sh
set -e

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

