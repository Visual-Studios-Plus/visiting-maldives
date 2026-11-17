import { eatOnIsland, eatSlug, salonOnIsland, salonSlug, stayOnIsland, type Atoll, type Eat, type IslandEntry, type Salon, type Stay } from "@/lib/data";
import { ISLAND_COORDS } from "@/prisma/seed/island-coords";
import { islandSlug } from "@/lib/resorts";
import type { IslandCardData } from "@/components/IslandCard";
import { ISLAND_FACTS, type IslandFacts } from "@/prisma/seed/island-info";

/*
 * Islands: the dashboard's Islands collection (description, population, photos) wins; facts
 * fetched from Wikipedia (island-info.ts) fill in for islands without an entry yet.
 */

const k = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z]/g, "");

/** The dashboard entries for this atoll's islands. */
export const atollEntries = (atoll: Pick<Atoll, "slug" | "name">, entries: IslandEntry[]) =>
  entries.filter((e) => (e.atollSlug ? e.atollSlug === atoll.slug : e.atoll === atoll.name));

/** One island's dashboard entry, by name. */
export const findEntry = (atoll: Pick<Atoll, "slug" | "name">, name: string, entries: IslandEntry[]) =>
  atollEntries(atoll, entries).find((e) => k(e.name) === k(name));

/** The atoll's inhabited islands: its own list, plus inhabited islands added in the dashboard. */
export const inhabitedNames = (atoll: Atoll, entries: IslandEntry[]) => {
  const names = [...(atoll.islands?.inhabited ?? [])];
  for (const e of atollEntries(atoll, entries)) if (e.kind === "Inhabited" && !names.some((n) => k(n) === k(e.name))) names.push(e.name);
  return names;
};

/**
 * Page address for an island: every island has its page under its atoll,
 * /atolls/<atoll>/islands/<island>. (`profiles` is kept for callers; older single-island atoll
 * entries now redirect there.)
 */
export const islandHref = (atoll: Atoll, name: string, _profiles: Atoll[] = [], entries: IslandEntry[] = []) =>
  `/atolls/${atoll.slug}/islands/${findEntry(atoll, name, entries)?.slug || islandSlug(name)}`;

/** Photos for islands without their own: the atoll's cover and gallery, in turn. */
const atollPhotos = (atoll: Atoll) => [atoll.image, ...(atoll.gallery ?? []).map((g) => g.src)];

/** Facts from the island's Wikipedia article, when it could be matched. */
export const islandFacts = (atollSlug: string, name: string): IslandFacts | undefined => ISLAND_FACTS[atollSlug]?.[name];

const fmt = (n: number) => n.toLocaleString("en-GB");
const areaText = (km2: number, long = false) =>
  km2 < 1 ? `${Math.round(km2 * 100)} ${long ? "hectares" : "ha"}` : `${km2.toFixed(1)} km²`;

/** The island's description: its dashboard entry, else one written from its facts (no copied text). */
export function describeIsland(atoll: Atoll, name: string, entry?: IslandEntry, f = islandFacts(atoll.slug, name)): string {
  if (entry?.description) return entry.description;
  const where = f?.fromMaleKm && f.direction ? `, about ${fmt(f.fromMaleKm)} km ${f.direction} of Malé` : "";
  const people = f?.population ? ` About ${fmt(f.population)} people live here${f.populationYear ? ` (${f.populationYear} figure)` : ""}.` : "";
  const size = f?.areaKm2 ? ` The island covers about ${areaText(f.areaKm2, true)}.` : "";
  return `${name} is an inhabited island in ${atoll.name}${where}, home to a Maldivian community.${people}${size}`;
}

/** Population, year and area for an island: its dashboard entry first, then its facts. */
export const islandNumbers = (atoll: Atoll, name: string, entry?: IslandEntry) => {
  const f = islandFacts(atoll.slug, name);
  return {
    population: entry?.population ?? f?.population,
    populationYear: entry?.population ? entry.populationYear : f?.populationYear,
    area: entry?.area ?? f?.areaKm2,
    fromMaleKm: f?.fromMaleKm,
  };
};

/** The island's cover photo and its credit: its dashboard entry, else its Wikipedia photo. */
export const islandPhoto = (atoll: Atoll, name: string, entry?: IslandEntry) => {
  if (entry?.image) return { src: entry.image, credit: entry.imageCredit, source: entry.imageSource };
  const p = islandFacts(atoll.slug, name)?.photo;
  return p ? { src: p.src, credit: `${p.credit}, ${p.licence}`, source: p.source } : undefined;
};

/** Where an island is: its dashboard entry's map position, else the government register's. */
export const islandCoords = (atollSlug: string, name: string, entry?: IslandEntry): [number, number] | undefined =>
  typeof entry?.lat === "number" && typeof entry?.lng === "number"
    ? [entry.lat, entry.lng]
    : (ISLAND_COORDS[atollSlug]?.[name] ?? Object.entries(ISLAND_COORDS[atollSlug] ?? {}).find(([n]) => k(n) === k(name))?.[1]);

/** Distance in km between two points (haversine). */
export const kmBetween = (a: [number, number], b: [number, number]) => {
  const r = (d: number) => (d * Math.PI) / 180;
  const h = Math.sin(r(b[0] - a[0]) / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(r(b[1] - a[1]) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
};

export type NearbyIsland = { name: string; atoll: string; km: number; href: string };

/**
 * The closest other local islands and resort islands to a point, across all atolls, for "nearby"
 * lists. Resort islands link to their place-to-stay page when one exists.
 */
export function nearby(
  from: [number, number],
  self: string,
  atolls: Atoll[],
  entries: IslandEntry[],
  stays: Stay[],
  limit = 4,
): { islands: NearbyIsland[]; resorts: (NearbyIsland & { resort?: string })[] } {
  const top = atolls.filter((a) => !a.parent);
  const islands: NearbyIsland[] = [];
  const resorts: (NearbyIsland & { resort?: string })[] = [];
  for (const a of top) {
    const profiles = atolls.filter((p) => p.parent === a.slug);
    for (const name of inhabitedNames(a, entries)) {
      if (k(name) === k(self)) continue;
      const c = islandCoords(a.slug, name, findEntry(a, name, entries));
      if (c) islands.push({ name, atoll: a.name, km: kmBetween(from, c), href: islandHref(a, name, profiles, entries) });
    }
    const resortNames = [...(a.islands?.resorts ?? []).map((r) => r.island), ...(a.islands?.resortIslands ?? [])];
    for (const name of new Set(resortNames)) {
      const c = islandCoords(a.slug, name);
      if (!c) continue;
      const stay = stays.find((s) => s.island && k(s.island) === k(name) && (!s.atollSlug || s.atollSlug === a.slug));
      if (!stay) continue; // only resorts with a page to send people to
      resorts.push({ name, atoll: a.name, km: kmBetween(from, c), href: `/stay/${stay.slug}`, resort: stay.type === "Resort" ? stay.name : undefined });
    }
  }
  const byKm = <T extends { km: number }>(xs: T[]) => xs.sort((x, y) => x.km - y.km).slice(0, limit);
  return { islands: byKm(islands), resorts: byKm(resorts) };
}

/** Places on an island for its map: those with a map position, and those still without one. */
export function mapPlaces(stays: Stay[], eats: Eat[], salons: Salon[]) {
  const all = [
    ...stays.map((s) => ({ lat: s.lat, lng: s.lng, name: s.name, kind: "Stay" as const, href: `/stay/${s.slug}` })),
    ...eats.map((e) => ({ lat: e.lat, lng: e.lng, name: e.name, kind: "Eat" as const, href: `/eat-drink/${eatSlug(e)}` })),
    ...salons.map((s) => ({ lat: s.lat, lng: s.lng, name: s.name, kind: "Salon" as const, href: `/salons/${salonSlug(s)}` })),
  ];
  const has = (p: (typeof all)[number]): p is (typeof all)[number] & { lat: number; lng: number } => typeof p.lat === "number" && typeof p.lng === "number";
  return { placed: all.filter(has), unplaced: all.filter((p) => !has(p)).map((p) => ({ name: p.name, href: p.href })) };
}

/** Each atoll's official (natural-atoll) name and capital island. */
const ATOLL_INFO: Record<string, { official: string; capital: string }> = {
  "haa-alif": { official: "Thiladhunmathi Uthuruburi", capital: "Dhidhdhoo" },
  "haa-dhaalu": { official: "Thiladhunmathi Dhekunuburi", capital: "Kulhudhuffushi" },
  shaviyani: { official: "Miladhunmadulu Uthuruburi", capital: "Funadhoo" },
  noonu: { official: "Miladhunmadulu Dhekunuburi", capital: "Manadhoo" },
  raa: { official: "Maalhosmadulu Uthuruburi", capital: "Ungoofaaru" },
  baa: { official: "Maalhosmadulu Dhekunuburi", capital: "Eydhafushi" },
  lhaviyani: { official: "Faadhippolhu", capital: "Naifaru" },
  male: { official: "Malé Atholhu (Kaafu)", capital: "Thulusdhoo (Malé is the national capital)" },
  "alif-alif": { official: "Ari Atholhu Uthuruburi", capital: "Rasdhoo" },
  "alif-dhaal": { official: "Ari Atholhu Dhekunuburi", capital: "Mahibadhoo" },
  vaavu: { official: "Felidhe Atholhu", capital: "Felidhoo" },
  meemu: { official: "Mulaku Atholhu", capital: "Muli" },
  faafu: { official: "Nilandhe Atholhu Uthuruburi", capital: "Nilandhoo" },
  dhaalu: { official: "Nilandhe Atholhu Dhekunuburi", capital: "Kudahuvadhoo" },
  thaa: { official: "Kolhumadulu", capital: "Veymandoo" },
  laamu: { official: "Haddhunmathi", capital: "Fonadhoo" },
  "gaafu-alif": { official: "Huvadhu Atholhu Uthuruburi", capital: "Villingili" },
  "gaafu-dhaalu": { official: "Huvadhu Atholhu Dhekunuburi", capital: "Thinadhoo" },
  fuvahmulah: { official: "Gnaviyani (Fuvahmulah)", capital: "Fuvahmulah" },
  addu: { official: "Addu Atholhu (Seenu)", capital: "Hithadhoo" },
};

/**
 * Key facts for an atoll's "at a glance" box. Population adds up the island figures we have
 * (most from 2022), so it is shown as approximate.
 */
export function atollFactRows(atoll: Atoll, resortCount: number, entries: IslandEntry[] = []) {
  const info = ATOLL_INFO[atoll.slug];
  const names = inhabitedNames(atoll, entries);
  const pops = names.map((n) => islandNumbers(atoll, n, findEntry(atoll, n, entries)).population ?? 0);
  const people = pops.reduce((a, b) => a + b, 0);
  const counted = pops.filter(Boolean).length;
  return [
    info ? { label: "Official name", value: info.official } : null,
    info ? { label: "Capital", value: info.capital } : null,
    people ? { label: "Population", value: `about ${fmt(Math.round(people / 100) * 100)}${counted < names.length ? ` (${counted} of ${names.length} islands)` : ""}` } : null,
    names.length ? { label: "Inhabited islands", value: String(names.length) } : null,
    atoll.islands ? { label: "Uninhabited islands", value: String(atoll.islands.uninhabited.length) } : null,
    resortCount ? { label: "Resort islands", value: String(resortCount) } : null,
    { label: "Region", value: `${atoll.region} Maldives` },
    { label: "Getting there", value: atoll.transfer },
  ].filter((x): x is { label: string; value: string } => !!x);
}

/** Key facts for an island's "at a glance" strip. */
export function islandFactRows(atoll: Atoll, name: string, entry?: IslandEntry) {
  const n = islandNumbers(atoll, name, entry);
  return [
    n.population ? { label: "Population", value: `${fmt(n.population)}${n.populationYear ? ` (${n.populationYear})` : ""}` } : null,
    n.area ? { label: "Area", value: areaText(n.area) } : null,
    n.fromMaleKm ? { label: "From Malé", value: `${fmt(n.fromMaleKm)} km` } : null,
    { label: "Atoll", value: atoll.name },
  ].filter((x): x is { label: string; value: string } => !!x);
}

/**
 * One card per inhabited island of an atoll, with how many places to stay, eat and salons are
 * listed on it. `profiles`: the atoll's written-up island guides; `entries`: the Islands collection.
 */
export function islandCards(atoll: Atoll, profiles: Atoll[], stays: Stay[], eats: Eat[], salons: Salon[], entries: IslandEntry[] = []): IslandCardData[] {
  const photos = atollPhotos(atoll);
  return inhabitedNames(atoll, entries).map((name, i) => {
    const page = profiles.find((p) => p.name === name);
    const entry = findEntry(atoll, name, entries);
    const own = page?.image ?? islandPhoto(atoll, name, entry)?.src;
    const pop = islandNumbers(atoll, name, entry).population;
    return {
      name,
      href: islandHref(atoll, name, profiles, entries),
      subtitle: entry?.tagline || page?.tagline.replace(/ · .*$/, "") || (pop ? `Population ${fmt(pop)}` : atoll.name),
      badge: page ? "Island guide" : "Local island",
      starred: !!page,
      atoll: atoll.name,
      image: own ?? photos[i % photos.length],
      // honest alt: only the island's own photo shows the island itself
      alt: page ? (page.gallery?.[0]?.alt ?? name) : own ? name : `${atoll.name} (not ${name} itself)`,
      stays: stays.filter((s) => stayOnIsland(s, name)).length,
      eats: eats.filter((e) => eatOnIsland(e, name)).length,
      salons: salons.filter((s) => salonOnIsland(s, name)).length,
    };
  });
}
