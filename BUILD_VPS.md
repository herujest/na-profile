# Building for VPS Deployment

## Quick Start

### 1. Prepare Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your production values
nano .env
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Setup Database
```bash
# Generate Prisma Client
npm run db:generate

# Deploy migrations
npm run migrate:deploy

# Verify migrations
npm run migrate:status
```

### 4. Build Application
```bash
npm run build
```

### 5. Start Application
```bash
npm start
```

## Docker Deployment

### Build Docker Image
```bash
docker-compose build
```

### Deploy with Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f nisa-profile

# Run migrations (if not in Dockerfile CMD)
docker-compose exec nisa-profile npx prisma migrate deploy
```

## Environment Variables Required

See `.env.example` for all required variables.

**Critical Variables:**
- `DATABASE_URL` - Must be set correctly
- `ADMIN_PASSWORD` - Change from default!
- `R2_*` - All R2/S3 configuration

## Build Verification

After building, verify:
1. ✅ Build completes without errors
2. ✅ `.next` folder exists
3. ✅ Prisma client generated
4. ✅ No TypeScript errors (check build output)
5. ✅ Application starts on configured port

## Common Issues

### Build Fails
- Clear cache: `rm -rf .next node_modules/.cache`
- Reinstall: `rm -rf node_modules && npm install`
- Regenerate Prisma: `npm run db:generate`

### Database Connection
- Verify `DATABASE_URL` format
- Check PostgreSQL is running
- Test connection: `psql $DATABASE_URL`

### Missing Files
- Ensure `lib/data/portfolio.json` exists
- Ensure `app/content/blog/` exists
- Check Dockerfile copies all necessary files

## Production Checklist

Before deploying to production:
- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] Build succeeds locally
- [ ] Admin password changed
- [ ] R2 credentials configured
- [ ] Security settings reviewed
- [ ] Backup strategy in place

