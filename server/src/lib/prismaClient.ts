import { PrismaClient } from '@prisma/client';

declare const globalThis: {
  prismaGlobal: PrismaClient;
} & typeof global;

const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

export default prisma;
