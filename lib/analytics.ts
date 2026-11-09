import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { db } from "@/lib/db";

/*
 * Site metrics: daily counters per (type, slug, event), nothing else. No cookies, no IP addresses,
 * no personal data.
 *   guide: view, save, unsave       stay: view       atoll: view
 * The pages send one view per browser session; saves come from the bookmark button.
 * - With a database: the Metric model (prisma/schema.prisma).
 * - Without one (local development): .data/metrics.json.
 */

export const METRIC_TYPES = { guide: ["view", "save", "unsave"], stay: ["view"], atoll: ["view"] } as const;
export type MetricType = keyof typeof METRIC_TYPES;
export type MetricEvent = "view" | "save" | "unsave";

export const isValidMetric = (type: unknown, event: unknown): type is MetricType =>
  typeof type === "string" && type in METRIC_TYPES && (METRIC_TYPES[type as MetricType] as readonly string[]).includes(String(event));

const LOCAL_FILE = path.join(process.cwd(), ".data", "metrics.json");
type Row = { type: string; slug: string; event: string; day: string; count: number };

const isoDay = (d: Date) => d.toISOString().slice(0, 10);

async function readLocal(): Promise<Row[]> {
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf8"));
  } catch {
    return [];
  }
}

export async function recordMetric(type: MetricType, slug: string, event: MetricEvent): Promise<void> {
  const dayStr = isoDay(new Date());
  if (db) {
    const day = new Date(`${dayStr}T00:00:00Z`);
    await db.metric.upsert({
      where: { type_slug_event_day: { type, slug, event, day } },
      create: { type, slug, event, day, count: 1 },
      update: { count: { increment: 1 } },
    });
    return;
  }
  if (process.env.NODE_ENV !== "development") return;
  const rows = await readLocal();
  const hit = rows.find((r) => r.type === type && r.slug === slug && r.event === event && r.day === dayStr);
  if (hit) hit.count++;
  else rows.push({ type, slug, event, day: dayStr, count: 1 });
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(rows));
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

/** Counts per item (last 7 / 30 days and all time) and a 30-day daily series, for each type. */
export async function getAnalytics(): Promise<Analytics> {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) days.push(isoDay(new Date(Date.now() - i * 864e5)));
  const d30Start = days[0];
  const d7Start = days[23];

  let rows: Row[] = [];
  let available = true;
  if (db) {
    try {
      rows = (await db.metric.findMany()).map((r) => ({ type: r.type, slug: r.slug, event: r.event, day: isoDay(r.day), count: r.count }));
    } catch (err) {
      console.error("[analytics] read failed", err);
      available = false;
    }
  } else if (process.env.NODE_ENV === "development") {
    rows = await readLocal();
  } else {
    available = false;
  }

  const byType = {} as Record<MetricType, TypeReport>;
  for (const type of Object.keys(METRIC_TYPES) as MetricType[]) {
    const items = new Map<string, ItemStats>();
    const daily = new Map(days.map((d) => [d, { day: d, views: 0, saves: 0 }]));
    const totals = { views: zero(), saves: zero(), unsaves: zero() };
    for (const r of rows) {
      if (r.type !== type) continue;
      const key = r.event === "view" ? "views" : r.event === "save" ? "saves" : r.event === "unsave" ? "unsaves" : null;
      if (!key) continue;
      const it = items.get(r.slug) ?? { slug: r.slug, views: zero(), saves: zero(), unsaves: zero() };
      for (const c of [it[key], totals[key]]) {
        c.total += r.count;
        if (r.day >= d30Start) c.d30 += r.count;
        if (r.day >= d7Start) c.d7 += r.count;
      }
      items.set(r.slug, it);
      const point = daily.get(r.day);
      if (point && key !== "unsaves") point[key] += r.count;
    }
    byType[type] = { items: [...items.values()], totals, daily: [...daily.values()] };
  }
  return { available, byType };
}
