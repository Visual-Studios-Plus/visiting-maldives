import { stayInAtoll, type Atoll, type Stay } from "../../lib/data.ts";
import { allResortRecords, islandSlug, resortImage } from "../../lib/resorts.ts";

/*
 * Resort islands live inside each atoll (islands.resorts / resortIslands / halfResort). Places to
 * stay are published and edited as ordinary entries in the `stays` collection, with their atoll
 * chosen there. This turns the atoll lists into those stay entries — once, then they're the
 * source of truth and edited in the dashboard under /stay.
 */

/** A stay entry for every resort island, with page addresses that don't clash with `taken`. */
export function resortStays(atolls: Atoll[], taken: string[] = []): Stay[] {
  const used = new Set(taken);
  return allResortRecords(atolls).map((r, i) => {
    const base = islandSlug(r.island) || `resort-island-${i + 1}`;
    let slug = base;
    for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;
    used.add(slug);

    return {
      slug,
      name: r.named ? r.resort : r.island,
      type: r.half ? "Hotel" : r.named ? "Resort" : "Resort island",
      atoll: r.atollName,
      atollSlug: r.atollSlug,
      island: r.island,
      price: "Rates on request",
      note: r.named
        ? `${r.resort} on ${r.island}, ${r.atollName}.`
        : `${r.island} is listed by the government as a resort island in ${r.atollName}.`,
      about: r.named
        ? `${r.resort} has ${r.island} to itself, in ${r.atollName}, ${r.atoll.region} Maldives. Check transfer times and what's included before booking.`
        : `${r.island} is listed by the government as a resort island in ${r.atollName}, ${r.atoll.region} Maldives. We have not named the resort yet.`,
      image: resortImage(i, 1600),
      gallery: [],
      amenities: [],
      facts: [
        { label: "Island", value: r.island },
        { label: "Atoll", value: r.atollName },
        { label: "Transfer", value: r.atoll.transfer },
      ],
      reviews: [],
    };
  });
}

/**
 * Fills in the exact atoll (name + page address) for older entries whose `atoll` was free text
 * such as "South Ari" or "Kaafu", so the dashboard dropdown shows the right atoll.
 */
export function withAtollSlugs(atolls: Atoll[], stays: Stay[]): Stay[] {
  return stays.map((s) => {
    if (s.atollSlug) return s;
    const atoll = atolls.find((a) => !a.parent && stayInAtoll(s, a));
    return atoll ? { ...s, atoll: atoll.name, atollSlug: atoll.slug } : s;
  });
}

/** Adds any resort island that isn't in `stays` yet (by atoll + island), keeping existing edits. */
export function mergeResortStays(atolls: Atoll[], stays: Stay[]) {
  const known = new Set(
    stays.filter((s) => s.island).map((s) => `${s.atollSlug ?? s.atoll.toLowerCase()}|${islandSlug(s.island!)}`),
  );
  const added = resortStays(atolls, stays.map((s) => s.slug)).filter((s) => !known.has(`${s.atollSlug}|${islandSlug(s.island!)}`));
  return { stays: [...stays, ...added], added: added.length };
}
