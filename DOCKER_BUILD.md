# Docker Build Guide

Panduan lengkap untuk build Docker image untuk development dan production.

## Dockerfile

Proyek ini memiliki 2 Dockerfile:

- **`Dockerfile.dev`**: Untuk development
  - Port: 3001
  - NODE_ENV: development
  - Image tag: `registry.gigsnow.in/nisa-profile:{version}-dev`

- **`Dockerfile`**: Untuk production
  - Port: 5175
  - NODE_ENV: production
  - Image tag: `registry.gigsnow.in/nisa-profile:{version}`

## Build Scripts

### Development Build

```bash
# Build lokal (tidak push ke registry)
yarn docker:build:dev
# atau
./scripts/docker-build-dev.sh --local

# Build dan push ke registry (multi-platform: amd64 + arm64)
yarn docker:build:dev:push
# atau
./scripts/docker-build-dev.sh --push

# Build dan push hanya amd64 (lebih cepat, recommended untuk VPS)
yarn docker:build:dev:push:amd
# atau
./scripts/docker-build-dev.sh --push-amd
```

### Production Build

```bash
# Build lokal (tidak push ke registry)
yarn docker:build:prod
# atau
./scripts/docker-build-prod.sh --local

# Build dan push ke registry (multi-platform: amd64 + arm64)
yarn docker:build:prod:push
# atau
./scripts/docker-build-prod.sh --push

# Build dan push hanya amd64 (lebih cepat, recommended untuk VPS)
yarn docker:build:prod:push:amd
# atau
./scripts/docker-build-prod.sh --push-amd
```

### Build dengan Version Custom

```bash
# Development
./scripts/docker-build-dev.sh 3.0.2 --push

# Production
./scripts/docker-build-prod.sh 3.0.2 --push
```

Jika version tidak diberikan, script akan membaca dari `package.json`.

## Docker Compose

### Development

```bash
# Build dan start semua services (database + aplikasi)
docker-compose -f docker-compose.dev.yml --env-file .env.development up -d --build

# Start tanpa build (jika image sudah ada)
docker-compose -f docker-compose.dev.yml --env-file .env.development up -d

# Stop services
docker-compose -f docker-compose.dev.yml --env-file .env.development down

# View logs
docker-compose -f docker-compose.dev.yml --env-file .env.development logs -f
```

### Production

```bash
# Build dan start semua services (database + aplikasi)
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# Start tanpa build (jika image sudah ada)
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Stop services
docker-compose -f docker-compose.prod.yml --env-file .env.production down

# View logs
docker-compose -f docker-compose.prod.yml --env-file .env.production logs -f
```

## Build Process

### Development Build Process

1. **Stage 1: Dependencies**
   - Install dependencies dari `package.json` dan `yarn.lock`

2. **Stage 2: Builder**
   - Copy dependencies
   - Copy Prisma schema
   - Generate Prisma Client (dengan dummy DATABASE_URL)
   - Build Next.js dengan `NODE_ENV=development`

3. **Stage 3: Runner**
   - Copy standalone build
   - Copy static files, public folder, dan runtime files
   - Copy Prisma files
   - Expose port 3001
   - Run migrations dan start aplikasi

### Production Build Process

1. **Stage 1: Dependencies**
   - Install dependencies dari `package.json` dan `yarn.lock`

2. **Stage 2: Builder**
   - Copy dependencies
   - Copy Prisma schema
   - Generate Prisma Client (dengan dummy DATABASE_URL)
   - Build Next.js dengan `NODE_ENV=production`

3. **Stage 3: Runner**
   - Copy standalone build
   - Copy static files, public folder, dan runtime files
   - Copy Prisma files
   - Expose port 5175
   - Run migrations dan start aplikasi

## Environment Variables

Environment variables di-set saat runtime melalui:
- Docker Compose: dari `.env.development` atau `.env.production`
- Docker run: via `-e` flag atau `--env-file`

**Penting**: DATABASE_URL di-set saat runtime, bukan saat build. Build menggunakan dummy DATABASE_URL hanya untuk generate Prisma Client.

## Multi-Platform Build

Docker buildx digunakan untuk build multi-platform (amd64 + arm64):

```bash
# Development
./scripts/docker-build-dev.sh --push

# Production
./scripts/docker-build-prod.sh --push
```

Untuk VPS yang hanya butuh amd64, gunakan `--push-amd` untuk build lebih cepat.

## Troubleshooting

### Build gagal karena Prisma

Pastikan Prisma schema valid:
```bash
npx prisma validate
```

### Build gagal karena memory

Tambah memory untuk Docker:
- Docker Desktop: Settings > Resources > Memory
- Atau gunakan `--push-amd` untuk build lebih ringan

### Image tidak bisa di-pull

Pastikan sudah login ke registry:
```bash
docker login registry.gigsnow.in
```

### Container tidak start

Cek logs:
```bash
docker-compose -f docker-compose.dev.yml --env-file .env.development logs
```

Pastikan DATABASE_URL di environment file sudah benar.

## Best Practices

1. **Development**: Gunakan `docker:build:dev` untuk testing lokal
2. **Production**: Selalu gunakan `docker:build:prod:push:amd` untuk deployment
3. **Versioning**: Gunakan semantic versioning dari `package.json`
4. **Security**: Jangan commit `.env.production` ke git
5. **Testing**: Test build lokal sebelum push ke registry

