import "server-only";
import { PrismaClient } from "@prisma/client";

/*
 * The Prisma client, or null when DATABASE_URL isn't set (local development without a database;
 * the dashboard then saves to .data/ files instead). Tables are defined in prisma/schema.prisma
 * and created by migrations, applied on every Vercel deploy (see the "vercel-build" script).
 * One client is reused across hot reloads in development so connections don't pile up.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient; prismaUrl?: string };

/**
 * Neon scales an idle database to zero, and the first query then waits for it to wake. Prisma's
 * default 5 s connect timeout can run out first ("Can't reach database server"), so allow 15 s
 * unless the URL already sets its own.
 */
function withConnectTimeout(url: string): string {
  try {
    const u = new URL(url);
    if (!u.searchParams.has("connect_timeout")) u.searchParams.set("connect_timeout", "15");
    // many pages render at once (each reads several collections): wait longer for a free connection
    if (!u.searchParams.has("pool_timeout")) u.searchParams.set("pool_timeout", "30");
    return u.toString();
  } catch {
    return url; // not a URL we can parse: leave it to Prisma
  }
}

/** The shared client, made again when its connection settings change (a hot reload kept the old one). */
function client(url: string): PrismaClient {
  if (globalForPrisma.prisma && globalForPrisma.prismaUrl === url) return globalForPrisma.prisma;
  void globalForPrisma.prisma?.$disconnect();
  globalForPrisma.prismaUrl = url;
  return (globalForPrisma.prisma = new PrismaClient({ datasourceUrl: url }));
}

export const db: PrismaClient | null = process.env.DATABASE_URL ? client(withConnectTimeout(process.env.DATABASE_URL)) : null;
