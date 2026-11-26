import "server-only";
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

/*
 * Password hashing with scrypt (memory-hard, built into Node). Stored as
 * "scrypt$N$r$p$salt$hash" so the cost can be raised later without breaking old hashes.
 */
const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, keylen: number, opts: { N: number; r: number; p: number; maxmem: number }) => Promise<Buffer>;
const N = 2 ** 15, R = 8, P = 1, KEYLEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEYLEN, { N, r: R, p: P, maxmem: 128 * N * R * 2 });
  return ["scrypt", N, R, P, salt.toString("base64"), hash.toString("base64")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [alg, n, r, p, saltB64, hashB64] = String(stored).split("$");
  if (alg !== "scrypt" || !n || !r || !p || !saltB64 || !hashB64) return false;
  // The stored cost parameters are read from the database, so keep them within sane bounds:
  // a corrupt or tampered hash must not make scrypt allocate gigabytes or throw a 500.
  const cost = (v: string, min: number, max: number) => {
    if (!/^\d{1,7}$/.test(v)) return null;
    const num = Number(v);
    return Number.isInteger(num) && num >= min && num <= max ? num : null;
  };
  const N = cost(n, 2 ** 14, 2 ** 20);
  const R = cost(r, 1, 32);
  const P = cost(p, 1, 16);
  if (N === null || R === null || P === null || (N & (N - 1)) !== 0) return false;
  const expected = Buffer.from(hashB64, "base64");
  if (expected.length < 16 || expected.length > 128) return false;
  try {
    const actual = await scrypt(password, Buffer.from(saltB64, "base64"), expected.length, { N, r: R, p: P, maxmem: 128 * N * R * 2 });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/** Rules for new passwords. Returns a problem to show, or null if it's fine. */
export function passwordProblem(pw: string): string | null {
  if (pw.length < 12) return "Use at least 12 characters.";
  if (pw.length > 200) return "Use at most 200 characters.";
  if (/^(.)\1+$/.test(pw)) return "Choose something less predictable.";
  return null;
}

/** A readable random temporary password for new accounts and resets. */
export function temporaryPassword(): string {
  const words = randomBytes(12).toString("base64url");
  return `${words.slice(0, 4)}-${words.slice(4, 8)}-${words.slice(8, 12)}-${words.slice(12, 16)}`;
}
