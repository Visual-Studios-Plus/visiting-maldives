import { randomUUID } from "node:crypto";
import type { PrismaClient, Prisma } from "@prisma/client";
import type { Stay } from "../../lib/data.ts";

/*
 * Places to stay live in their own tables (stays, stay_facts, stay_photos, stay_reviews), one
 * column per field, instead of one JSON value holding the whole list. The rest of the app still
 * sees a list of Stay objects in site order: this module turns rows into that list and writes a
 * changed list back as row changes (only the rows that actually changed).
 *
 * Each item carries its row id in `_id` (and its creator in `_author`); the dashboard keeps both
 * through edits, so a save updates the right row.
 *
 * It takes the client as an argument (no server-only import), so prisma/seed.ts can use it too.
 */

export type StayItem = Stay & { _id?: string; _author?: string };

const include = {
  facts: { orderBy: { position: "asc" } },
  photos: { orderBy: { position: "asc" } },
  reviews: { orderBy: { position: "asc" } },
} as const;

type Row = Prisma.StayGetPayload<{ include: typeof include }>;

const opt = <T,>(v: T | null | undefined) => (v === null || v === undefined ? undefined : v);

/** A row (with its facts, photos and reviews) as the Stay object the site uses. */
function toItem(r: Row): StayItem {
  const item: StayItem = {
    _id: r.id,
    slug: r.slug,
    name: r.name,
    type: r.type as Stay["type"],
    atoll: r.atoll,
    price: r.price,
    note: r.note,
    about: r.about,
    image: r.image,
    amenities: r.amenities,
    facts: r.facts.map((f) => ({ label: f.label, value: f.value })),
    gallery: r.photos.map((p) => ({ src: p.src, alt: p.alt, ...(p.caption ? { caption: p.caption } : {}) })),
    reviews: r.reviews.map((v) => ({ author: v.author, from: v.from, date: v.date, rating: v.rating, text: v.text })),
  };
  const extra: Partial<StayItem> = {
    atollSlug: opt(r.atollSlug),
    island: opt(r.island),
    lat: opt(r.lat),
    lng: opt(r.lng),
    rating: opt(r.rating),
    rooms: opt(r.rooms),
    beds: opt(r.beds),
    berths: opt(r.berths),
    phone: opt(r.phone),
    email: opt(r.email),
    website: opt(r.website),
    _author: opt(r.author),
  };
  for (const [k, v] of Object.entries(extra)) if (v !== undefined) (item as Record<string, unknown>)[k] = v;
  if (r.partner) item.partner = true;
  if (r.licensed) item.licensed = true;
  return item;
}

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const int = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v) : null);
const str = (v: unknown) => (typeof v === "string" && v.trim() ? v : null);

/** A Stay object's own columns (everything but the id, position and child rows). */
function columns(s: StayItem) {
  return {
    slug: s.slug,
    name: s.name,
    type: s.type,
    atoll: s.atoll ?? "",
    atollSlug: str(s.atollSlug),
    island: str(s.island),
    lat: num(s.lat),
    lng: num(s.lng),
    price: s.price ?? "",
    note: s.note ?? "",
    about: s.about ?? "",
    image: s.image ?? "",
    partner: s.partner === true,
    rating: num(s.rating),
    rooms: int(s.rooms),
    beds: int(s.beds),
    berths: int(s.berths),
    phone: str(s.phone),
    email: str(s.email),
    website: str(s.website),
    licensed: s.licensed === true,
    amenities: (s.amenities ?? []).filter((a) => typeof a === "string" && a.trim()),
    author: str(s._author),
  };
}

/** The child rows of a Stay object, ready to insert for row `stayId`. */
function children(stayId: string, s: StayItem) {
  return {
    facts: (s.facts ?? []).map((f, position) => ({ stayId, position, label: f.label, value: f.value })),
    photos: (s.gallery ?? []).map((p, position) => ({ stayId, position, src: p.src, alt: p.alt, caption: str(p.caption) })),
    reviews: (s.reviews ?? []).map((v, position) => ({
      stayId,
      position,
      author: v.author,
      from: v.from ?? "",
      date: v.date ?? "",
      rating: v.rating,
      text: v.text,
    })),
  };
}

/** What a stay looks like when stored, for spotting the rows a save really changes. */
const fingerprint = (s: StayItem) => JSON.stringify([columns(s), children("", s)]);

/** The version the dashboard compares on save: changes whenever a row is added, removed or edited. */
const versionOf = (rows: { updatedAt: Date }[]) =>
  `${rows.length}:${rows.reduce((t, r) => Math.max(t, r.updatedAt.getTime()), 0)}`;

/**
 * Whether this client knows the stays tables: a client generated before they existed (a dev server
 * started earlier) doesn't, and is treated like a database without them.
 */
const knowsStays = (db: PrismaClient | Prisma.TransactionClient) => typeof (db as { stay?: { findMany?: unknown } }).stay?.findMany === "function";

/** Whether the stays tables exist (migration applied) and this client can use them. */
export async function staysTableReady(db: PrismaClient): Promise<boolean> {
  if (!knowsStays(db)) return false;
  try {
    await db.stay.count();
    return true;
  } catch (err) {
    if ((err as { code?: string }).code === "P2021") return false;
    throw err;
  }
}

/** Every stay in site order, with the version it was read at; null when there are none. */
export async function readStays(db: PrismaClient | Prisma.TransactionClient): Promise<{ items: StayItem[]; version: string } | null> {
  if (!knowsStays(db)) return null;
  const rows = await db.stay.findMany({ orderBy: [{ position: "asc" }, { createdAt: "asc" }], include });
  if (!rows.length) return null;
  return { items: rows.map(toItem), version: versionOf(rows) };
}

/** Whether any stay is stored yet. */
export async function hasStays(db: PrismaClient): Promise<boolean> {
  if (!knowsStays(db)) return false;
  return (await db.stay.count()) > 0;
}

/** Thrown when the stored stays changed after the editor read them. */
export class StaysConflictError extends Error {
  constructor() {
    super("Someone else changed this list while you were editing. Reload to see their version, then apply your changes again.");
    this.name = "StaysConflictError";
  }
}

/**
 * Makes the stored stays match `list`, in that order, writing only what changed: new items are
 * inserted, missing ones deleted, edited ones updated, and only rows whose place in the order
 * moved get a new position. `expected` (a version from readStays) turns it into a
 * compare-and-set; leave it out for deliberate whole-list writes (seed, restore).
 */
export async function writeStays(
  db: PrismaClient,
  list: StayItem[],
  updatedBy?: string,
  expected?: string | null,
): Promise<{ added: number; updated: number; deleted: number }> {
  return db.$transaction(
    async (tx) => {
      const current = await readStays(tx);
      if (expected !== undefined && (current?.version ?? null) !== expected) throw new StaysConflictError();

      const byId = new Map((current?.items ?? []).map((s) => [s._id!, s]));
      const positionOf = new Map<string, number>();
      const rows = await tx.stay.findMany({ select: { id: true, position: true } });
      for (const r of rows) positionOf.set(r.id, r.position);

      // kept rows reuse the existing positions, in their new order: a delete moves nothing,
      // swapping two neighbours rewrites two rows
      const kept = list.filter((s) => s._id && byId.has(s._id));
      const slots = kept.map((s) => positionOf.get(s._id!)!).sort((a, b) => a - b);
      let next = (slots.at(-1) ?? 0) + 1000;

      const keepIds = new Set(kept.map((s) => s._id!));
      const gone = [...byId.keys()].filter((id) => !keepIds.has(id));
      if (gone.length) await tx.stay.deleteMany({ where: { id: { in: gone } } });

      let updated = 0;
      const fresh: { id: string; s: StayItem; position: number }[] = [];
      let k = 0;
      for (const s of list) {
        if (s._id && byId.has(s._id)) {
          const position = slots[k++];
          const changed = fingerprint(s) !== fingerprint(byId.get(s._id)!);
          if (changed) {
            const c = children(s._id, s);
            await tx.stayFact.deleteMany({ where: { stayId: s._id } });
            await tx.stayPhoto.deleteMany({ where: { stayId: s._id } });
            await tx.stayReview.deleteMany({ where: { stayId: s._id } });
            await tx.stay.update({ where: { id: s._id }, data: { ...columns(s), position, updatedBy } });
            if (c.facts.length) await tx.stayFact.createMany({ data: c.facts });
            if (c.photos.length) await tx.stayPhoto.createMany({ data: c.photos });
            if (c.reviews.length) await tx.stayReview.createMany({ data: c.reviews });
            updated++;
          } else if (position !== positionOf.get(s._id)) {
            await tx.stay.update({ where: { id: s._id }, data: { position, updatedBy } });
            updated++;
          }
        } else {
          fresh.push({ id: randomUUID(), s, position: next });
          next += 1000;
        }
      }

      if (fresh.length) {
        await tx.stay.createMany({ data: fresh.map(({ id, s, position }) => ({ id, position, ...columns(s), updatedBy })) });
        const all = fresh.map(({ id, s }) => children(id, s));
        const facts = all.flatMap((c) => c.facts);
        const photos = all.flatMap((c) => c.photos);
        const reviews = all.flatMap((c) => c.reviews);
        if (facts.length) await tx.stayFact.createMany({ data: facts });
        if (photos.length) await tx.stayPhoto.createMany({ data: photos });
        if (reviews.length) await tx.stayReview.createMany({ data: reviews });
      }
      return { added: fresh.length, updated, deleted: gone.length };
    },
    { timeout: 120_000, maxWait: 20_000 },
  );
}
