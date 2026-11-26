import type { CollectionKey } from "@/lib/content/schema";

/*
 * What each role may do with content. Used by the dashboard UI and enforced again in the actions.
 *   Admins:  everything.
 *   Writers: create and edit; delete only guides they created (an entry's `_author` is its creator).
 */
export function canDelete(user: { id: string; role: string }, key: CollectionKey, item: Record<string, unknown>): boolean {
  return user.role === "ADMIN" || (key === "guides" && typeof item._author === "string" && item._author === user.id);
}
