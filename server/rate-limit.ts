import "server-only";
import { headers } from "next/headers";
import { db } from "@/server/db";

/*
 * Limits wrong dashboard passwords. Two counters are kept for every failed attempt:
 * - by address, so one machine can't keep guessing;
 * - by account (a hash of the email), so an attacker moving between addresses can't either.
 * Sign-in is refused while either counter is over its limit. The account limit is deliberately
 * higher than the address limit: a password we get right clears both, and a stranger can't easily
 * lock a known admin out.
 * - With a database, attempts are counted there, so the limit holds across every Vercel instance.
 * - Without one (local development), it's counted in memory for this server process.
 * Addresses and emails are stored as salted SHA-256 hashes, never in the clear.
 */

const IP_MAX_FAILS = 5;
const ACCOUNT_MAX_FAILS = 15;
const WINDOW_MS = 15 * 60 * 1000;
const memory = new Map<string, number[]>();

const digest = async (value: string) => {
  const data = new TextEncoder().encode(`${process.env.SESSION_SECRET || ""}:${value}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
};

/** Vercel sets x-forwarded-for; the first address is the visitor's. Trim so a junk header can't bloat keys. */
async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (forwarded || h.get("x-real-ip") || "unknown").slice(0, 64);
}

const ipKey = async () => `ip:${await digest(await clientIp())}`;
const accountKey = async (email: string) => {
  const normalized = email.trim().toLowerCase().slice(0, 200);
  // Junk that isn't an email shape shares one bucket, so random addresses can't fill the table.
  const target = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ? normalized : "invalid";
  return `acct:${await digest(target)}`;
};

// Housekeeping at most once an hour per process, so the table stays small without a sweep per hit.
let lastCleanup = 0;
async function maybeCleanup(): Promise<void> {
  if (!db || Date.now() - lastCleanup < 3600e3) return;
  lastCleanup = Date.now();
  try {
    await db.adminLoginAttempt.deleteMany({ where: { at: { lt: new Date(Date.now() - 864e5) } } });
  } catch (err) {
    console.error("[rate-limit] cleanup failed", err); // never fail a request for housekeeping
  }
}

/** Hits for one key in the window, as a count and the oldest timestamp. */
async function hitsInWindow(key: string): Promise<{ count: number; oldest: number | null }> {
  const since = new Date(Date.now() - WINDOW_MS);
  if (db) {
    const [count, oldest] = await Promise.all([
      db.adminLoginAttempt.count({ where: { key, at: { gt: since } } }),
      db.adminLoginAttempt.findFirst({ where: { key, at: { gt: since } }, orderBy: { at: "asc" }, select: { at: true } }),
    ]);
    return { count, oldest: oldest?.at.getTime() ?? null };
  }
  const times = (memory.get(key) ?? []).filter((t) => t > since.getTime());
  return { count: times.length, oldest: times[0] ?? null };
}

/** Minutes until this address/account may try again, or 0 if it may try now. */
export async function loginBlockedFor(email: string): Promise<number> {
  const [ip, account] = await Promise.all([hitsInWindow(await ipKey()), hitsInWindow(await accountKey(email))]);
  let wait = 0;
  if (ip.count >= IP_MAX_FAILS && ip.oldest) wait = Math.max(wait, Math.ceil((ip.oldest + WINDOW_MS - Date.now()) / 60000));
  if (account.count >= ACCOUNT_MAX_FAILS && account.oldest) wait = Math.max(wait, Math.ceil((account.oldest + WINDOW_MS - Date.now()) / 60000));
  return wait > 0 ? Math.max(1, wait) : 0;
}

/** Records one wrong password against both the address and the account. */
export async function recordFailedLogin(email: string): Promise<void> {
  const keys = [await ipKey(), await accountKey(email)];
  if (db) {
    await db.adminLoginAttempt.createMany({ data: keys.map((key) => ({ key })) });
    await maybeCleanup();
    return;
  }
  const now = Date.now();
  for (const key of keys) memory.set(key, [...(memory.get(key) ?? []).filter((t) => t > now - WINDOW_MS), now]);
  if (memory.size > 5000) for (const [key, times] of memory) if (!times.some((t) => t > now - WINDOW_MS)) memory.delete(key);
}

/** Clears both counters after a correct password. */
export async function clearFailedLogins(email: string): Promise<void> {
  const keys = [await ipKey(), await accountKey(email)];
  if (db) {
    await db.adminLoginAttempt.deleteMany({ where: { key: { in: keys } } });
  } else {
    for (const key of keys) memory.delete(key);
  }
}

/*
 * Best-effort throttle for unauthenticated or cheap-to-abuse endpoints. With a database the hits
 * live in admin_login_attempts (`rl:` keys), so the limit is shared by every server instance;
 * without one it is per process (local development).
 */
const buckets = new Map<string, number[]>();
/**
 * `shared` (default) keeps the counter in the database so every server instance agrees — use it
 * for account-level actions like uploads. Pass false for best-effort public endpoints where a
 * database round trip per request would cost more than the limit is worth.
 */
export async function allowLocal(key: string, max: number, windowMs: number, shared = true): Promise<boolean> {
  const scoped = `rl:${key.slice(0, 160)}`;
  if (db && shared) {
    const since = new Date(Date.now() - windowMs);
    const used = await db.adminLoginAttempt.count({ where: { key: scoped, at: { gt: since } } });
    if (used >= max) return false;
    await db.adminLoginAttempt.create({ data: { key: scoped } });
    await maybeCleanup();
    return true;
  }
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  return true;
}
