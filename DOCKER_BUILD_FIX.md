# Docker Build Fixes

## Issues Fixed

### 1. Version Mismatch ✅
**Problem:** `docker-compose.yml` menggunakan versi `2.1.0` tapi `package.json` scripts menggunakan `latest`

**Solution:** Updated `package.json` scripts untuk menggunakan versi `2.1.0`:
```json
"docker:build:push:amd": "./scripts/docker-build.sh 2.1.0 --push-amd"
```

### 2. Image Size Optimization ✅
**Problem:** Error "413 Payload Too Large" - image terlalu besar karena copy semua node_modules termasuk devDependencies

**Solution:** Optimized Dockerfile untuk:
- Install hanya production dependencies di runner stage
- Exclude devDependencies (TypeScript, ESLint, dll) yang tidak diperlukan di production
- Mengurangi ukuran image secara signifikan

## Changes Made

### package.json
- Updated semua docker build scripts untuk menggunakan versi `2.1.0`

### Dockerfile
- Runner stage sekarang install hanya production dependencies
- Menggunakan `--production` flag untuk exclude devDependencies
- Tetap copy Prisma files yang diperlukan untuk runtime

## Build Command

Sekarang gunakan:
```bash
yarn docker:build:push:amd
```

Ini akan build dengan versi `2.1.0` yang sesuai dengan `docker-compose.yml`

## Expected Results

- ✅ Versi konsisten antara build script dan docker-compose
- ✅ Image size lebih kecil (hanya production deps)
- ✅ Build dan push seharusnya berhasil tanpa "413 Payload Too Large"

## Jika Masih Error 413

Jika masih mendapat error "413 Payload Too Large", coba:

1. **Check registry limits** - Beberapa registry punya size limit
2. **Use .dockerignore** - Pastikan file tidak perlu tidak di-copy
3. **Multi-stage optimization** - Sudah diimplementasi
4. **Consider using Docker layer caching** - Build di VPS langsung

## Alternative: Build on VPS

Jika registry masih menolak karena size:
```bash
# Build langsung di VPS
docker-compose build
docker-compose up -d
```

