import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient | undefined 
}

// Log database URL (masked) for debugging
const dbUrl = process.env.DATABASE_URL || '';
const maskedUrl = dbUrl ? `${dbUrl.split('@')[0]}@${dbUrl.split('@')[1]?.substring(0, 20)}...` : 'NOT SET';
console.log('[PRISMA] Initializing Prisma Client with database:', maskedUrl);

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Connection pool configuration to prevent too many connections
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Log Prisma Client initialization
console.log('[PRISMA] Prisma Client initialized:', {
  hasPrisma: !!prisma,
  hasPortfolio: !!prisma?.portfolio,
  isGlobal: !!globalForPrisma.prisma,
});

