#!/bin/bash

# Script to run Prisma migrations for production
# Usage: ./scripts/migrate-prod.sh [command]

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

# Run Prisma command
npx prisma migrate "${1:-deploy}"

