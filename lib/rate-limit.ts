import "server-only";
import { headers } from "next/headers";
import { db } from "@/lib/db";

/*
 * Limits wrong dashboard passwords: after MAX_FAILS wrong tries from one address within WINDOW,
 * sign-in from that address is refused until the window passes.
 * - With a database, attempts are counted there, so the limit holds across every Vercel instance.
 * - Without one (local development), it's counted in memory for this server process.
 * Addresses are stored as a salted SHA-256 hash, never in the clear.
 */

const MAX_FAILS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const memory = new Map<string, number[]>();

async function clientKey(): Promise<string> {
  const h = await headers();
  // Vercel sets x-forwarded-for; the first address is the visitor's
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const data = new TextEncoder().encode(`${process.env.SESSION_SECRET || ""}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

/** Minutes until this address may try again, or 0 if it may try now. */
export async function loginBlockedFor(): Promise<number> {
  const key = await clientKey();
  const since = Date.now() - WINDOW_MS;
  let times: number[];
  if (db) {
    const rows = await db.adminLoginAttempt.findMany({ where: { key, at: { gt: new Date(since) } }, orderBy: { at: "asc" }, select: { at: true } });
    times = rows.map((r) => r.at.getTime());
  } else {
    times = (memory.get(key) ?? []).filter((t) => t > since);
  }
  if (times.length < MAX_FAILS) return 0;
  return Math.max(1, Math.ceil((times[0] + WINDOW_MS - Date.now()) / 60000));
}

export async function recordFailedLogin(): Promise<void> {
  const key = await clientKey();
  if (db) {
    await db.adminLoginAttempt.create({ data: { key } });
    await db.adminLoginAttempt.deleteMany({ where: { at: { lt: new Date(Date.now() - 864e5) } } }); // keep the table small
  } else {
    memory.set(key, [...(memory.get(key) ?? []).filter((t) => t > Date.now() - WINDOW_MS), Date.now()]);
  }
}

export async function clearFailedLogins(): Promise<void> {
  const key = await clientKey();
  if (db) {
    await db.adminLoginAttempt.deleteMany({ where: { key } });
  } else {
    memory.delete(key);
  }
}
