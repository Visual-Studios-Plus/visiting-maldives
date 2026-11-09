/*
 * Dashboard session tokens (signed, expiring cookie). Shared by proxy.ts and server code, so it uses
 * Web Crypto only. The token carries user id, role and session version; it is signed with
 * HMAC-SHA256 using SESSION_SECRET. Server actions additionally re-check the user in the database
 * (still active, same role and session version), so turning an account off or changing its role
 * takes effect at once. proxy.ts only checks the signature, as a first line.
 */

export const SESSION_COOKIE = "vm_admin";
export const SESSION_DAYS = 7;

export type Role = "ADMIN" | "WRITER";
export type SessionClaims = { uid: string; role: Role; ver: number; exp: number };

const enc = new TextEncoder();
const secret = () => process.env.SESSION_SECRET || "";

/** Sign-in needs a session secret to sign cookies with. */
export const authConfigured = () => secret().length >= 16;

async function hmac(message: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Compares two strings in time that doesn't depend on where they differ. */
export function safeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

const b64 = (s: string) => btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64 = (s: string) => atob(s.replace(/-/g, "+").replace(/_/g, "/"));

export async function createSessionToken(claims: Omit<SessionClaims, "exp">): Promise<string> {
  const body = b64(JSON.stringify({ ...claims, exp: Date.now() + SESSION_DAYS * 864e5 }));
  return `${body}.${await hmac(body)}`;
}

/** The token's claims if the signature is valid and it hasn't expired, else null. */
export async function readSessionToken(token: string | undefined | null): Promise<SessionClaims | null> {
  if (!token || !authConfigured()) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig || !safeEqual(sig, await hmac(body))) return null;
  try {
    const c = JSON.parse(unb64(body)) as SessionClaims;
    if (typeof c.uid !== "string" || (c.role !== "ADMIN" && c.role !== "WRITER") || typeof c.exp !== "number" || c.exp < Date.now()) return null;
    return c;
  } catch {
    return null;
  }
}

/** Setup problems worth fixing, shown to admins on the dashboard (never the values themselves). */
export function securityWarnings(): string[] {
  const out: string[] = [];
  const s = process.env.SESSION_SECRET ?? "";
  if (s && s.length < 32) out.push("SESSION_SECRET is short. Use a random value of at least 32 characters (e.g. from `openssl rand -base64 32`).");
  if (process.env.ADMIN_PASSWORD) out.push("ADMIN_PASSWORD is still set. It's only needed for the first sign-in; once your admin account exists, remove it from Vercel's environment variables.");
  return out;
}
