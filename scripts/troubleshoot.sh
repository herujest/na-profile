#!/bin/bash

# Troubleshooting script for Docker deployment

echo "🔍 Troubleshooting Docker Deployment"
echo "====================================="
echo ""

echo "1. Checking Docker containers status..."
docker ps -a
echo ""

echo "2. Checking nisa-profile container logs (last 50 lines)..."
docker logs --tail 50 nisa-profile
echo ""

echo "3. Checking nisa-profile-db container logs (last 20 lines)..."
docker logs --tail 20 nisa-profile-db
echo ""

echo "4. Checking if port 5175 is listening..."
docker exec nisa-profile netstat -tuln | grep 5175 || echo "Port 5175 not listening!"
echo ""

echo "5. Testing application health..."
docker exec nisa-profile curl -f http://localhost:5175/ || echo "Application not responding!"
echo ""

echo "6. Checking environment variables..."
docker exec nisa-profile env | grep -E "NODE_ENV|DATABASE_URL|PORT"
echo ""

echo "7. Checking database connection..."
docker exec nisa-profile sh -c "npx prisma db pull --schema=./prisma/schema.prisma 2>&1 | head -5" || echo "Database connection failed!"
echo ""

echo "✅ Troubleshooting complete!"
echo ""
echo "Common fixes:"
echo "- If container is not running: docker-compose up -d"
echo "- If port conflict: Check APP_PORT in .env file"
echo "- If database error: Check DATABASE_URL and postgres container"
echo "- To restart: docker-compose restart nisa-profile"

