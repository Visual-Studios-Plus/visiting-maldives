import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import IslandCarousel from "@/components/IslandCarousel";
import PlaceCarousels from "@/components/PlaceCarousels";
import { eatInAtoll, eatOnIsland, type Atoll, type IslandEntry, salonInAtoll, salonOnIsland, stayInAtoll, stayOnIsland } from "@/lib/data";
import { getCollections } from "@/server/content/store";
import { atollEntries, describeIsland, findEntry, inhabitedNames, islandCards, islandCoords, islandFactRows, islandPhoto, mapPlaces, nearby } from "@/lib/islands";
import GuideColumns from "@/components/GuideColumns";
import MapPanel from "@/components/MapPanel";
import CustomSections from "@/components/blocks/CustomSections";
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
function findIn(atolls: Atoll[], entries: IslandEntry[], slug: string, island: string) {
  const atoll = atolls.find((a) => a.slug === slug);
  if (!atoll || atoll.parent) return null;
  const hit = pagesOf(atoll, entries).find((p) => p.slug === island);
  return hit ? { atoll, name: hit.name, entry: findEntry(atoll, hit.name, entries), entries } : null;
}

async function find(slug: string, island: string) {
  const { atolls, islands } = await getCollections(["atolls", "islands"]);
  return findIn(atolls, islands, slug, island);
}

export async function generateStaticParams() {
  const { atolls, islands: entries } = await getCollections(["atolls", "islands"]);
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
  // One database round trip for all five collections the page reads.
  const {
    atolls: all,
    islands: entries,
    stays: allStays,
    eats: allEats,
    salons: allSalons,
  } = await getCollections(["atolls", "islands", "stays", "eats", "salons"]);
  const found = findIn(all, entries, slug, island);
  if (!found) notFound();
  const { atoll, name, entry } = found;
  const photo = islandPhoto(atoll, name, entry);
  const kind = entry?.kind && entry.kind !== "Inhabited" ? entry.kind : "Local island";

  const profiles = all.filter((a) => a.parent === atoll.slug);
  const atollStays = allStays.filter((s) => stayInAtoll(s, atoll));
  const atollEats = allEats.filter((e) => eatInAtoll(e, atoll));
  const atollSalons = allSalons.filter((s) => salonInAtoll(s, atoll));
  const stays = atollStays.filter((s) => stayOnIsland(s, name));
  const eats = atollEats.filter((e) => eatOnIsland(e, name));
  const salons = atollSalons.filter((s) => salonOnIsland(s, name));
  const listed = stays.length + eats.length + salons.length;

  // map and "nearby": the island's position, its places with a position, the closest islands and resorts
  const coords = islandCoords(atoll.slug, name, entry);
  const { placed, unplaced } = mapPlaces(stays, eats, salons);
  const close = coords ? nearby(coords, name, all, entries, allStays) : { islands: [], resorts: [] };
  const km = (n: number) => (n < 10 ? n.toFixed(1) : Math.round(n).toString());

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
        <Link href={`/atolls/${atoll.slug}`} className="inline-flex min-h-11 items-center font-mono text-[13px] text-red hover:underline">
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

      <GuideColumns
        glance={[
          ...islandFactRows(atoll, name, entry),
          { label: "Getting there", value: atoll.transfer },
          ...(close.islands[0] ? [{ label: "Nearest island", value: `${close.islands[0].name} · ${km(close.islands[0].km)} km` }] : []),
          { label: "Listed here", value: `${stays.length} stay · ${eats.length} eat · ${salons.length} salons` },
        ]}
        side={coords ? <MapPanel name={name} center={coords} places={placed} unplaced={unplaced} /> : null}
      >
        <div data-reveal className="max-w-2xl">
          <h2 className="text-[26px] leading-8 font-semibold tracking-tight lg:text-[28px]">About {name}</h2>
          <p className="mt-3 text-[17px] leading-[28px]">{describeIsland(atoll, name, entry)}</p>
          {entry?.highlights?.length ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {entry.highlights.map((h) => (
                <li key={h} className="rounded-full bg-shell px-3.5 py-1.5 text-[14px] font-medium">
                  {h}
                </li>
              ))}
            </ul>
          ) : null}
          {(entry?.sections ?? []).map((sec, i) => (
            <div key={sec.heading} className="mt-10">
              <p className="font-mono text-[12px] text-red">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 text-[22px] leading-7 font-semibold tracking-tight">{sec.heading}</h3>
              <p className="mt-2 text-[17px] leading-[28px] whitespace-pre-line">{sec.text}</p>
            </div>
          ))}
          <div className="mt-10">
            <h3 className="text-[22px] leading-7 font-semibold tracking-tight">Getting there</h3>
            <p className="mt-2 text-[17px] leading-[28px] whitespace-pre-line">
              {entry?.gettingThere ||
                `From Malé, the usual way into ${atoll.name} is: ${atoll.transfer}. Your guesthouse or hotel can arrange the last leg by speedboat or public ferry.`}
            </p>
          </div>
          <div className="mt-10">
            <h3 className="text-[22px] leading-7 font-semibold tracking-tight">Good to know</h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[16px] leading-[26px]">
              <li>{name} is home to a Maldivian community: dress modestly away from marked bikini beaches.</li>
              <li>Alcohol isn&rsquo;t served on local islands; resorts and liveaboards are the exception.</li>
              <li>Shops and cafés close briefly for prayer times, and for longer around Friday midday prayers.</li>
              <li>Small islands may not have a cash machine, so bring some cash (US dollars and Maldivian rufiyaa).</li>
            </ul>
          </div>
          <p className="mt-10 text-[17px] leading-[28px] text-driftwood">{atoll.intro}</p>
          {entry?.source ? (
            <p className="mt-4 text-[13px] text-driftwood">
              <a href={entry.source} target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
                Source of these facts
              </a>
            </p>
          ) : null}
          {entry?.gallery?.length ? <PhotoGallery photos={entry.gallery} title={`${name} in photos`} /> : null}
        </div>
        {/* places on the island, in the left column under the write-up */}
        <PlaceCarousels place={name} stays={stays} eats={eats} salons={salons} compact />
        {/* sections built in the dashboard (Page sections) */}
        <CustomSections page={{ kind: "island", atoll, island: name }} position="Main column" variant="column" />
      </GuideColumns>

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

      <CustomSections page={{ kind: "island", atoll, island: name }} position="Full width, at the end" variant="wide" />

      {more.length ? (
        <Reveal as="section" className="container-vm border-t border-line py-12 lg:py-20">
          <SectionHead eyebrow="Nearby" title="More islands of" accent={atoll.name} />
          <div className="mt-10">
            <IslandCarousel islands={more} label={`More islands of ${atoll.name}`} allHref={`/atolls/${atoll.slug}`} />
          </div>
        </Reveal>
      ) : null}
    </>
  );
}
