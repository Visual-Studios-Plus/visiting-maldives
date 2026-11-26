import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import ResortCarousel, { type ResortCard } from "@/components/ResortCarousel";
import { photo, type Vessel } from "@/lib/data";

/**
 * Licensed liveaboard vessels as photo cards, in two sections: the ones based in this atoll,
 * then the ones that cruise across the Maldives. Nothing shows when there are no vessels.
 */
export default function VesselCarousel({ place, vessels }: { place: string; vessels: Vessel[] }) {
  const card = (v: Vessel): ResortCard => ({
    island: v.atoll ?? "Across the Maldives",
    resort: v.name,
    label: v.atollSlug ? `Liveaboard · ${v.atoll}` : "Liveaboard · Across the Maldives",
    image: photo(v.image, 900),
    stats: { ...(v.cabins ? { rooms: v.cabins } : {}), ...(v.beds ? { beds: v.beds } : {}), cabins: true },
    footnote: v.operator ? `Operated by ${v.operator}` : v.licensed ? "Licensed by the Ministry of Tourism" : undefined,
  });

  const groups = [
    {
      key: "based-here",
      eyebrow: `Liveaboards · ${vessels.filter((v) => v.atollSlug).length}`,
      title: "Liveaboards based in",
      accent: place,
      cards: vessels.filter((v) => v.atollSlug).map(card),
    },
    {
      key: "across",
      eyebrow: `Liveaboards · ${vessels.filter((v) => !v.atollSlug).length}`,
      title: "Liveaboards across",
      accent: "the Maldives",
      cards: vessels.filter((v) => !v.atollSlug).map(card),
    },
  ].filter((g) => g.cards.length);

  return (
    <>
      {groups.map((g) => (
        <Reveal key={g.key} as="section" className="pb-12 lg:pb-16">
          <div className="container-vm">
            <SectionHead eyebrow={g.eyebrow} title={g.title} accent={g.accent} />
          </div>
          <ResortCarousel resorts={g.cards} />
        </Reveal>
      ))}
    </>
  );
}
