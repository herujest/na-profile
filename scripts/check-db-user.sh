#!/bin/bash
# Script to check what PostgreSQL users exist in the database

CONTAINER_NAME="nisa-profile-db"

echo "Checking PostgreSQL users in container: $CONTAINER_NAME"
echo "=========================================="

# Try to list all users using psql with different common usernames
echo ""
echo "Attempting to connect and list users..."
echo ""

# Method 1: Try with postgres user
echo "1. Trying with 'postgres' user:"
docker exec $CONTAINER_NAME psql -U postgres -c "\du" 2>&1 || echo "Failed with 'postgres' user"

echo ""
echo "2. Trying with 'nisa_profile' user (database name):"
docker exec $CONTAINER_NAME psql -U nisa_profile -d nisa_profile -c "\du" 2>&1 || echo "Failed with 'nisa_profile' user"

echo ""
echo "3. Checking environment variables in container:"
docker exec $CONTAINER_NAME env | grep POSTGRES

echo ""
echo "4. Listing all roles directly (using superuser if available):"
# Try to execute psql without specifying user (might use default)
docker exec $CONTAINER_NAME psql -d postgres -c "\du" 2>&1 || \
docker exec $CONTAINER_NAME psql -d nisa_profile -c "\du" 2>&1 || \
echo "Could not connect to list users"

