import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import ResortCarousel from "@/components/ResortCarousel";
import { eatSlug, photo, salonSlug, salonWhere, type Eat, type Salon, type Stay } from "@/lib/data";

/**
 * Places to stay, restaurants and salons as drifting card carousels, one section each, for an
 * atoll or island page. Sections with nothing to show are left out.
 */
export default function PlaceCarousels({
  place,
  stays,
  eats,
  salons,
}: {
  place: string;
  stays: Stay[];
  eats: Eat[];
  salons: Salon[];
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
      })),
    },
    {
      key: "eat",
      eyebrow: "Restaurants & cafés",
      title: "Where to eat in",
      href: "/eat-drink",
      cta: "All places to eat",
      cards: eats.map((e) => ({
        island: e.area,
        resort: e.name,
        label: `${e.kind} · ${e.area}`,
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
