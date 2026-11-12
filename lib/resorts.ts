import { P, photo, type Atoll, type ResortIsland } from "@/lib/data";

/*
 * Resort islands are listed inside each atoll (name + island only), so their pages are derived
 * from that data. Photos are placeholders from the Maldives library until each resort adds its
 * own; the page address is made from the island name.
 */

const RESORT_PHOTOS = [P.villas, P.jetty, P.resortPool, P.sunDeck, P.sunsetVillas, P.villaRoom, P.beach, P.shallows];

/** Page address for a resort island: "Kuda Huraa" -> "kuda-huraa". */
export const islandSlug = (island: string) =>
  island
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Deterministic placeholder photo for a resort, by its position in the atoll list. */
export const resortImage = (index: number, width = 1400) => photo(RESORT_PHOTOS[index % RESORT_PHOTOS.length], width);

/**
 * A resort island plus the index that picks its photo and page address.
 * `named` is false for islands the government lists as resort islands but whose resort we have
 * not named yet; their `resort` is then the island name, and pages say the name isn't listed.
 */
export type ResortEntry = ResortIsland & { index: number; named: boolean };

export const atollResorts = (atoll: Atoll): ResortEntry[] => {
  const named = (atoll.islands?.resorts ?? []).map((r) => ({ ...r, named: true }));
  const unnamed = (atoll.islands?.resortIslands ?? []).map((island) => ({ island, resort: island, named: false }));
  const seen = new Set<string>();
  return [...named, ...unnamed]
    .filter((r) => {
      const s = islandSlug(r.island);
      if (!s || seen.has(s)) return false; // one page per island address
      seen.add(s);
      return true;
    })
    .map((r, index) => ({ ...r, index }));
};

export const findResort = (atoll: Atoll, island: string): ResortEntry | null =>
  atollResorts(atoll).find((r) => islandSlug(r.island) === island) ?? null;
