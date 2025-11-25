#!/bin/bash
# Script to backup PostgreSQL database
# This script will automatically detect the correct username

CONTAINER_NAME="nisa-profile-db"
DB_NAME="nisa_profile"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Try to get the POSTGRES_USER from the container's environment
POSTGRES_USER=$(docker exec $CONTAINER_NAME env | grep POSTGRES_USER | cut -d '=' -f2)

if [ -z "$POSTGRES_USER" ]; then
    echo "Could not detect POSTGRES_USER from container environment."
    echo "Trying common usernames (including nisaaulia)..."
    
    # Try different common usernames including the actual one
    for USER in nisaaulia postgres nisa_profile admin; do
        echo "Attempting backup with user: $USER"
        if docker exec $CONTAINER_NAME pg_dump -U "$USER" "$DB_NAME" > "$BACKUP_FILE" 2>&1; then
            if [ -s "$BACKUP_FILE" ]; then
                echo "✓ Backup successful with user: $USER"
                echo "Backup saved to: $BACKUP_FILE"
                ls -lh "$BACKUP_FILE"
                exit 0
            else
                rm -f "$BACKUP_FILE"
            fi
        else
            ERROR=$(docker exec $CONTAINER_NAME pg_dump -U "$USER" "$DB_NAME" 2>&1)
            if echo "$ERROR" | grep -q "role.*does not exist"; then
                echo "✗ User '$USER' does not exist, trying next..."
            else
                echo "✗ Error with user '$USER': $ERROR"
            fi
            rm -f "$BACKUP_FILE"  # Remove empty/failed backup file
        fi
    done
    
    echo ""
    echo "ERROR: Could not determine correct PostgreSQL user."
    echo "Please run: ./scripts/check-db-user.sh to diagnose the issue."
    exit 1
else
    echo "Using PostgreSQL user from container: $POSTGRES_USER"
    echo "Creating backup..."
    
    if docker exec $CONTAINER_NAME pg_dump -U "$POSTGRES_USER" "$DB_NAME" > "$BACKUP_FILE"; then
        if [ -s "$BACKUP_FILE" ]; then
            echo "✓ Backup successful!"
            echo "Backup saved to: $BACKUP_FILE"
            ls -lh "$BACKUP_FILE"
        else
            echo "✗ Backup file is empty. There may have been an error."
            rm -f "$BACKUP_FILE"
            exit 1
        fi
    else
        echo "✗ Backup failed. Error:"
        docker exec $CONTAINER_NAME pg_dump -U "$POSTGRES_USER" "$DB_NAME" 2>&1
        rm -f "$BACKUP_FILE"
        exit 1
    fi
fi

