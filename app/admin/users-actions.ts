"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { SESSION_COOKIE, SESSION_DAYS, createSessionToken } from "@/lib/auth";
import { requireAdmin, requireUser } from "@/lib/session";
import { hashPassword, passwordProblem, temporaryPassword, verifyPassword } from "@/lib/password";

/*
 * Staff accounts. Everything except changing your own password is admin-only, checked here
 * (not just hidden in the UI). Safeguards: there's always at least one active admin, and you can't
 * demote, deactivate or delete yourself. Role changes, deactivation and password resets bump the
 * account's session version, which signs that person out everywhere at once.
 */

export type UserFormState = { ok?: boolean; message?: string; error?: string; tempPassword?: string; email?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const needDb = () => {
  if (!db) throw new Error("Accounts need a database. Connect Neon in Vercel (Storage) and redeploy.");
  return db;
};

async function activeAdminsExcept(id: string) {
  return needDb().user.count({ where: { role: "ADMIN", active: true, NOT: { id } } });
}

export async function createUser(_prev: UserFormState, formData: FormData): Promise<UserFormState> {
  await requireAdmin();
  const d = needDb();
  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  const role = formData.get("role") === "ADMIN" ? "ADMIN" : "WRITER";
  if (!EMAIL.test(email)) return { error: "Enter a valid email address." };
  if (!name) return { error: "Enter a name." };
  if (await d.user.findUnique({ where: { email } })) return { error: "There's already an account with that email." };

  const tempPassword = temporaryPassword();
  await d.user.create({ data: { email, name, role, passwordHash: await hashPassword(tempPassword) } });
  revalidatePath("/admin/users");
  return { ok: true, tempPassword, email, message: `${name} can now sign in as a ${role === "ADMIN" ? "admin" : "writer"}.` };
}

export async function updateUser(id: string, _prev: UserFormState, formData: FormData): Promise<UserFormState> {
  const me = await requireAdmin();
  const d = needDb();
  const user = await d.user.findUnique({ where: { id } });
  if (!user) return { error: "That account no longer exists." };

  const name = String(formData.get("name") ?? user.name).trim().slice(0, 100) || user.name;
  const role = formData.get("role") === "ADMIN" ? "ADMIN" : "WRITER";
  const active = formData.get("active") === "on" || formData.get("active") === "true";

  if (id === me.id && (role !== "ADMIN" || !active)) return { error: "You can't remove your own admin access or deactivate yourself. Ask another admin." };
  if (user.role === "ADMIN" && (role !== "ADMIN" || !active) && (await activeAdminsExcept(id)) === 0) return { error: "There must always be at least one active admin." };

  const accessChanged = role !== user.role || active !== user.active;
  await d.user.update({ where: { id }, data: { name, role, active, ...(accessChanged ? { sessionVersion: { increment: 1 } } : {}) } });
  revalidatePath("/admin/users");
  return { ok: true, message: accessChanged ? "Saved. They've been signed out so the change applies straight away." : "Saved." };
}

export async function resetUserPassword(id: string, _prev: UserFormState): Promise<UserFormState> {
  const me = await requireAdmin();
  const d = needDb();
  if (id === me.id) return { error: "Change your own password under My account." };
  const user = await d.user.findUnique({ where: { id } });
  if (!user) return { error: "That account no longer exists." };
  const tempPassword = temporaryPassword();
  await d.user.update({ where: { id }, data: { passwordHash: await hashPassword(tempPassword), sessionVersion: { increment: 1 } } });
  return { ok: true, tempPassword, email: user.email, message: `New temporary password for ${user.name}. They've been signed out.` };
}

export async function deleteUser(id: string) {
  const me = await requireAdmin();
  const d = needDb();
  if (id === me.id) throw new Error("You can't delete your own account.");
  const user = await d.user.findUnique({ where: { id } });
  if (!user) return;
  if (user.role === "ADMIN" && user.active && (await activeAdminsExcept(id)) === 0) throw new Error("There must always be at least one active admin.");
  await d.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

/** Any signed-in user: change your own password (needs the current one). Signs out other devices. */
export async function changeOwnPassword(_prev: UserFormState, formData: FormData): Promise<UserFormState> {
  const me = await requireUser();
  const d = needDb();
  const user = await d.user.findUnique({ where: { id: me.id } });
  if (!user) return { error: "Your account isn't in the database yet. Sign out and in again." };

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (!(await verifyPassword(current, user.passwordHash))) return { error: "Your current password isn't right." };
  const problem = passwordProblem(next);
  if (problem) return { error: problem };
  if (next !== confirm) return { error: "The new passwords don't match." };
  if (next === current) return { error: "Choose a password you haven't used here." };

  const updated = await d.user.update({ where: { id: me.id }, data: { passwordHash: await hashPassword(next), sessionVersion: { increment: 1 } } });
  // keep this device signed in with the new session version; others are signed out
  (await cookies()).set(SESSION_COOKIE, await createSessionToken({ uid: updated.id, role: updated.role, ver: updated.sessionVersion }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return { ok: true, message: "Password changed. Other devices have been signed out." };
}
