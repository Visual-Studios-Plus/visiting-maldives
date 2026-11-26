import { isValidMetric, recordMetric, type MetricEvent } from "@/server/analytics";
import { allowLocal } from "@/server/rate-limit";
import { getAtolls, getGuides, getStays } from "@/server/content/store";

/*
 * Counts one event: { type: "guide" | "stay" | "atoll", slug, event: "view" | "save" | "unsave" }.
 * Defences against junk counts:
 * - only requests from this site (Sec-Fetch-Site / Origin), so other sites can't post here;
 * - only known type/event pairs and slugs that exist, so the table can't fill with made-up rows;
 * - obvious bots and crawlers are ignored; tiny bodies only.
 * Someone scripting a real browser could still inflate counts: treat them as a guide, not an audit.
 */
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor|facebookexternalhit|curl|wget|python|axios|node-fetch/i;

const exists = {
  guide: async (slug: string) => (await getGuides()).some((x) => x.slug === slug),
  stay: async (slug: string) => (await getStays()).some((x) => x.slug === slug),
  atoll: async (slug: string) => (await getAtolls()).some((x) => x.slug === slug),
};

export async function POST(request: Request) {
  const site = request.headers.get("sec-fetch-site");
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  let sameSite = false;
  try {
    sameSite = site ? site === "same-origin" : origin ? new URL(origin).host === host : false;
  } catch {
    sameSite = false;
  }
  if (!sameSite) return new Response(null, { status: 403 });
  if (BOT.test(request.headers.get("user-agent") ?? "")) return new Response(null, { status: 204 });

  // Read at most a small body: reject on the declared length before buffering it, and throttle
  // each address so one client can't turn this into a database-write loop.
  const declared = Number(request.headers.get("content-length") ?? "");
  if (Number.isFinite(declared) && declared > 1024) return new Response(null, { status: 413 });
  const ip = (request.headers.get("x-forwarded-for")?.split(",")[0] ?? request.headers.get("x-real-ip") ?? "unknown").trim().slice(0, 64);
  if (!(await allowLocal(`metrics:${ip}`, 120, 60_000, false))) return new Response(null, { status: 429 });

  const body = await request.text();
  if (body.length > 300) return new Response(null, { status: 413 });
  let msg: { type?: unknown; slug?: unknown; event?: unknown };
  try {
    msg = JSON.parse(body);
  } catch {
    return new Response(null, { status: 400 });
  }
  const { type, slug, event } = msg;
  if (!isValidMetric(type, event) || typeof slug !== "string" || slug.length > 120 || !(await exists[type](slug))) {
    return new Response(null, { status: 404 });
  }

  try {
    await recordMetric(type, slug, event as MetricEvent);
  } catch (err) {
    console.error("[metrics] could not record", err);
  }
  return new Response(null, { status: 204 });
}
