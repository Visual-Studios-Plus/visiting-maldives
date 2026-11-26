import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { db } from "@/server/db";

/*
 * Site metrics: daily counters per (type, slug, event), nothing else. No cookies, no IP addresses,
 * no personal data.
 *   guide: view, save, unsave       stay: view       atoll: view
 * The pages send one view per browser session; saves come from the bookmark button.
 * - With a database: the Metric model (prisma/schema.prisma).
 * - Without one (local development): .data/metrics.json.
 *
 * Reads aggregate in SQL and only move one row per (type, slug, event) to Node, instead of
 * loading every daily row into memory. Older rows are pruned to RETENTION_DAYS.
 */

export const METRIC_TYPES = { guide: ["view", "save", "unsave"], stay: ["view"], atoll: ["view"] } as const;
export type MetricType = keyof typeof METRIC_TYPES;
export type MetricEvent = "view" | "save" | "unsave";

// Object.hasOwn, not `in`: `in` walks the prototype chain, so "constructor" / "toString" /
// "__proto__" passed the check and then threw (a 500 from /api/metrics).
export const isValidMetric = (type: unknown, event: unknown): type is MetricType =>
  typeof type === "string" &&
  Object.hasOwn(METRIC_TYPES, type) &&
  (METRIC_TYPES[type as MetricType] as readonly string[]).includes(String(event));

const LOCAL_FILE = path.join(process.cwd(), ".data", "metrics.json");
type Row = { type: string; slug: string; event: string; day: string; count: number };

const isoDay = (d: Date) => d.toISOString().slice(0, 10);

/** How long daily counters are kept. "All time" therefore means "the retained window". */
const RETENTION_DAYS = 730;

async function readLocal(): Promise<Row[]> {
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf8"));
  } catch {
    return [];
  }
}

/** Writes the local metrics file in one step, so a crash can't leave half a JSON file. */
async function writeLocal(rows: Row[]): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  const tmp = `${LOCAL_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(rows));
  await fs.rename(tmp, LOCAL_FILE);
}

export async function recordMetric(type: MetricType, slug: string, event: MetricEvent): Promise<void> {
  const dayStr = isoDay(new Date());
  if (db) {
    const day = new Date(`${dayStr}T00:00:00Z`);
    // One statement: insert or increment. No read first, no ORM round trip per view.
    await db.$executeRaw`
      INSERT INTO metrics (type, slug, event, day, count)
      VALUES (${type}, ${slug}, ${event}, ${day}, 1)
      ON CONFLICT (type, slug, event, day)
      DO UPDATE SET count = metrics.count + 1`;
    return;
  }
  if (process.env.NODE_ENV !== "development") return;
  const rows = await readLocal();
  const hit = rows.find((r) => r.type === type && r.slug === slug && r.event === event && r.day === dayStr);
  if (hit) hit.count++;
  else rows.push({ type, slug, event, day: dayStr, count: 1 });
  await writeLocal(rows);
}

// Prune at most once per process per day; admin traffic is low, so this never runs in a loop.
let lastPrune = 0;
async function maybePrune(): Promise<void> {
  if (!db || Date.now() - lastPrune < 864e5) return;
  lastPrune = Date.now();
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 864e5);
  try {
    await db.metric.deleteMany({ where: { day: { lt: cutoff } } });
  } catch (err) {
    console.error("[analytics] prune failed", err); // never break the dashboard for housekeeping
  }
}

export type Counts = { d7: number; d30: number; total: number };
export type ItemStats = { slug: string; views: Counts; saves: Counts; unsaves: Counts };
export type TypeReport = {
  items: ItemStats[];
  totals: { views: Counts; saves: Counts; unsaves: Counts };
  /** last 30 days, one point per day */
  daily: { day: string; views: number; saves: number }[];
};
export type Analytics = { available: boolean; byType: Record<MetricType, TypeReport> };

const zero = (): Counts => ({ d7: 0, d30: 0, total: 0 });

type Aggregate = { type: string; slug: string; event: string; total: number; d30: number; d7: number };
type DailyRow = { type: string; day: Date; event: string; total: number };

/** Counts per item (last 7 / 30 days and retained total) and a 30-day daily series, per type. */
export async function getAnalytics(): Promise<Analytics> {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) days.push(isoDay(new Date(Date.now() - i * 864e5)));
  const d30Start = days[0];
  const d7Start = days[23];

  let rows: Aggregate[] = [];
  let dailyRows: DailyRow[] = [];
  let available = true;

  if (db) {
    await maybePrune();
    try {
      const d30 = new Date(`${d30Start}T00:00:00Z`);
      const d7 = new Date(`${d7Start}T00:00:00Z`);
      [rows, dailyRows] = await Promise.all([
        db.$queryRaw<Aggregate[]>`
          SELECT type, slug, event,
                 SUM(count)::int AS total,
                 SUM(count) FILTER (WHERE day >= ${d30})::int AS d30,
                 SUM(count) FILTER (WHERE day >= ${d7})::int AS d7
          FROM metrics
          GROUP BY type, slug, event`,
        db.$queryRaw<DailyRow[]>`
          SELECT type, day, event, SUM(count)::int AS total
          FROM metrics
          WHERE day >= ${d30}
          GROUP BY type, day, event`,
      ]);
    } catch (err) {
      console.error("[analytics] read failed", err);
      available = false;
    }
  } else if (process.env.NODE_ENV === "development") {
    // Local development: fold the JSON rows into the same aggregate shape.
    const local = await readLocal();
    const d30 = new Date(`${d30Start}T00:00:00Z`).getTime();
    const d7 = new Date(`${d7Start}T00:00:00Z`).getTime();
    const folded = new Map<string, Aggregate>();
    const daily = new Map<string, DailyRow>();
    for (const r of local) {
      const at = new Date(`${r.day}T00:00:00Z`).getTime();
      const key = `${r.type}\u0000${r.slug}\u0000${r.event}`;
      const row = folded.get(key) ?? { type: r.type, slug: r.slug, event: r.event, total: 0, d30: 0, d7: 0 };
      row.total += r.count;
      if (at >= d30) row.d30 += r.count;
      if (at >= d7) row.d7 += r.count;
      folded.set(key, row);
      if (at >= d30) {
        const dayKey = `${r.type}\u0000${r.day}\u0000${r.event}`;
        const point = daily.get(dayKey) ?? { type: r.type, day: new Date(`${r.day}T00:00:00Z`), event: r.event, total: 0 };
        point.total += r.count;
        daily.set(dayKey, point);
      }
    }
    rows = [...folded.values()];
    dailyRows = [...daily.values()];
  } else {
    available = false;
  }

  const byType = {} as Record<MetricType, TypeReport>;
  for (const type of Object.keys(METRIC_TYPES) as MetricType[]) {
    const items = new Map<string, ItemStats>();
    const daily = new Map(days.map((d) => [d, { day: d, views: 0, saves: 0 }]));
    const totals = { views: zero(), saves: zero(), unsaves: zero() };
    const keyOf = (event: string) => (event === "view" ? "views" : event === "save" ? "saves" : event === "unsave" ? "unsaves" : null);

    for (const r of rows) {
      if (r.type !== type) continue;
      const key = keyOf(r.event);
      if (!key) continue;
      const it = items.get(r.slug) ?? { slug: r.slug, views: zero(), saves: zero(), unsaves: zero() };
      for (const c of [it[key], totals[key]]) {
        c.total += Number(r.total);
        c.d30 += Number(r.d30);
        c.d7 += Number(r.d7);
      }
      items.set(r.slug, it);
    }

    for (const r of dailyRows) {
      if (r.type !== type) continue;
      const key = keyOf(r.event);
      const point = daily.get(isoDay(r.day));
      if (point && key && key !== "unsaves") point[key] += Number(r.total);
    }

    byType[type] = { items: [...items.values()], totals, daily: [...daily.values()] };
  }
  return { available, byType };
}
