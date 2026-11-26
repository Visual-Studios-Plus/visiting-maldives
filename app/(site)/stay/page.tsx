import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import { P, photo, stayInAtoll, type Atoll } from "@/lib/data";
import { getCollections } from "@/server/content/store";
import ResortFinder, { type ResortItem } from "@/components/ResortFinder";

export const metadata: Metadata = { title: "Where to stay" };

export default async function Stay() {
  const { stays, atolls: allAtolls } = await getCollections(["stays", "atolls"]);
  const atolls = allAtolls.filter((a) => !a.parent);

  // every stay and resort is published at /stay/<slug>; group them by their atoll here
  const resolveAtoll = (stay: (typeof stays)[number]): Atoll | undefined => atolls.find((a) => stayInAtoll(stay, a));
  const items: ResortItem[] = stays
    .map((s) => {
      const atoll = resolveAtoll(s);
      return {
        resort: s.name,
        island: s.island ?? (s.type === "Resort island" ? s.name : ""),
        named: s.type !== "Resort island",
        half: s.type === "Hotel",
        label: s.type,
        isResort: s.type === "Resort" || s.type === "Resort island" || s.type === "Hotel",
        atollSlug: atoll?.slug ?? "other",
        atollName: atoll?.name ?? s.atoll,
        region: atoll?.region ?? "Central",
        href: `/stay/${s.slug}`,
        image: photo(s.image, 700),
      } satisfies ResortItem;
    })
    .sort((a, b) => {
      const ai = atolls.findIndex((x) => x.slug === a.atollSlug);
      const bi = atolls.findIndex((x) => x.slug === b.atollSlug);
      return ai - bi || a.resort.localeCompare(b.resort);
    });

  return (
    <>
      <PageHero image={P.villas} eyebrow="Where to stay" title="Where" accent="to stay." intro="Every licensed resort, hotel, guesthouse, homestay, liveaboard and yacht marina, atoll by atoll. Partner listings are always labelled." />
      <Reveal as="section" className="container-vm py-12 lg:py-24">
        <SectionHead eyebrow="Places to stay" title="Every place to stay," accent="atoll by atoll" />
        <p data-reveal className="mx-auto mt-4 max-w-2xl text-center text-driftwood">
          Where you stay shapes the whole trip. These are the resorts, hotels, guesthouses, homestays, liveaboards and yacht marinas licensed by the
          Ministry of Tourism, arranged atoll by atoll. Filter by type, or search by name, island or atoll.
        </p>
        <div className="mt-10">
          <ResortFinder resorts={items} atolls={atolls.map((a) => ({ slug: a.slug, name: a.name }))} />
        </div>
      </Reveal>
    </>
  );
}
