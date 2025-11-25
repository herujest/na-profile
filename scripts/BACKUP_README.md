# Database Backup Instructions

## Problem

If you get an error like:

```
pg_dump: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  role "postgres" does not exist
```

This means the database was initialized with a different PostgreSQL user than "postgres".

## Quick Solutions

### Option 1: Use the automated backup script (Recommended)

```bash
./scripts/backup-db.sh
```

This script will:

- Automatically detect the correct PostgreSQL user
- Try common usernames if detection fails
- Create backups in the `./backups/` directory

### Option 2: Use the correct user (nisaaulia)

Based on your environment variables, the PostgreSQL user is `nisaaulia`. Use this command:

```bash
docker exec nisa-profile-db pg_dump -U nisaaulia nisa_profile > backup_$(date +%Y%m%d_%H%M%S).sql
```

Or check what user the container is configured with:

```bash
docker exec nisa-profile-db env | grep POSTGRES_USER
```

Then use that user in your backup command:

```bash
docker exec nisa-profile-db pg_dump -U <ACTUAL_USER> nisa_profile > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Option 3: List all database users

To see what users exist in the database:

```bash
docker exec nisa-profile-db psql -d nisa_profile -c "\du"
```

### Option 4: Try common usernames

Try these common alternatives:

```bash
# Try with database name as username
docker exec nisa-profile-db pg_dump -U nisa_profile nisa_profile > backup_$(date +%Y%m%d_%H%M%S).sql

# Try without specifying user (uses default)
docker exec nisa-profile-db pg_dump nisa_profile > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Diagnostic Script

If you're still having issues, run:

```bash
./scripts/check-db-user.sh
```

This will help identify what PostgreSQL users exist in your database.

## Restoring a Backup

To restore a backup:

```bash
docker exec -i nisa-profile-db psql -U <POSTGRES_USER> nisa_profile < backup_YYYYMMDD_HHMMSS.sql
```

Replace `<POSTGRES_USER>` with the actual user you discovered, and `backup_YYYYMMDD_HHMMSS.sql` with your backup filename.
