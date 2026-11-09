import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SESSION_COOKIE, readSessionToken, safeEqual, type Role } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";

/*
 * Who is signed in, re-checked against the database on every page and action:
 * the account must still exist, be active, and match the token's role and session version.
 *
 * First run: while there are no accounts yet, ADMIN_EMAIL + ADMIN_PASSWORD (environment variables)
 * sign in and create the first admin account. After that, accounts are managed in the dashboard.
 * Without a database (local development) the environment admin is the only account.
 */

export type CurrentUser = { id: string; email: string; name: string; role: Role };

const ENV_ADMIN_ID = "env-admin";

function envAdmin(): CurrentUser | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!email || !process.env.ADMIN_PASSWORD) return null;
  return { id: ENV_ADMIN_ID, email, name: "Admin", role: "ADMIN" };
}

/** Checks an email and password. Returns the account to sign in, or null. */
export async function authenticate(emailRaw: string, password: string): Promise<(CurrentUser & { ver: number }) | null> {
  const email = emailRaw.trim().toLowerCase();
  if (db) {
    const user = await db.user.findUnique({ where: { email } });
    if (user) {
      if (!user.active || !(await verifyPassword(password, user.passwordHash))) return null;
      await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
      return { id: user.id, email: user.email, name: user.name, role: user.role, ver: user.sessionVersion };
    }
    // first run only: no accounts at all yet, so the environment admin may create the first one
    const env = envAdmin();
    if (env && email === env.email && safeEqual(password, process.env.ADMIN_PASSWORD!) && (await db.user.count()) === 0) {
      const created = await db.user.create({
        data: { email: env.email, name: "Admin", role: "ADMIN", passwordHash: await hashPassword(password), lastLoginAt: new Date() },
      });
      return { id: created.id, email: created.email, name: created.name, role: "ADMIN", ver: created.sessionVersion };
    }
    // spend similar time as a real check, so unknown emails can't be told apart by timing
    await hashPassword(password);
    return null;
  }
  // no database (local development): the environment admin only
  const env = envAdmin();
  if (env && email === env.email && safeEqual(password, process.env.ADMIN_PASSWORD!)) return { ...env, ver: 1 };
  return null;
}

/** The signed-in user, or null. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const claims = await readSessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!claims) return null;
  if (claims.uid === ENV_ADMIN_ID) {
    // only valid while there's no database, or no accounts in it yet
    const env = envAdmin();
    if (!env) return null;
    if (db && (await db.user.count()) > 0) return null;
    return env;
  }
  if (!db) return null;
  const user = await db.user.findUnique({ where: { id: claims.uid } });
  if (!user || !user.active || user.role !== claims.role || user.sessionVersion !== claims.ver) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

/** For pages and actions any staff member may use. Sends others to sign in. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

/** For admin-only pages and actions. Writers get a clear refusal, not a silent redirect. */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("Only admins can do this.");
  return user;
}
