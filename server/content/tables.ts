import { randomUUID } from "node:crypto";
import type { PrismaClient, Prisma } from "@prisma/client";
import { TABLE_SPECS, delegateName, fieldName, type Col, type TableSpec } from "./table-specs.ts";

/*
 * Reads and writes the content collections described in table-specs.ts: one row per entry, a
 * column per field, child rows for lists of objects. The site keeps seeing plain lists of
 * objects in site order; a save writes only the rows that changed (an edit updates one entry,
 * a delete removes one, moving an entry rewrites two).
 *
 * Each item carries its row id in `_id` and its creator in `_author`; the dashboard keeps both
 * through edits. No server-only import, so prisma/seed.ts and scripts can use it too.
 */

type Db = PrismaClient | Prisma.TransactionClient;
type Item = Record<string, unknown>;
type Delegate = {
  findMany: (args?: unknown) => Promise<Item[]>;
  count: (args?: unknown) => Promise<number>;
  createMany: (args: unknown) => Promise<unknown>;
  deleteMany: (args?: unknown) => Promise<unknown>;
  update: (args: unknown) => Promise<unknown>;
};

const delegate = (db: Db, model: string) => (db as unknown as Record<string, Delegate | undefined>)[delegateName(model)];

export const tableSpec = (key: string) => TABLE_SPECS.find((s) => s.key === key);

const getPath = (o: Item, path: string): unknown => path.split(".").reduce<unknown>((v, k) => (v && typeof v === "object" ? (v as Item)[k] : undefined), o);
function setPath(o: Item, path: string, value: unknown) {
  const keys = path.split(".");
  let cur = o;
  for (const k of keys.slice(0, -1)) cur = (cur[k] ??= {}) as Item;
  cur[keys.at(-1)!] = value;
}

/** A stored value as the item's value (missing optional values are left out). */
function fromDb(c: Col, v: unknown): unknown {
  if (v === null || v === undefined) return undefined;
  if (c.t === "ss" && c.opt && Array.isArray(v) && !v.length) return undefined;
  return v;
}

/** An item's value as the column's value (required columns get an empty default). */
function toDb(c: Col, v: unknown): unknown {
  switch (c.t) {
    case "s":
      return typeof v === "string" ? v : c.opt ? null : "";
    case "i":
      return typeof v === "number" && Number.isFinite(v) ? Math.round(v) : c.opt ? null : 0;
    case "f":
      return typeof v === "number" && Number.isFinite(v) ? v : c.opt ? null : 0;
    case "b":
      return typeof v === "boolean" ? v : c.opt ? null : false;
    case "ss":
      return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  }
}

const inGroup = (spec: TableSpec, path: string) => spec.groups?.find((g) => path.startsWith(`${g.path}.`));

/** A row (with its child rows) as the object the site uses. */
function toItem(spec: TableSpec, row: Item): Item {
  const item: Item = { _id: row.id };
  const off = new Set((spec.groups ?? []).filter((g) => !row[g.flag]).map((g) => g.path));
  for (const g of spec.groups ?? []) if (!off.has(g.path)) setPath(item, g.path, {});
  for (const c of spec.cols) {
    const g = inGroup(spec, c.f);
    if (g && off.has(g.path)) continue;
    const v = fromDb(c, row[fieldName(c)]);
    if (v !== undefined) setPath(item, c.f, v);
  }
  for (const ch of spec.children) {
    const g = inGroup(spec, ch.f);
    if (g && off.has(g.path)) continue;
    const rows = (row[ch.rel] as Item[] | undefined) ?? [];
    if (!rows.length && ch.opt) continue;
    setPath(
      item,
      ch.f,
      rows.map((r) => {
        const o: Item = {};
        for (const c of ch.cols) {
          const v = fromDb(c, r[fieldName(c)]);
          if (v !== undefined) o[c.f] = v;
        }
        return o;
      }),
    );
  }
  if (typeof row.author === "string") item._author = row.author;
  return item;
}

/** An item's own columns (no id, order or child rows). */
function columns(spec: TableSpec, item: Item): Item {
  const data: Item = {};
  for (const c of spec.cols) data[fieldName(c)] = toDb(c, getPath(item, c.f));
  for (const g of spec.groups ?? []) data[g.flag] = !!getPath(item, g.path) && typeof getPath(item, g.path) === "object";
  data.author = typeof item._author === "string" ? item._author : null;
  return data;
}

/** An item's child rows, by child model, ready to insert for row `id`. */
function children(spec: TableSpec, id: string, item: Item): Record<string, Item[]> {
  const out: Record<string, Item[]> = {};
  for (const ch of spec.children) {
    const list = getPath(item, ch.f);
    out[ch.model] = (Array.isArray(list) ? list : []).map((o: Item, sortOrder) => {
      const r: Item = { ownerId: id, sortOrder };
      for (const c of ch.cols) r[fieldName(c)] = toDb(c, o?.[c.f]);
      return r;
    });
  }
  return out;
}

const fingerprint = (spec: TableSpec, item: Item) => JSON.stringify([columns(spec, item), children(spec, "", item)]);
const versionOf = (rows: Item[]) => `${rows.length}:${rows.reduce((t, r) => Math.max(t, (r.updatedAt as Date).getTime()), 0)}`;
const include = (spec: TableSpec) => Object.fromEntries(spec.children.map((ch) => [ch.rel, { orderBy: { sortOrder: "asc" } }]));

/** Whether this client was generated with the table (a dev server started before it existed wasn't). */
const knows = (db: Db, spec: TableSpec) => typeof delegate(db, spec.model)?.findMany === "function";

/** Whether the table exists (migration applied) and this client can use it. */
export async function tableReady(db: PrismaClient, spec: TableSpec): Promise<boolean> {
  if (!knows(db, spec)) return false;
  try {
    await delegate(db, spec.model)!.count();
    return true;
  } catch (err) {
    if ((err as { code?: string }).code === "P2021") return false;
    throw err;
  }
}

/** Whether the table has any entries yet. */
export async function tableHasRows(db: PrismaClient, spec: TableSpec): Promise<boolean> {
  return (await tableReady(db, spec)) && (await delegate(db, spec.model)!.count()) > 0;
}

/** The entries in site order with the version they were read at; null when the table is empty or missing. */
export async function readTable(db: Db, spec: TableSpec): Promise<{ items: Item[]; version: string } | null> {
  if (!knows(db, spec)) return null;
  const rows = await delegate(db, spec.model)!.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], include: include(spec) });
  if (!rows.length) return null;
  return { items: rows.map((r) => toItem(spec, r)), version: versionOf(rows) };
}

/** Thrown when the stored entries changed after the editor read them. */
export class TableConflictError extends Error {
  constructor() {
    super("Someone else changed this list while you were editing. Reload to see their version, then apply your changes again.");
    this.name = "TableConflictError";
  }
}

/**
 * Makes the stored entries match `list`, in that order, writing only what changed. `expected` (a
 * version from readTable) makes it a compare-and-set; leave it out for whole-list writes.
 */
export async function writeTable(
  db: PrismaClient,
  spec: TableSpec,
  list: Item[],
  updatedBy?: string,
  expected?: string | null,
): Promise<{ added: number; updated: number; deleted: number }> {
  return db.$transaction(
    async (tx) => {
      const main = delegate(tx, spec.model)!;
      const current = await readTable(tx, spec);
      if (expected !== undefined && (current?.version ?? null) !== expected) throw new TableConflictError();

      const byId = new Map((current?.items ?? []).map((s) => [s._id as string, s]));
      const positionOf = new Map((await main.findMany({ select: { id: true, sortOrder: true } })).map((r) => [r.id as string, r.sortOrder as number]));

      // kept rows reuse the existing positions in their new order
      const kept = list.filter((s) => typeof s._id === "string" && byId.has(s._id));
      const slots = kept.map((s) => positionOf.get(s._id as string)!).sort((a, b) => a - b);
      let next = (Math.max(0, ...positionOf.values()) || 0) + 1000;

      const keepIds = new Set(kept.map((s) => s._id as string));
      const gone = [...byId.keys()].filter((id) => !keepIds.has(id));
      if (gone.length) await main.deleteMany({ where: { id: { in: gone } } });

      let updated = 0;
      let k = 0;
      const fresh: { id: string; item: Item; sortOrder: number }[] = [];
      for (const item of list) {
        const id = item._id as string | undefined;
        if (id && byId.has(id)) {
          const sortOrder = slots[k++];
          if (fingerprint(spec, item) !== fingerprint(spec, byId.get(id)!)) {
            for (const ch of spec.children) await delegate(tx, ch.model)!.deleteMany({ where: { ownerId: id } });
            await main.update({ where: { id }, data: { ...columns(spec, item), sortOrder, updatedBy } });
            const kids = children(spec, id, item);
            for (const ch of spec.children) if (kids[ch.model].length) await delegate(tx, ch.model)!.createMany({ data: kids[ch.model] });
            updated++;
          } else if (sortOrder !== positionOf.get(id)) {
            await main.update({ where: { id }, data: { sortOrder, updatedBy } });
            updated++;
          }
        } else {
          fresh.push({ id: randomUUID(), item, sortOrder: next });
          next += 1000;
        }
      }

      if (fresh.length) {
        await main.createMany({ data: fresh.map(({ id, item, sortOrder }) => ({ id, sortOrder, ...columns(spec, item), updatedBy })) });
        for (const ch of spec.children) {
          const rows = fresh.flatMap(({ id, item }) => children(spec, id, item)[ch.model]);
          if (rows.length) await delegate(tx, ch.model)!.createMany({ data: rows });
        }
      }
      return { added: fresh.length, updated, deleted: gone.length };
    },
    { timeout: 120_000, maxWait: 20_000 },
  );
}
