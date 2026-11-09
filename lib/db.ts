import "server-only";
import { PrismaClient } from "@prisma/client";

/*
 * The Prisma client, or null when DATABASE_URL isn't set (local development without a database;
 * the dashboard then saves to .data/ files instead). Tables are defined in prisma/schema.prisma
 * and created by migrations, applied on every Vercel deploy (see the "vercel-build" script).
 * One client is reused across hot reloads in development so connections don't pile up.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db: PrismaClient | null = process.env.DATABASE_URL ? (globalForPrisma.prisma ??= new PrismaClient()) : null;
