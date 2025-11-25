# Quick Backup Command

Berdasarkan environment variables Anda, gunakan perintah berikut untuk backup:

## Backup Database
```bash
docker exec nisa-profile-db pg_dump -U nisaaulia nisa_profile > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Restore Database
```bash
docker exec -i nisa-profile-db psql -U nisaaulia nisa_profile < backup_YYYYMMDD_HHMMSS.sql
```

## Environment Variables yang Digunakan
- POSTGRES_USER=nisaaulia
- POSTGRES_PASSWORD=nisaaulia123321
- POSTGRES_DB=nisa_profile
- POSTGRES_PORT=5433

