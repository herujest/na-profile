# VPS Performance Optimization Guide

## Masalah yang Teridentifikasi

Dari output `htop` yang ditampilkan:
- **Load Average**: 44.38, 33.55, 16.17 (sangat tinggi!)
- **CPU Usage**: 0.4-3.9% (rendah)
- **Memory**: 3.01G/5.79G (normal)

**Diagnosis**: Load average tinggi dengan CPU rendah menunjukkan **I/O wait** atau terlalu banyak proses yang menunggu resource (kemungkinan database connections).

## Optimasi yang Telah Diterapkan

### 1. Connection Pooling untuk Prisma
- Menambahkan parameter `connection_limit=10&pool_timeout=20` pada DATABASE_URL
- Membatasi jumlah koneksi database per instance aplikasi

### 2. Resource Limits untuk Docker Containers
- **PostgreSQL**: Max 2 CPU, 1GB RAM
- **Next.js App**: Max 2 CPU, 1GB RAM
- Mencegah satu container menghabiskan semua resource VPS

### 3. PostgreSQL Configuration Optimization
- `max_connections=100` - Batasi total koneksi database
- `shared_buffers=256MB` - Optimasi memory untuk cache
- `effective_cache_size=1GB` - Estimasi cache yang tersedia
- `work_mem=4MB` - Memory per operasi query
- Optimasi lainnya untuk performa yang lebih baik

### 4. Node.js Memory Limit
- `NODE_OPTIONS=--max-old-space-size=512` - Batasi memory Node.js

## Langkah Deployment di VPS

### 1. Backup Data Sebelum Update
```bash
# Backup database
docker exec nisa-profile-db pg_dump -U postgres nisa_profile > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup docker-compose.yml
cp docker-compose.yml docker-compose.yml.backup
```

### 2. Update File di VPS
```bash
# Pull perubahan terbaru atau copy file docker-compose.yml yang baru
# Pastikan file docker-compose.yml sudah diupdate dengan optimasi

# Stop containers
docker-compose down

# Rebuild dan start dengan konfigurasi baru
docker-compose up -d --build
```

### 3. Monitor Setelah Update
```bash
# Monitor load average
watch -n 1 'uptime'

# Monitor container resources
docker stats

# Monitor database connections
docker exec nisa-profile-db psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"

# Check logs
docker-compose logs -f --tail=50
```

### 4. Verifikasi Optimasi
```bash
# Load average seharusnya turun setelah beberapa menit
htop

# Check active database connections (seharusnya < 100)
docker exec nisa-profile-db psql -U postgres -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';"
```

## Troubleshooting

### Jika Load Average Masih Tinggi

1. **Check I/O Wait**:
   ```bash
   iostat -x 1 5
   ```
   Jika `%util` tinggi (>80%), disk I/O adalah bottleneck.

2. **Check Database Connections**:
   ```bash
   docker exec nisa-profile-db psql -U postgres -c "SELECT count(*), state FROM pg_stat_activity GROUP BY state;"
   ```
   Jika terlalu banyak koneksi idle, kurangi `connection_limit` di DATABASE_URL.

3. **Check Container Resources**:
   ```bash
   docker stats --no-stream
   ```
   Pastikan tidak ada container yang menggunakan >80% CPU/Memory.

4. **Check Slow Queries**:
   ```bash
   docker exec nisa-profile-db psql -U postgres -c "SELECT pid, now() - pg_stat_activity.query_start AS duration, query FROM pg_stat_activity WHERE state = 'active' AND now() - pg_stat_activity.query_start > interval '5 seconds';"
   ```

### Jika Masih Bermasalah

1. **Kurangi Connection Limit**:
   Ubah `connection_limit=10` menjadi `connection_limit=5` di docker-compose.yml

2. **Tambah Resource Limits**:
   Jika VPS memiliki lebih banyak resource, bisa naikkan limits di docker-compose.yml

3. **Consider Connection Pooler**:
   Untuk production yang lebih besar, pertimbangkan menggunakan PgBouncer sebagai connection pooler

## Expected Results

Setelah optimasi:
- **Load Average**: Seharusnya turun ke < 4 (untuk 4-core CPU)
- **Database Connections**: < 20 active connections
- **Response Time**: Lebih cepat dan konsisten
- **Memory Usage**: Lebih stabil

## Catatan Penting

- **Restart diperlukan** setelah update docker-compose.yml
- **Monitor selama 10-15 menit** setelah restart untuk memastikan stabil
- **Backup database** sebelum melakukan perubahan
- Load average tinggi bisa juga disebabkan oleh proses lain di VPS (bukan hanya aplikasi ini)

