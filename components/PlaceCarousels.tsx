import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import ResortCarousel from "@/components/ResortCarousel";
import { eatWhere, eatSlug, photo, salonSlug, salonWhere, type Eat, type Salon, type Stay } from "@/lib/data";

/**
 * Places to stay, restaurants and salons as drifting card carousels, one section each, for an
 * atoll or island page. Sections with nothing to show are left out.
 */
export default function PlaceCarousels({
  place,
  stays,
  eats,
  salons,
  compact = false,
}: {
  place: string;
  stays: Stay[];
  eats: Eat[];
  salons: Salon[];
  /** inside a page column: left-aligned headings, carousels fit the column */
  compact?: boolean;
  /** no longer used: every card has its own page */
  fallbackHref?: string;
}) {
  const groups = [
    {
      key: "stay",
      eyebrow: "Places to stay",
      title: "Where to stay in",
      href: "/stay",
      cta: "All places to stay",
      cards: stays.map((s) => ({
        island: s.island ?? s.name,
        resort: s.name,
        label: s.island ? `${s.type} · ${s.island}` : s.type,
        cta: "View place",
        image: photo(s.image, 900),
        href: `/stay/${s.slug}`,
        stats: { rooms: s.rooms, beds: s.beds, berths: s.berths, cabins: s.type === "Liveaboard" },
      })),
    },
    {
      key: "eat",
      eyebrow: "Restaurants & cafés",
      title: "Where to eat in",
      href: "/eat-drink",
      cta: "All places to eat",
      cards: eats.map((e) => ({
        island: e.island ?? eatWhere(e),
        resort: e.name,
        label: `${e.kind} · ${eatWhere(e)}`,
        cta: "View restaurant",
        image: photo(e.image, 900),
        href: `/eat-drink/${eatSlug(e)}`,
      })),
    },
    {
      key: "salons",
      eyebrow: "Salons & spas",
      title: "Salons and spas in",
      href: "/salons",
      cta: "All salons & spas",
      cards: salons.map((s) => ({
        island: s.island ?? salonWhere(s),
        resort: s.name,
        label: `${s.kind} · ${salonWhere(s)}`,
        cta: "View salon",
        image: photo(s.image, 900),
        href: `/salons/${salonSlug(s)}`,
      })),
    },
  ].filter((g) => g.cards.length);

  if (compact)
    return (
      <>
        {groups.map((g) => (
          <section key={g.key} data-reveal className="mt-14">
            <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
              <div>
                <p className="eyebrow text-driftwood">
                  {g.eyebrow} · {g.cards.length}
                </p>
                <h2 className="mt-1 text-[24px] leading-8 font-semibold tracking-tight">
                  {g.title} {place}
                </h2>
              </div>
              <Link href={g.href} className="inline-flex min-h-11 items-center text-[14px] font-medium text-red hover:underline">
                {g.cta} →
              </Link>
            </div>
            <ResortCarousel resorts={g.cards} inColumn />
          </section>
        ))}
      </>
    );

  return (
    <>
      {groups.map((g) => (
        <Reveal key={g.key} as="section" className="pb-12 lg:pb-16">
          <div className="container-vm">
            <SectionHead eyebrow={`${g.eyebrow} · ${g.cards.length}`} title={g.title} accent={place} href={g.href} cta={g.cta} />
          </div>
          <ResortCarousel resorts={g.cards} />
        </Reveal>
      ))}
    </>
  );
}
