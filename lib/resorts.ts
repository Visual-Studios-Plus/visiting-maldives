import { P, photo, type Atoll } from "./data.ts";

/*
 * The atoll seed still lists resort islands under each atoll (name + island). Every one becomes a
 * "place to stay" entry (prisma/seed/resort-stays.ts) and is edited under /stay from then on.
 * These helpers translate the atoll lists the one time that happens.
 */

const RESORT_PHOTOS = [P.villas, P.jetty, P.resortPool, P.sunDeck, P.sunsetVillas, P.villaRoom, P.beach, P.shallows];

/** Page address for an island: "Kuda Huraa" -> "kuda-huraa". */
export const islandSlug = (island: string) =>
  island
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Deterministic placeholder photo for a resort, by its position in the resort list. */
export const resortImage = (index: number, width = 1400) => photo(RESORT_PHOTOS[index % RESORT_PHOTOS.length], width);

/** One stored resort island, with where it lives inside its atoll's `islands` lists. */
export type ResortRecord = {
  /** the atoll's page address */
  atollSlug: string;
  atollName: string;
  /** which list the entry is stored in */
  kind: "resorts" | "halfResort" | "resortIslands";
  /** position inside that list */
  index: number;
  resort: string;
  island: string;
  named: boolean;
  half: boolean;
};

/**
 * Every resort island in every top-level atoll: named resorts, then the government's resort
 * islands without a name, then part-resort islands. Islands are de-duplicated by page address.
 */
export const allResortRecords = (atolls: Atoll[]): (ResortRecord & { atoll: Atoll })[] =>
  atolls
    .filter((a) => !a.parent)
    .flatMap((atoll) => {
      const seen = new Set<string>();
      const take = (kind: ResortRecord["kind"], named: boolean, half: boolean) => (entry: { island: string; resort: string }, index: number) => {
        const s = islandSlug(entry.island);
        if (!s || seen.has(s)) return null;
        seen.add(s);
        return { atoll, atollSlug: atoll.slug, atollName: atoll.name, kind, index, named, half, resort: entry.resort, island: entry.island };
      };
      return [
        ...(atoll.islands?.resorts ?? []).map(take("resorts", true, false)),
        ...(atoll.islands?.resortIslands ?? []).map((island, index) => take("resortIslands", false, false)({ island, resort: island }, index)),
        ...(atoll.islands?.halfResort ?? []).map(take("halfResort", true, true)),
      ].filter((r): r is ResortRecord & { atoll: Atoll } => r !== null);
    });
