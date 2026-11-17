import {
  eatInAtoll,
  eatOnIsland,
  eatSlug,
  eatWhere,
  photo,
  salonInAtoll,
  salonOnIsland,
  salonSlug,
  salonWhere,
  stayInAtoll,
  stayOnIsland,
  type Atoll,
  type CustomSection,
  type Eat,
  type Guide,
  type IslandEntry,
  type Salon,
  type Stay,
} from "@/lib/data";
import type { ResortCard } from "@/components/PhotoCard";
import type { IslandCardData } from "@/components/IslandCard";
import { islandCards } from "@/lib/islands";

/*
 * Page sections built in the dashboard: which ones belong on a page, and what content a Carousel
 * or Card grid pulls in. Kept apart from the components that draw them.
 */

/** The page a section is being shown on. */
export type SectionPage =
  | { kind: "island"; atoll: Atoll; island: string }
  | { kind: "atoll"; atoll: Atoll }
  | { kind: "custom"; slug: string };

const plain = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** A page address as typed in the dashboard ("Island hopping", "/p/island-hopping") made into its slug. */
export const sectionPageSlug = (s: string) => plain(s.trim()).replace(/^\/?p\//, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Published sections for a page and position, in order. */
export function sectionsFor(all: CustomSection[], page: SectionPage, position?: CustomSection["position"]) {
  return all
    .filter((s) => s.published && (!position || page.kind === "custom" || s.position === position))
    .filter((s) => {
      if (page.kind === "custom") return s.placement === "Its own page" && sectionPageSlug(s.pageSlug ?? "") === page.slug;
      const inAtoll = s.atollSlug ? s.atollSlug === page.atoll.slug : s.atoll === page.atoll.name;
      if (page.kind === "atoll") return s.placement === "Atoll pages" && (s.scope === "Everywhere" || inAtoll);
      return (
        s.placement === "Island pages" &&
        (s.scope === "Everywhere" ||
          (s.scope === "One atoll" && inAtoll) ||
          (s.scope === "One island" && inAtoll && plain(s.island ?? "") === plain(page.island)))
      );
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title));
}

/** All the site content a section can draw from. */
export type SectionData = { atolls: Atoll[]; entries: IslandEntry[]; stays: Stay[]; eats: Eat[]; salons: Salon[]; guides: Guide[] };

/** Where a Carousel or Card grid takes its content from, worked out for this page. */
function areaFor(s: CustomSection, page: SectionPage, atolls: Atoll[]): { atoll?: Atoll; island?: string } {
  if (s.area === "Everywhere") return {};
  if (s.area === "The atoll or island chosen above") {
    const atoll = atolls.find((a) => (s.atollSlug ? a.slug === s.atollSlug : a.name === s.atoll));
    return { atoll, island: atoll && s.island ? s.island : undefined };
  }
  // this page's island or atoll (a page of its own has neither: everywhere)
  if (page.kind === "island") return { atoll: page.atoll, island: page.island };
  if (page.kind === "atoll") return { atoll: page.atoll };
  return {};
}

const kindMatches = (want: string | undefined, ...have: (string | undefined)[]) =>
  !want?.trim() || have.some((h) => h && plain(h).includes(plain(want.trim())));

export type SectionContent = { kind: "cards"; cards: ResortCard[] } | { kind: "islands"; islands: IslandCardData[] };

/** The cards a Carousel or Card grid shows: live content from the site, or the hand-picked items. */
export function sectionContent(s: CustomSection, page: SectionPage, data: SectionData): SectionContent {
  const limit = (xs: unknown[]) => (s.limit && s.limit > 0 ? s.limit : xs.length);
  const { atoll, island } = areaFor(s, page, data.atolls);

  switch (s.source) {
    case "Places to stay": {
      const list = data.stays.filter(
        (x) => (!atoll || stayInAtoll(x, atoll)) && (!island || stayOnIsland(x, island)) && kindMatches(s.kindFilter, x.type),
      );
      return {
        kind: "cards",
        cards: list.slice(0, limit(list)).map((x) => ({
          island: x.island ?? x.atoll,
          resort: x.name,
          label: [x.type, x.island].filter(Boolean).join(" · "),
          cta: "View place",
          image: photo(x.image, 900),
          href: `/stay/${x.slug}`,
        })),
      };
    }
    case "Restaurants": {
      const list = data.eats.filter((x) => (!atoll || eatInAtoll(x, atoll)) && (!island || eatOnIsland(x, island)) && kindMatches(s.kindFilter, x.kind));
      return {
        kind: "cards",
        cards: list.slice(0, limit(list)).map((x) => ({
          island: eatWhere(x),
          resort: x.name,
          label: `${x.kind} · ${eatWhere(x)}`,
          cta: `Order: ${x.dish}`,
          image: photo(x.image, 900),
          href: `/eat-drink/${eatSlug(x)}`,
        })),
      };
    }
    case "Salons": {
      const list = data.salons.filter(
        (x) => (!atoll || salonInAtoll(x, atoll)) && (!island || salonOnIsland(x, island)) && kindMatches(s.kindFilter, x.kind, ...(x.services ?? [])),
      );
      return {
        kind: "cards",
        cards: list.slice(0, limit(list)).map((x) => ({
          island: salonWhere(x),
          resort: x.name,
          label: `${x.kind} · ${salonWhere(x)}`,
          cta: "View salon",
          image: photo(x.image, 900),
          href: `/salons/${salonSlug(x)}`,
        })),
      };
    }
    case "Guides": {
      const where = island ?? atoll?.name.replace(/ Atoll$/, "");
      const list = data.guides.filter((g) => (!where || plain(g.atoll).includes(plain(where))) && kindMatches(s.kindFilter, g.category));
      return {
        kind: "cards",
        cards: list.slice(0, limit(list)).map((g) => ({
          island: g.atoll,
          resort: g.title,
          label: `${g.category} · ${g.atoll}`,
          cta: "Read the guide",
          image: photo(g.image, 900),
          href: `/guides/${g.slug}`,
        })),
      };
    }
    case "Islands": {
      // the islands of the area's atoll (all atolls when everywhere), without the page's own island
      const top = data.atolls.filter((a) => !a.parent && (!atoll || a.slug === atoll.slug));
      const cards = top
        .flatMap((a) => {
          const profiles = data.atolls.filter((p) => p.parent === a.slug);
          return islandCards(
            a,
            profiles,
            data.stays.filter((x) => stayInAtoll(x, a)),
            data.eats.filter((x) => eatInAtoll(x, a)),
            data.salons.filter((x) => salonInAtoll(x, a)),
            data.entries,
          );
        })
        .filter((c) => !(page.kind === "island" && plain(c.name) === plain(page.island)));
      return { kind: "islands", islands: cards.slice(0, limit(cards)) };
    }
    default: {
      // hand-picked items
      const items = s.items ?? [];
      return {
        kind: "cards",
        cards: items.slice(0, limit(items)).map((it) => ({
          island: it.text ?? "",
          resort: it.title,
          label: it.text,
          cta: it.link ? "Read more" : "",
          image: it.image ? photo(it.image, 900) : "",
          href: it.link || "#",
        })),
      };
    }
  }
}
