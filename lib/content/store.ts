import "server-only";
import { cache } from "react";
import { cacheTag } from "next/cache";
import { promises as fs } from "node:fs";
import path from "node:path";
import { eatSlug, salonSlug, type Atoll, type CustomSection, type Dish, type Eat, type Essential, type Event, type Guide, type IslandEntry, type Salon, type Stay } from "@/lib/data";
import { SEED } from "@/prisma/seed/content";
import type { CollectionKey } from "./schema";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

/*
 * Where dashboard content lives.
 * - With DATABASE_URL (Neon Postgres via Prisma; see prisma/schema.prisma): one SiteContent row
 *   per collection, holding the whole list as JSON. Tables come from Prisma migrations.
 * - Without it, in local development: .data/content.json in the project (git-ignored).
 * - Content starts in the database via the seed (prisma/seed/content.ts, `npm run db:seed`); an
 *   unseeded collection is simply empty. "Restore original content" rewrites it from the seed.
 * Reads are cached and tagged `content:<key>`; saves update that tag so changes show at once.
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

async function readLocal(): Promise<Partial<Collections>> {
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf8"));
  } catch {
    return {};
  }
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

async function readRow<K extends CollectionKey>(key: K): Promise<Collections[K] | null> {
  for (let attempt = 1; ; attempt++) {
    try {
      const row = await db!.siteContent.findUnique({ where: { key } });
      return (row?.data as Collections[K] | undefined) ?? null;
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
    // collection would stay cached (blank pages) until the next dashboard save. Throwing lets
    // the request fail and the next one try again.
    const kept = devMemo?.get(key);
    if (kept && performance.now() - kept.at < DEV_MEMO_MS) return kept.data as Collections[K] | null;
    let read = inFlight.get(key) as Promise<Collections[K] | null> | undefined;
    if (!read) {
      read = readRow(key).finally(() => inFlight.delete(key));
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

/** A collection's entries, cached until the dashboard saves a change to it. */
export async function getCollection<K extends CollectionKey>(key: K): Promise<Collections[K]> {
  "use cache";
  cacheTag(contentTag(key));
  return (await readStored(key)) ?? ([] as unknown as Collections[K]);
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

/** Replaces a whole collection. Call only from an authenticated server action, then updateTag. */
export async function saveCollection<K extends CollectionKey>(key: K, data: Collections[K], updatedBy?: string): Promise<void> {
  const mode = storageMode();
  devMemo?.delete(key);
  if (mode === "database") {
    const json = data as unknown as Prisma.InputJsonValue;
    await db!.siteContent.upsert({ where: { key }, create: { key, data: json, updatedBy }, update: { data: json, updatedBy } });
    return;
  }
  if (mode === "local-file") {
    const all = await readLocal();
    await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
    await fs.writeFile(LOCAL_FILE, JSON.stringify({ ...all, [key]: data }, null, 2));
    return;
  }
  throw new Error("No database is connected, so changes can't be saved. Add DATABASE_URL in Vercel (Storage → Neon) and redeploy.");
}

/** Replaces a collection with its seed content (prisma/seed/content.ts). */
export async function resetCollection(key: CollectionKey, updatedBy?: string): Promise<void> {
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
