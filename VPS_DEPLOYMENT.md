# VPS Deployment Guide

## Quick Deployment Steps

### 1. Environment Setup
```bash
# On VPS, clone or pull the repository
git clone <repository-url>
cd na-profile

# Copy and configure environment
cp .env.example .env
nano .env  # Edit with production values
```

### 2. Required Environment Variables

**Database:**
```
DATABASE_URL=postgresql://user:password@host:port/database
```

**Admin:**
```
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_strong_password
```

**R2/S3 Storage:**
```
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_key
R2_SECRET_ACCESS_KEY=your_secret
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-cdn-domain.com
NEXT_PUBLIC_R2_PUBLIC_BASE=https://your-cdn-domain.com
```

### 3. Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Deploy migrations
npm run migrate:deploy

# Verify migrations
npm run migrate:status
```

### 4. Build Application

```bash
# Build Next.js
npm run build

# Verify build
ls -la .next
```

### 5. Start Application

**Option A: Direct Node.js**
```bash
npm start
# Or with PM2:
pm2 start npm --name "nisa-profile" -- start
```

**Option B: Docker**
```bash
docker-compose up -d
```

## Docker Deployment

### Build and Deploy
```bash
# Build image
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f nisa-profile

# Run migrations (if not auto-run)
docker-compose exec nisa-profile npx prisma migrate deploy
```

## Verification Checklist

After deployment, verify:
- [ ] Application accessible on configured port
- [ ] Admin login works (`/admin/login`)
- [ ] Database connection successful
- [ ] All migrations applied
- [ ] Image uploads work
- [ ] Portfolio items display
- [ ] Services display
- [ ] Social links display
- [ ] Partners display

## Troubleshooting

### Build Issues
```bash
# Clear cache
rm -rf .next node_modules/.cache

# Reinstall
rm -rf node_modules && npm install

# Regenerate Prisma
npm run db:generate
```

### Database Issues
```bash
# Check connection
psql $DATABASE_URL

# Check migrations
npm run migrate:status

# Reset if needed (WARNING: deletes data)
npx prisma migrate reset
```

### Docker Issues
```bash
# Rebuild
docker-compose build --no-cache

# Restart
docker-compose restart

# View logs
docker-compose logs -f
```

### File Upload Issues (413 Error)
If you get `413 Request Entity Too Large` errors:
- See `NGINX_SETUP.md` for detailed instructions
- Quick fix: Add `client_max_body_size 50M;` to your nginx server block
- Reload nginx: `sudo nginx -t && sudo systemctl reload nginx`

## Production Notes

1. **Security:**
   - Change default `ADMIN_PASSWORD`
   - Use strong database passwords
   - Keep `.env` file secure
   - Don't commit `.env` to git

2. **Performance:**
   - Use reverse proxy (nginx) for HTTPS
   - Enable caching
   - Monitor resource usage
   - **Important:** Configure nginx for file uploads (see `NGINX_SETUP.md`)

3. **Backup:**
   - Regular database backups
   - Backup R2/S3 bucket
   - Keep migration files in version control

## Files Created for Deployment

- `.env.example` - Environment variables template
- `DEPLOYMENT_CHECKLIST.md` - Detailed checklist
- `BUILD_VPS.md` - Build instructions
- `VPS_DEPLOYMENT.md` - This file
- `nginx.conf` - Nginx configuration template
- `NGINX_SETUP.md` - Nginx setup instructions (fixes 413 upload errors)

## Support

For issues, check:
- `DEPLOYMENT_CHECKLIST.md` for detailed steps
- `BUILD_VPS.md` for build-specific issues
- Application logs for runtime errors

