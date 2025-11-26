#!/bin/bash

# Script to open Prisma Studio for production
# Usage: ./scripts/studio-prod.sh
# WARNING: Use with caution in production!

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Load environment variables from .env.production
if [ -f "$PROJECT_ROOT/.env.production" ]; then
    export $(cat "$PROJECT_ROOT/.env.production" | grep -v '^#' | xargs)
else
    echo "⚠️  .env.production not found. Please run ./scripts/setup-env.sh first"
    exit 1
fi

cd "$PROJECT_ROOT"

echo "⚠️  WARNING: Opening Prisma Studio for PRODUCTION database!"
echo "Press Ctrl+C to cancel, or wait 5 seconds to continue..."
sleep 5

# Run Prisma Studio
npx prisma studio

