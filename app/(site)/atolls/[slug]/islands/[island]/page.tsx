import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import IslandCarousel from "@/components/IslandCarousel";
import PlaceCarousels from "@/components/PlaceCarousels";
import { type Atoll, type IslandEntry, placeInAtoll, placeOnIsland, salonInAtoll, salonOnIsland, stayInAtoll, stayOnIsland } from "@/lib/data";
import { getAtoll, getAtolls, getEats, getIslands, getSalons, getStays } from "@/lib/content/store";
import { atollEntries, describeIsland, findEntry, inhabitedNames, islandCards, islandFactRows, islandPhoto } from "@/lib/islands";
import PhotoGallery from "@/components/PhotoGallery";
import { islandSlug } from "@/lib/resorts";

// Every island page is prerendered from generateStaticParams, so a blocking route is fine here
export const instant = false;

/** Every island with a page in an atoll: its inhabited islands plus any island added in the dashboard. */
const pagesOf = (atoll: Atoll, entries: IslandEntry[]) => {
  const names = inhabitedNames(atoll, entries);
  for (const e of atollEntries(atoll, entries)) if (!names.includes(e.name)) names.push(e.name);
  return names.map((name) => ({ name, slug: findEntry(atoll, name, entries)?.slug || islandSlug(name) }));
};

/** The atoll, the island's name and its dashboard entry for a page address, or null. */
async function find(slug: string, island: string) {
  const atoll = await getAtoll(slug);
  if (!atoll || atoll.parent) return null;
  const entries = await getIslands();
  const hit = pagesOf(atoll, entries).find((p) => p.slug === island);
  return hit ? { atoll, name: hit.name, entry: findEntry(atoll, hit.name, entries), entries } : null;
}

export async function generateStaticParams() {
  const [atolls, entries] = await Promise.all([getAtolls(), getIslands()]);
  const params = atolls
    .filter((a) => !a.parent)
    .flatMap((a) => pagesOf(a, entries).map((p) => ({ slug: a.slug, island: p.slug })))
    .filter((p) => p.island);
  // With Cache Components the list may not be empty: an unseeded store yields a "not found" page
  return params.length ? params : [{ slug: "not-seeded", island: "not-seeded" }];
}

export async function generateMetadata({ params }: PageProps<"/atolls/[slug]/islands/[island]">): Promise<Metadata> {
  const { slug, island } = await params;
  const found = await find(slug, island);
  if (!found) return { title: "Island" };
  return { title: `${found.name}, ${found.atoll.name}`, description: `Places to stay, eat and relax on ${found.name}, a local island in ${found.atoll.name}.` };
}

export default async function IslandPage({ params }: PageProps<"/atolls/[slug]/islands/[island]">) {
  const { slug, island } = await params;
  const found = await find(slug, island);
  if (!found) notFound();
  const { atoll, name, entry, entries } = found;
  const photo = islandPhoto(atoll, name, entry);
  const kind = entry?.kind && entry.kind !== "Inhabited" ? entry.kind : "Local island";

  const all = await getAtolls();
  const profiles = all.filter((a) => a.parent === atoll.slug);
  // an island with its own written-up page lives there
  const own = profiles.find((p) => p.name === name);
  if (own) permanentRedirect(`/atolls/${own.slug}`);

  const [allStays, allEats, allSalons] = await Promise.all([getStays(), getEats(), getSalons()]);
  const atollStays = allStays.filter((s) => stayInAtoll(s, atoll));
  const atollEats = allEats.filter((e) => placeInAtoll(e.area, atoll));
  const atollSalons = allSalons.filter((s) => salonInAtoll(s, atoll));
  const stays = atollStays.filter((s) => stayOnIsland(s, name));
  const eats = atollEats.filter((e) => placeOnIsland(e.area, name));
  const salons = atollSalons.filter((s) => salonOnIsland(s, name));
  const listed = stays.length + eats.length + salons.length;

  const cards = islandCards(atoll, profiles, atollStays, atollEats, atollSalons, entries);
  const here = cards.findIndex((c) => c.name === name);
  // the atoll's other islands, starting with the next one and wrapping round
  const more = cards.length > 1 ? Array.from({ length: cards.length - 1 }, (_, i) => cards[(here + 1 + i) % cards.length]) : [];

  return (
    <>
      <PageHero
        image={photo?.src ?? atoll.image}
        eyebrow={`${atoll.name} · ${kind}`}
        title={name}
        intro={entry?.tagline || describeIsland(atoll, name, entry)}
      />
      <div className="container-vm flex flex-wrap items-baseline justify-between gap-3 pt-8">
        <Link href={`/atolls/${atoll.slug}`} className="font-mono text-[13px] text-red hover:underline">
          ← All islands of {atoll.name}
        </Link>
        <p className="text-[12px] text-driftwood">
          {photo ? (
            photo.credit ? (
              <>
                Photo:{" "}
                {photo.source ? (
                  <a href={photo.source} target="_blank" rel="noopener noreferrer" className="hover:text-ink hover:underline">
                    {photo.credit}
                  </a>
                ) : (
                  photo.credit
                )}
              </>
            ) : null
          ) : (
            <>Photo: {atoll.name} (not {name} itself)</>
          )}
        </p>
      </div>

      <Reveal as="section" className="container-vm grid gap-10 py-10 lg:grid-cols-[1fr_340px] lg:py-14">
        <div data-reveal className="max-w-2xl">
          <h2 className="text-[26px] leading-8 font-semibold tracking-tight lg:text-[28px]">About {name}</h2>
          <p className="mt-3 text-[17px] leading-[28px]">{describeIsland(atoll, name, entry)}</p>
          <p className="mt-4 text-[17px] leading-[28px]">{atoll.intro}</p>
          <p className="mt-4 text-[15px] leading-[24px] text-driftwood">
            Local islands are home to Maldivian communities: dress modestly away from marked bikini beaches, and alcohol is not served.
          </p>
          {entry?.source ? (
            <p className="mt-4 text-[13px] text-driftwood">
              <a href={entry.source} target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
                Source of these facts
              </a>
            </p>
          ) : null}
          {entry?.gallery?.length ? <PhotoGallery photos={entry.gallery} title={`${name} in photos`} /> : null}
        </div>
        <aside data-reveal className="h-max rounded-card bg-ink p-6 text-white lg:sticky lg:top-24">
          <p className="eyebrow text-white/60">At a glance</p>
          <dl className="mt-4 divide-y divide-white/10">
            {[
              ...islandFactRows(atoll, name, entry),
              { label: "Getting there", value: atoll.transfer },
              { label: "Listed here", value: `${stays.length} stay · ${eats.length} eat · ${salons.length} salons` },
            ].map((f) => (
              <div key={f.label} className="flex justify-between gap-4 py-3">
                <dt className="text-white/60">{f.label}</dt>
                <dd className="text-right font-mono text-[14px]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </Reveal>

      <PlaceCarousels place={name} stays={stays} eats={eats} salons={salons} fallbackHref={`/atolls/${atoll.slug}`} />

      {listed === 0 ? (
        <section className="container-vm pb-12 lg:pb-16">
          <div className="rounded-card bg-shell p-8 text-center">
            <p className="text-[20px] font-semibold">Nothing listed on {name} yet</p>
            <p className="mx-auto mt-2 max-w-xl text-driftwood">
              We have no places to stay, restaurants or salons on {name} yet. See what&rsquo;s listed elsewhere in {atoll.name}.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href={`/atolls/${atoll.slug}`} className="inline-flex min-h-11 items-center rounded-control bg-ink px-5 font-semibold text-white hover:bg-red">
                Explore {atoll.name}
              </Link>
              <Link href="/stay" className="inline-flex min-h-11 items-center rounded-control border border-line px-5 font-medium hover:border-red hover:text-red">
                All places to stay
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {more.length ? (
        <Reveal as="section" className="container-vm border-t border-line py-12 lg:py-20">
          <SectionHead eyebrow="Nearby" title="More islands of" accent={atoll.name} href={`/atolls/${atoll.slug}`} cta="All islands" />
          <div className="mt-10">
            <IslandCarousel islands={more} label={`More islands of ${atoll.name}`} />
          </div>
        </Reveal>
      ) : null}
    </>
  );
}
