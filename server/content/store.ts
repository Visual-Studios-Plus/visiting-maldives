import "server-only";
import { cache } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { promises as fs } from "node:fs";
import path from "node:path";
import { eatSlug, salonSlug, type Atoll, type CustomSection, type Dish, type Eat, type Essential, type Event, type Guide, type IslandEntry, type Salon, type Stay } from "@/lib/data";
import type { CollectionKey } from "@/lib/content/schema";
import type { Prisma } from "@prisma/client";
import { db } from "@/server/db";

/*
 * Where dashboard content lives (backend only: pages and components read it through the getters
 * below, never through Prisma).
 * - With DATABASE_URL (Neon Postgres via Prisma; see prisma/schema.prisma): one SiteContent row
 *   per collection, holding the whole list as JSON. Tables come from Prisma migrations.
 * - Without it, in local development: .data/content.json in the project (git-ignored).
 * - Content starts in the database via the seed (prisma/seed/content.ts, `npm run db:seed`); an
 *   unseeded collection is simply empty. "Restore original content" rewrites it from the seed.
 *
 * Reliability:
 * - Reads are cached with "use cache" and tagged `content:<key>`; a save updates that tag.
 * - `readCollectionForEdit` also returns the row's updatedAt, and `saveCollection` can require
 *   that exact version. Two people editing the same list therefore get a clear "changed
 *   underneath you" error instead of one silently overwriting the other (lost update).
 */

export type Collections = {
  guides: Guide[];
  atolls: Atoll[];
  stays: Stay[];
  dishes: Dish[];
  eats: Eat[];
  events: Event[];
  essentials: Essential[];
  salons: Salon[];
  islands: IslandEntry[];
  sections: CustomSection[];
};

export const contentTag = (key: CollectionKey) => `content:${key}`;

const LOCAL_FILE = path.join(process.cwd(), ".data", "content.json");

export type StorageMode = "database" | "local-file" | "read-only";
export const storageMode = (): StorageMode => (db ? "database" : process.env.NODE_ENV === "development" ? "local-file" : "read-only");

/** A save whose `expected` version no longer matches the row: someone else changed the list first. */
export class ContentConflictError extends Error {
  constructor() {
    super("Someone else changed this list while you were editing. Reload to see their version, then apply your changes again.");
    this.name = "ContentConflictError";
  }
}

async function readLocal(): Promise<Partial<Collections>> {
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf8"));
  } catch {
    return {};
  }
}

/** Writes the local file in one step (temp file + rename), so a crash can't leave half a JSON file. */
async function writeLocal(all: Partial<Collections>): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  const tmp = `${LOCAL_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(all, null, 2));
  await fs.rename(tmp, LOCAL_FILE);
}

/*
 * Kept on globalThis so they survive hot reloads in development.
 * - inFlight: reads under way, by collection; pages rendered at the same time share one query.
 * - devMemo (development and the production build only): collections already read. `next dev` often skips "use cache"
 *   (every reload and every page view reads again), and each read of a big collection takes
 *   seconds from a remote database, which used up the connection pool. Cleared for a collection
 *   when the dashboard saves it; kept 10 minutes, so seed scripts show up without a restart.
 *   Production relies on "use cache" (getCollection) instead, which every server instance shares.
 */
const memo = globalThis as unknown as {
  contentInFlight?: Map<CollectionKey, Promise<unknown>>;
  contentDevMemo?: Map<CollectionKey, { data: unknown; at: number }>;
};
const inFlight = (memo.contentInFlight ??= new Map());
// also while `next build` prerenders: hundreds of island pages read the same collections at once
const keepInMemory = process.env.NODE_ENV === "development" || process.env.NEXT_PHASE === "phase-production-build";
const devMemo = keepInMemory ? (memo.contentDevMemo ??= new Map()) : undefined;
const DEV_MEMO_MS = 10 * 60 * 1000;

/** Prisma's "table does not exist": migrations not applied yet, so the collection is simply empty. */
const isMissingTable = (err: unknown) => (err as { code?: string } | null)?.code === "P2021";

async function readRow<K extends CollectionKey>(key: K): Promise<{ data: Collections[K]; version: string | null } | null> {
  for (let attempt = 1; ; attempt++) {
    try {
      const row = await db!.siteContent.findUnique({ where: { key } });
      return row ? { data: row.data as Collections[K], version: row.updatedAt.toISOString() } : null;
    } catch (err) {
      if (isMissingTable(err)) return null;
      // a busy pool or a database still waking up: try once more before giving up
      if (attempt >= 2) throw err;
      await new Promise((r) => setTimeout(r, 500));
    }
  }
}

async function readStored<K extends CollectionKey>(key: K): Promise<Collections[K] | null> {
  if (db) {
    // Never return "empty" for a failed read: getCollection caches its result, and an empty
    // collection could stay cached (blank pages) until the next dashboard save. Throwing lets
    // the request fail and the next one try again.
    const kept = devMemo?.get(key);
    if (kept && performance.now() - kept.at < DEV_MEMO_MS) return kept.data as Collections[K] | null;
    let read = inFlight.get(key) as Promise<Collections[K] | null> | undefined;
    if (!read) {
      read = readRow(key)
        .then((row) => row?.data ?? null)
        .finally(() => inFlight.delete(key));
      inFlight.set(key, read);
    }
    try {
      const data = await read;
      devMemo?.set(key, { data, at: performance.now() });
      return data;
    } catch (err) {
      console.error(`[content] reading "${key}" failed`, err);
      throw err;
    }
  }
  if (storageMode() === "local-file") return ((await readLocal())[key] as Collections[K] | undefined) ?? null;
  return null;
}

/**
 * A collection's entries, cached until the dashboard saves it. `revalidate` is a safety net for
 * anything that bypasses the tag (e.g. a seed run outside the app); saves update the tag at once.
 */
export async function getCollection<K extends CollectionKey>(key: K): Promise<Collections[K]> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 3600, expire: 86400 });
  cacheTag(contentTag(key));
  return (await readStored(key)) ?? ([] as unknown as Collections[K]);
}

/**
 * Several collections in one query. Pages that need five of them (an island page, say) would
 * otherwise open five connections at once on a cold cache; this keeps it to one round trip.
 */
export async function getCollections<K extends CollectionKey>(keys: readonly K[]): Promise<Pick<Collections, K>> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 3600, expire: 86400 });
  for (const key of keys) cacheTag(contentTag(key));

  if (!db) {
    const local = storageMode() === "local-file" ? await readLocal() : {};
    return Object.fromEntries(keys.map((k) => [k, (local[k] as Collections[K] | undefined) ?? []])) as Pick<Collections, K>;
  }

  let rows: { key: string; data: unknown }[] = [];
  for (let attempt = 1; ; attempt++) {
    try {
      rows = await db.siteContent.findMany({ where: { key: { in: [...keys] } }, select: { key: true, data: true } });
      break;
    } catch (err) {
      if (isMissingTable(err)) break;
      if (attempt >= 2) throw err;
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  const byKey = new Map(rows.map((r) => [r.key, r.data]));
  return Object.fromEntries(keys.map((k) => [k, (byKey.get(k) as Collections[K] | undefined) ?? []])) as Pick<Collections, K>;
}

/**
 * The list plus the version it was read at, for the dashboard's edit form. Uncached on purpose:
 * the editor must see the row as it is now, and compare that version on save.
 */
export async function readCollectionForEdit<K extends CollectionKey>(key: K): Promise<{ items: Collections[K]; version: string | null }> {
  if (!db) {
    const local = (await readLocal())[key] as Collections[K] | undefined;
    return { items: local ?? ([] as unknown as Collections[K]), version: null };
  }
  const row = await readRow(key);
  return { items: row?.data ?? ([] as unknown as Collections[K]), version: row?.version ?? null };
}

/** The collections stored in the database, read with one query per request (not one per collection). */
const storedKeys = cache(async (): Promise<Set<string> | null> => {
  if (!db) return null;
  const rows = await db.siteContent.findMany({ select: { key: true } });
  return new Set(rows.map((r) => r.key));
});

/** Whether the collection exists in the database (seeded or saved), or is still empty. */
export async function isCustomised(key: CollectionKey): Promise<boolean> {
  const keys = await storedKeys();
  if (keys) return keys.has(key);
  return (await readStored(key)) !== null;
}

/**
 * Replaces a whole collection. Call only from an authenticated server action, then updateTag.
 *
 * `expected` is the version the editor saw (`null` = the collection did not exist yet). When it
 * is given, the write is a compare-and-set: if the row changed in the meantime, nothing is
 * written and ContentConflictError is thrown, so concurrent editors can't silently lose work.
 * Omit it for deliberate whole-collection writes (restore, seed).
 */
export async function saveCollection<K extends CollectionKey>(
  key: K,
  data: Collections[K],
  updatedBy?: string,
  expected?: string | null,
): Promise<void> {
  const mode = storageMode();
  if (mode === "database") {
    const json = data as unknown as Prisma.InputJsonValue;
    if (expected === undefined) {
      await db!.siteContent.upsert({ where: { key }, create: { key, data: json, updatedBy }, update: { data: json, updatedBy } });
    } else if (expected === null) {
      try {
        await db!.siteContent.create({ data: { key, data: json, updatedBy } });
      } catch (err) {
        // unique key: another tab created the same collection first
        if ((err as { code?: string }).code === "P2002") throw new ContentConflictError();
        throw err;
      }
    } else {
      const written = await db!.siteContent.updateMany({
        where: { key, updatedAt: new Date(expected) },
        data: { data: json, updatedBy },
      });
      if (written.count === 0) throw new ContentConflictError();
    }
    devMemo?.delete(key);
    return;
  }
  if (mode === "local-file") {
    const all = await readLocal();
    await writeLocal({ ...all, [key]: data });
    devMemo?.delete(key);
    return;
  }
  throw new Error("No database is connected, so changes can't be saved. Add DATABASE_URL in Vercel (Storage → Neon) and redeploy.");
}

/** Replaces a collection with its seed content (prisma/seed/content.ts). Loaded only when used. */
export async function resetCollection(key: CollectionKey, updatedBy?: string): Promise<void> {
  const { SEED } = await import("@/prisma/seed/content");
  await saveCollection(key, SEED[key] as Collections[typeof key], updatedBy);
}

// Site-facing helpers
export const getGuides = () => getCollection("guides");
export const getAtolls = () => getCollection("atolls");
export const getStays = () => getCollection("stays");
export const getEats = () => getCollection("eats");
export const getDishes = () => getCollection("dishes");
export const getEat = async (slug: string) => (await getEats()).find((e) => eatSlug(e) === slug);
export const getEvents = () => getCollection("events");
export const getEssentials = () => getCollection("essentials");
export const getSalons = () => getCollection("salons");
export const getIslands = () => getCollection("islands");
export const getSections = () => getCollection("sections");
export const getSalon = async (slug: string) => (await getSalons()).find((s) => salonSlug(s) === slug);
export const getGuide = async (slug: string) => (await getGuides()).find((g) => g.slug === slug);
export const getAtoll = async (slug: string) => (await getAtolls()).find((a) => a.slug === slug);
export const getStay = async (slug: string) => (await getStays()).find((s) => s.slug === slug);

/**
 * Page params for generateStaticParams. With Cache Components the list may not be empty, so an
 * unseeded collection yields one placeholder slug whose page is simply "not found" (no fake page).
 */
export const slugParams = (items: { slug: string }[]) => (items.length ? items.map((i) => ({ slug: i.slug })) : [{ slug: "not-seeded" }]);
