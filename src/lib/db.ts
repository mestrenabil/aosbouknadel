import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a new Prisma client
const createPrismaClient = () => new PrismaClient({
  log: ['query'],
})

// Always create a new client to ensure we have the latest models
// This is important for development when schema changes
const dbInstance = createPrismaClient();

// Cache for production
if (process.env.NODE_ENV === 'production') {
  globalForPrisma.prisma = dbInstance;
}

export const db = dbInstance;