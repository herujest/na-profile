# VPS Deployment Checklist

## Pre-Deployment

### 1. Environment Variables

- [ ] Copy `.env.example` to `.env` on VPS
- [ ] Set all required environment variables:
  - `DATABASE_URL` - PostgreSQL connection string
  - `ADMIN_USERNAME` - Admin login username
  - `ADMIN_PASSWORD` - Admin login password (use strong password)
  - `R2_ENDPOINT` - Cloudflare R2 endpoint
  - `R2_ACCESS_KEY_ID` - R2 access key
  - `R2_SECRET_ACCESS_KEY` - R2 secret key
  - `R2_BUCKET_NAME` - R2 bucket name
  - `R2_PUBLIC_URL` - Public CDN URL for images
  - `NEXT_PUBLIC_R2_PUBLIC_BASE` - Public CDN base URL

### 2. Database Setup

- [ ] Ensure PostgreSQL is running
- [ ] Verify `DATABASE_URL` is correct
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Verify all tables exist:
  - `Partner`
  - `Portfolio`
  - `SiteSettings`
  - `Service`
  - `Social`

### 3. Build Preparation

- [ ] Ensure Node.js 18+ is installed
- [ ] Install dependencies: `npm install` or `yarn install`
- [ ] Generate Prisma Client: `npx prisma generate`
- [ ] Test build locally: `npm run build`

### 4. Docker Setup (if using Docker)

- [ ] Update `docker-compose.yml` with production values
- [ ] Update image tag in `docker-compose.yml`
- [ ] Ensure all environment variables are set in docker-compose
- [ ] Build Docker image: `docker-compose build`
- [ ] Test Docker build locally

## Deployment Steps

### Option 1: Docker Deployment

1. **Build and Push Image**

   ```bash
   docker-compose build
   docker-compose push  # If using registry
   ```

2. **Deploy on VPS**

   ```bash
   # Pull latest code
   git pull origin main

   # Copy .env file
   cp .env.example .env
   # Edit .env with production values

   # Start services
   docker-compose up -d

   # Check logs
   docker-compose logs -f nisa-profile
   ```

3. **Run Migrations**
   ```bash
   docker-compose exec nisa-profile npx prisma migrate deploy
   ```

### Option 2: Direct Node.js Deployment

1. **On VPS**

   ```bash
   # Pull latest code
   git pull origin main

   # Install dependencies
   npm install --production

   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma migrate deploy

   # Build application
   npm run build

   # Start application (using PM2 or systemd)
   npm start
   # Or: pm2 start npm --name "nisa-profile" -- start
   ```

## Post-Deployment Verification

- [ ] Application is accessible on configured port
- [ ] Database connection is working
- [ ] Admin login works
- [ ] Image uploads work (R2/S3)
- [ ] All API endpoints respond correctly
- [ ] Portfolio items display correctly
- [ ] Services display correctly
- [ ] Social links display correctly
- [ ] Partners display correctly

## Environment Variables Reference

### Required for Production:

- `DATABASE_URL` - PostgreSQL connection string
- `ADMIN_USERNAME` - Admin username
- `ADMIN_PASSWORD` - Admin password
- `R2_BUCKET_NAME` - R2 bucket name
- `R2_ACCESS_KEY_ID` - R2 access key
- `R2_SECRET_ACCESS_KEY` - R2 secret key
- `R2_ENDPOINT` - R2 endpoint URL
- `R2_PUBLIC_URL` - Public CDN URL
- `NEXT_PUBLIC_R2_PUBLIC_BASE` - Public CDN base URL

### Optional:

- `POSTGRES_USER` - PostgreSQL username (if using docker-compose)
- `POSTGRES_PASSWORD` - PostgreSQL password (if using docker-compose)
- `POSTGRES_DB` - PostgreSQL database name (if using docker-compose)
- `POSTGRES_PORT` - PostgreSQL port (if using docker-compose)
- `APP_PORT` - Application port (default: 5175)
- `NODE_ENV` - Set to `production`

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` format: `postgresql://user:password@host:port/database`
- Check PostgreSQL is running and accessible
- Verify network connectivity between app and database

### Migration Issues

- Ensure database exists
- Check user has proper permissions
- Run `npx prisma migrate status` to check migration state
- If needed, reset: `npx prisma migrate reset` (WARNING: deletes data)

### Build Issues

- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Regenerate Prisma: `npx prisma generate`
- Check Node.js version: `node --version` (should be 18+)

### Image Upload Issues

- Verify R2 credentials are correct
- Check R2 bucket exists and is accessible
- Verify `R2_PUBLIC_URL` is correct
- Check CORS settings on R2 bucket

## Security Checklist

- [ ] `ADMIN_PASSWORD` is strong and unique
- [ ] Database password is strong
- [ ] `.env` file is not committed to git
- [ ] R2 credentials are secure
- [ ] HTTPS is configured (if using reverse proxy)
- [ ] Firewall rules are configured
- [ ] Database is not exposed to public internet
