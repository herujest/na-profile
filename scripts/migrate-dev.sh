#!/bin/bash

# Script to run Prisma migrations for development
# Usage: ./scripts/migrate-dev.sh [command]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Load environment variables from .env.development
if [ -f "$PROJECT_ROOT/.env.development" ]; then
    export $(cat "$PROJECT_ROOT/.env.development" | grep -v '^#' | xargs)
else
    echo "⚠️  .env.development not found. Please run ./scripts/setup-env.sh first"
    exit 1
fi

cd "$PROJECT_ROOT"

# Run Prisma command
npx prisma migrate "${1:-deploy}"

