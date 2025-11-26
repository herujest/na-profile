# Quick Start - Database Setup

## Setup Cepat

1. **Buat file environment**:
   ```bash
   ./scripts/setup-env.sh
   ```

2. **Edit file environment** dengan nilai yang sesuai:
   - `.env.development` - untuk development
   - `.env.production` - untuk production

3. **Start database development**:
   ```bash
   yarn db:dev:up
   ```

4. **Run migrations**:
   ```bash
   yarn db:dev:migrate
   ```

5. **Start aplikasi**:
   ```bash
   yarn dev
   ```

## Command Reference

### Development
- `yarn db:dev:up` - Start database
- `yarn db:dev:down` - Stop database
- `yarn db:dev:migrate` - Run migrations
- `yarn db:dev:studio` - Open Prisma Studio
- `yarn db:dev:logs` - View logs
- `yarn build:dev` - Build untuk development
- `yarn start:dev` - Start server development (port 3001)

### Production
- `yarn db:prod:up` - Start database
- `yarn db:prod:down` - Stop database
- `yarn db:prod:migrate` - Run migrations
- `yarn db:prod:studio` - Open Prisma Studio (hati-hati!)
- `yarn db:prod:logs` - View logs
- `yarn build:prod` - Build untuk production
- `yarn start:prod` - Start server production (port 5175)

### Docker Build
- `yarn docker:build:dev` - Build Docker image untuk development
- `yarn docker:build:dev:push` - Build dan push Docker image dev
- `yarn docker:build:prod` - Build Docker image untuk production
- `yarn docker:build:prod:push` - Build dan push Docker image prod

Lihat [DATABASE_SETUP.md](./DATABASE_SETUP.md) untuk dokumentasi lengkap.

