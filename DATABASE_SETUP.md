# Database Setup Guide

Proyek ini menggunakan konfigurasi database terpisah untuk environment **development** dan **production**.

## Struktur Database

- **Development**: `nisa_profile_dev` (port 5433)
- **Production**: `nisa_profile_prod` (port 5432)

## Setup Awal

### 1. Setup Environment Files

Jalankan script setup untuk membuat file environment:

```bash
./scripts/setup-env.sh
```

Atau manual:
```bash
# Development
cp env.development.template .env.development

# Production
cp env.production.template .env.production
```

### 2. Edit Environment Files

Edit file `.env.development` dan `.env.production` dengan nilai yang sesuai:

**Development (.env.development)**:
- `DATABASE_URL`: URL database development
- `ADMIN_USERNAME` & `ADMIN_PASSWORD`: Kredensial admin untuk development
- `R2_*`: Konfigurasi R2/S3 untuk development

**Production (.env.production)**:
- `DATABASE_URL`: URL database production (gunakan password yang kuat!)
- `ADMIN_USERNAME` & `ADMIN_PASSWORD`: Kredensial admin untuk production
- `R2_*`: Konfigurasi R2/S3 untuk production

⚠️ **PENTING**: Jangan commit file `.env.production` ke git!

## Menjalankan Database

### Development Database

```bash
# Start database
yarn db:dev:up

# Stop database
yarn db:dev:down

# View logs
yarn db:dev:logs

# Run migrations
yarn db:dev:migrate

# Open Prisma Studio
yarn db:dev:studio
```

### Production Database

```bash
# Start database
yarn db:prod:up

# Stop database
yarn db:prod:down

# View logs
yarn db:prod:logs

# Run migrations
yarn db:prod:migrate

# Open Prisma Studio (hati-hati di production!)
yarn db:prod:studio
```

## Development Workflow

1. **Start development database**:
   ```bash
   yarn db:dev:up
   ```

2. **Run migrations** (jika ada perubahan schema):
   ```bash
   yarn db:dev:migrate
   ```

3. **Start Next.js dev server**:
   ```bash
   yarn dev
   ```

   Next.js akan otomatis membaca `.env.development` saat development.

4. **Akses Prisma Studio** (opsional):
   ```bash
   yarn db:dev:studio
   ```

## Production Workflow

1. **Setup environment file** di server production:
   ```bash
   cp env.production.template .env.production
   # Edit .env.production dengan nilai production
   ```

2. **Start production database**:
   ```bash
   yarn db:prod:up
   ```

3. **Run migrations**:
   ```bash
   yarn db:prod:migrate
   ```

4. **Build aplikasi untuk production**:
   ```bash
   yarn build:prod
   # atau untuk development build (testing)
   yarn build:dev
   ```

5. **Start aplikasi**:
   ```bash
   yarn start:prod  # Production (port 5175)
   # atau
   yarn start:dev   # Development (port 3001)
   ```

## Build Scripts

### Development Build
```bash
yarn build:dev
```
- Menggunakan `.env.development`
- NODE_ENV=development
- Cocok untuk testing build lokal

### Production Build
```bash
yarn build:prod
```
- Menggunakan `.env.production`
- NODE_ENV=production
- Untuk deployment production

### Default Build
```bash
yarn build
```
- Menggunakan environment default Next.js
- Load `.env.local` atau `.env` jika ada

## Docker Compose Files

- `docker-compose.dev.yml`: Konfigurasi untuk development database dan aplikasi
- `docker-compose.prod.yml`: Konfigurasi untuk production database dan aplikasi

## Docker Build Commands

### Development Docker Build

```bash
# Build lokal (development)
yarn docker:build:dev

# Build dan push ke registry (development)
yarn docker:build:dev:push

# Build dan push hanya amd64 (development)
yarn docker:build:dev:push:amd
```

### Production Docker Build

```bash
# Build lokal (production)
yarn docker:build:prod

# Build dan push ke registry (production)
yarn docker:build:prod:push

# Build dan push hanya amd64 (production) - Recommended untuk VPS
yarn docker:build:prod:push:amd
```

### Docker Compose dengan Build

**Development:**
```bash
# Build dan start semua services (dev)
docker-compose -f docker-compose.dev.yml --env-file .env.development up -d --build

# Stop services
docker-compose -f docker-compose.dev.yml --env-file .env.development down
```

**Production:**
```bash
# Build dan start semua services (prod)
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# Stop services
docker-compose -f docker-compose.prod.yml --env-file .env.production down
```

### Dockerfile

- `Dockerfile.dev`: Dockerfile untuk development build (port 3001, NODE_ENV=development)
- `Dockerfile`: Dockerfile untuk production build (port 5175, NODE_ENV=production)

## Environment Variables

### Database Configuration

| Variable | Development | Production |
|----------|-------------|-----------|
| `DATABASE_URL` | `postgresql://...@localhost:5433/nisa_profile_dev` | `postgresql://...@host:5432/nisa_profile_prod` |
| `POSTGRES_DB` | `nisa_profile_dev` | `nisa_profile_prod` |
| `POSTGRES_PORT` | `5433` | `5432` |

### Connection Pooling

Database URL sudah dikonfigurasi dengan connection pooling:
- `connection_limit=10`: Maksimal 10 koneksi
- `pool_timeout=20`: Timeout 20 detik

Untuk production, tambahkan `sslmode=require` jika menggunakan SSL.

## Troubleshooting

### Database tidak bisa connect

1. Pastikan database container sudah running:
   ```bash
   docker ps
   ```

2. Cek logs database:
   ```bash
   yarn db:dev:logs  # atau yarn db:prod:logs
   ```

3. Verifikasi `DATABASE_URL` di file `.env` sesuai dengan konfigurasi docker-compose

### Migration gagal

1. Pastikan database sudah running
2. Cek status migration:
   ```bash
   yarn migrate:status
   ```
3. Jika perlu reset (hati-hati, akan menghapus data!):
   ```bash
   # Development only!
   yarn db:dev:down
   docker volume rm na-profile_postgres_dev_data
   yarn db:dev:up
   yarn db:dev:migrate
   ```

### Port sudah digunakan

Jika port 5433 (dev) atau 5432 (prod) sudah digunakan:

1. Edit file `.env.development` atau `.env.production`
2. Ubah `POSTGRES_PORT` ke port lain
3. Update `DATABASE_URL` sesuai port baru
4. Restart database container

## Backup & Restore

### Backup Development Database

```bash
docker exec nisa-profile-db-dev pg_dump -U postgres nisa_profile_dev > backup_dev_$(date +%Y%m%d_%H%M%S).sql
```

### Backup Production Database

```bash
docker exec nisa-profile-db-prod pg_dump -U postgres nisa_profile_prod > backup_prod_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database

```bash
# Development
docker exec -i nisa-profile-db-dev psql -U postgres nisa_profile_dev < backup_file.sql

# Production
docker exec -i nisa-profile-db-prod psql -U postgres nisa_profile_prod < backup_file.sql
```

## Security Notes

1. **Jangan commit** file `.env.production` ke git
2. Gunakan **password yang kuat** untuk production database
3. Gunakan **SSL connection** untuk production database jika memungkinkan
4. Batasi akses ke production database hanya dari IP yang diperlukan
5. Backup database production secara berkala

