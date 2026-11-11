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

/** A resort island plus the index that picks its photo and page address. */
export type ResortEntry = ResortIsland & { index: number };

export const atollResorts = (atoll: Atoll): ResortEntry[] =>
  (atoll.islands?.resorts ?? []).map((resort, index) => ({ ...resort, index }));

export const findResort = (atoll: Atoll, island: string): ResortEntry | null => {
  const index = (atoll.islands?.resorts ?? []).findIndex((r) => islandSlug(r.island) === island);
  return index === -1 ? null : { ...atoll.islands!.resorts[index], index };
};
