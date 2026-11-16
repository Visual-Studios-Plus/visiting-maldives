import "server-only";
import { headers } from "next/headers";
import { db } from "@/lib/db";

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

async function timesFor(key: string, since: number): Promise<number[]> {
  if (db) {
    const rows = await db.adminLoginAttempt.findMany({ where: { key, at: { gt: new Date(since) } }, orderBy: { at: "asc" }, select: { at: true } });
    return rows.map((r) => r.at.getTime());
  }
  return (memory.get(key) ?? []).filter((t) => t > since);
}

/** Minutes until this address/account may try again, or 0 if it may try now. */
export async function loginBlockedFor(email: string): Promise<number> {
  const since = Date.now() - WINDOW_MS;
  const [ipTimes, accountTimes] = await Promise.all([timesFor(await ipKey(), since), timesFor(await accountKey(email), since)]);
  let wait = 0;
  if (ipTimes.length >= IP_MAX_FAILS) wait = Math.max(wait, Math.ceil((ipTimes[0] + WINDOW_MS - Date.now()) / 60000));
  if (accountTimes.length >= ACCOUNT_MAX_FAILS) wait = Math.max(wait, Math.ceil((accountTimes[0] + WINDOW_MS - Date.now()) / 60000));
  return wait > 0 ? Math.max(1, wait) : 0;
}

/** Records one wrong password against both the address and the account. */
export async function recordFailedLogin(email: string): Promise<void> {
  const keys = [await ipKey(), await accountKey(email)];
  if (db) {
    await db.adminLoginAttempt.createMany({ data: keys.map((key) => ({ key })) });
    await db.adminLoginAttempt.deleteMany({ where: { at: { lt: new Date(Date.now() - 864e5) } } }); // keep the table small
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
 * Best-effort request throttle for unauthenticated endpoints (per server instance). Not a
 * substitute for a shared store, but it stops one client flooding a single function.
 */
const buckets = new Map<string, number[]>();
export function allowLocal(key: string, max: number, windowMs: number): boolean {
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
