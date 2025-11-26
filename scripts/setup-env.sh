#!/bin/bash

# Script to set up environment files for dev and prod
# Usage: ./scripts/setup-env.sh [dev|prod|both]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

setup_dev() {
    echo "Setting up development environment..."
    
    if [ -f "$PROJECT_ROOT/.env.development" ]; then
        echo "⚠️  .env.development already exists. Skipping..."
    else
        cp "$PROJECT_ROOT/env.development.template" "$PROJECT_ROOT/.env.development"
        echo "✅ Created .env.development from template"
        echo "📝 Please edit .env.development and fill in your values"
    fi
}

setup_prod() {
    echo "Setting up production environment..."
    
    if [ -f "$PROJECT_ROOT/.env.production" ]; then
        echo "⚠️  .env.production already exists. Skipping..."
    else
        cp "$PROJECT_ROOT/env.production.template" "$PROJECT_ROOT/.env.production"
        echo "✅ Created .env.production from template"
        echo "📝 Please edit .env.production and fill in your values"
        echo "⚠️  Remember: Never commit .env.production to git!"
    fi
}

case "${1:-both}" in
    dev)
        setup_dev
        ;;
    prod)
        setup_prod
        ;;
    both)
        setup_dev
        echo ""
        setup_prod
        ;;
    *)
        echo "Usage: $0 [dev|prod|both]"
        exit 1
        ;;
esac

echo ""
echo "✨ Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.development and .env.production with your actual values"
echo "2. For dev: Run 'yarn db:dev:up' to start the development database"
echo "3. For prod: Run 'yarn db:prod:up' to start the production database"

