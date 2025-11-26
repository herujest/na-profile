#!/bin/bash
# Run the TypeScript script to assign portfolios to partners
# This should be run after the migration is applied

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "Assigning portfolios to partners..."

# Use tsx or ts-node to run the TypeScript file
if command -v npx &> /dev/null; then
    npx tsx scripts/assign-portfolio-to-partner.ts
elif command -v ts-node &> /dev/null; then
    ts-node scripts/assign-portfolio-to-partner.ts
else
    echo "Error: Need tsx or ts-node to run TypeScript files."
    echo "Install with: npm install -g tsx"
    exit 1
fi

