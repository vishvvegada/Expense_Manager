import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL!
    const pool = new Pool({
        connectionString,
        max: 5, // Limit connections per Prisma instance
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000, // Timeout to prevent dangling promises
    })
    const adapter = new PrismaPg(pool as any)
    return new PrismaClient({
        adapter,
        log: ['query', 'info', 'warn', 'error'],
    })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
