"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { SESSION_COOKIE, SESSION_DAYS, authConfigured, createSessionToken } from "@/lib/auth";
import { authenticate, requireAdmin, requireUser } from "@/lib/session";
import { getCollectionDef, type CollectionKey } from "@/lib/content/schema";
import { contentTag, getCollection, resetCollection, saveCollection, type Collections } from "@/lib/content/store";
import { validateItem, type Errors } from "@/lib/content/validate";
import { canDelete } from "@/lib/permissions";
import { clearFailedLogins, loginBlockedFor, recordFailedLogin } from "@/lib/rate-limit";

/*
 * Every action here is reachable by anyone who can send a POST, so each one checks the account
 * itself (requireUser / requireAdmin re-check it in the database) and validates its input.
 *   Writers: create and edit entries, and delete guides they created themselves.
 *   Admins:  delete anything, reorder, restore original content (and manage accounts: users-actions.ts).
 * Each entry created in the dashboard records its creator in `_author` (a user id), kept on edits.
 */

function collectionOrThrow(key: string) {
  const def = getCollectionDef(key);
  if (!def) throw new Error("Unknown collection.");
  return def;
}

/** The parts of a stored entry that the dashboard form has no field for (and `_author`, set separately). */
function keepUnmanaged(def: NonNullable<ReturnType<typeof getCollectionDef>>, stored: Record<string, unknown>) {
  const managed = new Set([...def.fields.map((f) => f.name), "_author"]);
  return Object.fromEntries(Object.entries(stored ?? {}).filter(([k]) => !managed.has(k)));
}

/** Only same-site dashboard paths, so the login can't be used to send people elsewhere. */
const safeNext = (next: unknown) => (typeof next === "string" && /^\/admin(\/[\w\-/?=&%]*)?$/.test(next) && !next.includes("..") ? next : "/admin");

export type LoginState = { error?: string; email?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").slice(0, 200);
  if (!authConfigured()) return { email, error: "Sign-in isn't set up yet: add SESSION_SECRET (a random value of 32+ characters) to the environment variables and redeploy." };

  const wait = await loginBlockedFor();
  if (wait) return { email, error: `Too many failed attempts. Try again in ${wait} minute${wait === 1 ? "" : "s"}.` };

  const password = String(formData.get("password") ?? "").slice(0, 200);
  const user = email && password ? await authenticate(email, password) : null;
  if (!user) {
    await recordFailedLogin();
    await new Promise((r) => setTimeout(r, 500)); // slows down guessing
    // the same message whether the email exists or not, so accounts can't be discovered
    return { email, error: "That email and password don't match an active account." };
  }
  await clearFailedLogins();

  (await cookies()).set(SESSION_COOKIE, await createSessionToken({ uid: user.id, role: user.role, ver: user.ver }), {
    httpOnly: true, // not readable from page scripts
    secure: process.env.NODE_ENV === "production", // HTTPS only on the live site
    sameSite: "strict", // never sent on requests started by other sites
    path: "/admin", // only sent to the dashboard, never to the public pages
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/admin" });
  redirect("/admin/login");
}

export type SaveState = { ok?: boolean; message?: string; errors?: Errors };

/** Creates (index = -1) or replaces one entry. Writers and admins. */
export async function saveItem(key: CollectionKey, index: number, _prev: SaveState, formData: FormData): Promise<SaveState> {
  const user = await requireUser();
  const def = collectionOrThrow(key);
  let input: unknown;
  try {
    input = JSON.parse(String(formData.get("json") ?? "{}"));
  } catch {
    return { message: "The form couldn't be read. Reload the page and try again." };
  }

  const list = [...(await getCollection(key))] as unknown as Record<string, unknown>[];
  if (index >= list.length) return { message: "This entry no longer exists. It may have been deleted in another tab." };
  const others = list.filter((_, i) => i !== index);
  const { item, errors } = validateItem(def, input, others);
  if (Object.keys(errors).length) return { errors, message: "Some fields need attention." };

  const isNew = index < 0;
  // who created it: set once, never taken from the form, kept on every later edit
  const author = isNew ? user.id : (list[index]._author as string | undefined);
  if (author) item._author = author;
  if (isNew) list.push(item);
  // keep data the form doesn't edit (e.g. an atoll's island pages), so a save never wipes it
  else list[index] = { ...keepUnmanaged(def, list[index]), ...item };

  try {
    await saveCollection(key, list as unknown as Collections[typeof key], user.id);
  } catch (err) {
    return { message: err instanceof Error ? err.message : "Saving failed." };
  }
  updateTag(contentTag(key));
  if (isNew) redirect(`/admin/${key}/${list.length - 1}?saved=1`);
  return { ok: true, message: "Saved. The live site is updated." };
}

/** Admins: anything. Writers: only guides they created. */
export async function deleteItem(key: CollectionKey, index: number) {
  const user = await requireUser();
  collectionOrThrow(key);
  const list = [...(await getCollection(key))];
  if (index < 0 || index >= list.length) redirect(`/admin/${key}`);
  if (!canDelete(user, key, list[index] as unknown as Record<string, unknown>)) throw new Error("Writers can only delete guides they created.");
  list.splice(index, 1);
  await saveCollection(key, list as Collections[typeof key], user.id);
  updateTag(contentTag(key));
  redirect(`/admin/${key}?deleted=1`);
}

/** Admins only: order is what visitors see first. */
export async function moveItem(key: CollectionKey, index: number, dir: -1 | 1) {
  const user = await requireAdmin();
  collectionOrThrow(key);
  const list = [...(await getCollection(key))];
  const to = index + dir;
  if (index < 0 || to < 0 || index >= list.length || to >= list.length) return;
  [list[index], list[to]] = [list[to], list[index]];
  await saveCollection(key, list as Collections[typeof key], user.id);
  updateTag(contentTag(key));
}

/** Admins only: replaces a collection with its seed content (prisma/seed/content.ts). */
export async function restoreBuiltIn(key: CollectionKey) {
  const user = await requireAdmin();
  collectionOrThrow(key);
  await resetCollection(key, user.id);
  updateTag(contentTag(key));
  redirect(`/admin/${key}?restored=1`);
}
