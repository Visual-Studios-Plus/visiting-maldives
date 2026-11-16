import type { Atoll, IslandEntry } from "../../lib/data.ts";
import { ISLAND_FACTS } from "./island-info.ts";

/*
 * Starting entries for the Islands collection: one per inhabited island of each atoll, with a
 * description written from its facts (population, area, distance), its Wikipedia photo where
 * there is one, and, for islands that already have a written-up page, that page's intro.
 * After seeding, staff edit these in the dashboard.
 */

const fmt = (n: number) => n.toLocaleString("en-GB");
const slugify = (s: string) =>
  s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export function islandEntries(atolls: Atoll[]): IslandEntry[] {
  const top = atolls.filter((a) => !a.parent);
  return top.flatMap((atoll) =>
    (atoll.islands?.inhabited ?? []).map((name) => {
      const f = ISLAND_FACTS[atoll.slug]?.[name];
      const page = atolls.find((a) => a.parent === atoll.slug && a.name === name);
      const where = f?.fromMaleKm && f.direction ? `, about ${fmt(f.fromMaleKm)} km ${f.direction} of Malé` : "";
      const people = f?.population ? ` About ${fmt(f.population)} people live here${f.populationYear ? ` (${f.populationYear} figure)` : ""}.` : "";
      const size = f?.areaKm2 ? ` The island covers about ${f.areaKm2 < 1 ? `${Math.round(f.areaKm2 * 100)} hectares` : `${f.areaKm2.toFixed(1)} km²`}.` : "";
      const description = page?.intro ?? `${name} is an inhabited island in ${atoll.name}${where}, home to a Maldivian community.${people}${size}`;
      return {
        slug: slugify(name),
        name,
        atoll: atoll.name,
        atollSlug: atoll.slug,
        kind: "Inhabited" as const,
        tagline: page?.tagline.replace(/ · .*$/, ""),
        description,
        population: f?.population,
        populationYear: f?.populationYear,
        area: f?.areaKm2,
        image: page?.image ?? f?.photo?.src,
        imageCredit: page ? undefined : f?.photo ? `${f.photo.credit}, ${f.photo.licence}` : undefined,
        imageSource: page ? undefined : f?.photo?.source,
        gallery: page?.gallery ?? [],
        source: f ? `https://en.wikipedia.org/wiki/${encodeURIComponent(f.title.replace(/ /g, "_"))}` : undefined,
      };
    }),
  );
}
