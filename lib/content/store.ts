import "server-only";
import { cacheTag } from "next/cache";
import { promises as fs } from "node:fs";
import path from "node:path";
import { atolls, eats, essentials, events, guides, stays, type Atoll, type Eat, type Essential, type Event, type Guide, type Stay } from "@/lib/data";
import type { CollectionKey } from "./schema";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

/*
 * Where dashboard content lives.
 * - With DATABASE_URL (Neon Postgres via Prisma; see prisma/schema.prisma): one SiteContent row
 *   per collection, holding the whole list as JSON. Tables come from Prisma migrations.
 * - Without it, in local development: .data/content.json in the project (git-ignored).
 * - Until a collection is first saved, the site shows the built-in content from lib/data.ts.
 * Reads are cached and tagged `content:<key>`; saves update that tag so changes show at once.
 */

export type Collections = {
  guides: Guide[];
  atolls: Atoll[];
  stays: Stay[];
  eats: Eat[];
  events: Event[];
  essentials: Essential[];
};

const DEFAULTS: Collections = { guides, atolls, stays, eats, events, essentials };

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

async function readStored<K extends CollectionKey>(key: K): Promise<Collections[K] | null> {
  if (db) {
    try {
      const row = await db.siteContent.findUnique({ where: { key } });
      return (row?.data as Collections[K] | undefined) ?? null;
    } catch (err) {
      // migrations not applied yet, or the database is unreachable: show built-in content
      console.error(`[content] reading "${key}" failed, using built-in content`, err);
      return null;
    }
  }
  if (storageMode() === "local-file") return ((await readLocal())[key] as Collections[K] | undefined) ?? null;
  return null;
}

/** A collection's entries, cached until the dashboard saves a change to it. */
export async function getCollection<K extends CollectionKey>(key: K): Promise<Collections[K]> {
  "use cache";
  cacheTag(contentTag(key));
  return (await readStored(key)) ?? DEFAULTS[key];
}

/** Whether the collection has been saved from the dashboard, or still shows the built-in content. */
export async function isCustomised(key: CollectionKey): Promise<boolean> {
  return (await readStored(key)) !== null;
}

/** Replaces a whole collection. Call only from an authenticated server action, then updateTag. */
export async function saveCollection<K extends CollectionKey>(key: K, data: Collections[K], updatedBy?: string): Promise<void> {
  const mode = storageMode();
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

/** Drops the saved copy so the built-in content shows again. */
export async function resetCollection(key: CollectionKey): Promise<void> {
  const mode = storageMode();
  if (mode === "database") {
    await db!.siteContent.deleteMany({ where: { key } });
  } else if (mode === "local-file") {
    const all = await readLocal();
    delete all[key];
    await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
    await fs.writeFile(LOCAL_FILE, JSON.stringify(all, null, 2));
  } else {
    throw new Error("No database is connected.");
  }
}

// Site-facing helpers
export const getGuides = () => getCollection("guides");
export const getAtolls = () => getCollection("atolls");
export const getStays = () => getCollection("stays");
export const getEats = () => getCollection("eats");
export const getEvents = () => getCollection("events");
export const getEssentials = () => getCollection("essentials");
export const getGuide = async (slug: string) => (await getGuides()).find((g) => g.slug === slug);
export const getAtoll = async (slug: string) => (await getAtolls()).find((a) => a.slug === slug);
export const getStay = async (slug: string) => (await getStays()).find((s) => s.slug === slug);
