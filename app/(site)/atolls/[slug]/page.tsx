import type { Metadata } from "next";
import Link from "next/link";
import { placeInAtoll, placeOnIsland, salonInAtoll, salonOnIsland, stayInAtoll, stayOnIsland } from "@/lib/data";
import { atollFactRows, findEntry, inhabitedNames, islandCards, islandCoords, islandFactRows, islandHref, mapPlaces, nearby } from "@/lib/islands";
import IslandMap from "@/components/IslandMap";
import IslandCarousel from "@/components/IslandCarousel";
import PlaceCarousels from "@/components/PlaceCarousels";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import GuideCard from "@/components/GuideCard";
import IslandList from "@/components/IslandList";
import ViewTracker from "@/components/ViewTracker";
import PhotoGallery from "@/components/PhotoGallery";
import { slugParams, getAtoll, getAtolls, getEats, getGuides, getIslands, getSalons, getStays } from "@/lib/content/store";

// Every page is prerendered from generateStaticParams, so a blocking route is fine here
export const instant = false;

export async function generateStaticParams() {
  return slugParams(await getAtolls());
}

export async function generateMetadata({ params }: PageProps<"/atolls/[slug]">): Promise<Metadata> {
  const a = await getAtoll((await params).slug);
  return { title: a?.name ?? "Atoll" };
}

export default async function AtollPage({ params }: PageProps<"/atolls/[slug]">) {
  const atoll = await getAtoll((await params).slug);
  if (!atoll) notFound();
  const key = atoll.name.split(" ")[0].replace("&", "").trim();
  const guides = await getGuides();
  const related = guides.filter((g) => g.atoll.includes(key) || (atoll.slug === "male" && /Malé|Kaafu|Velana/.test(g.atoll)));
  const list = related.length ? related : guides.slice(0, 3);
  // Inhabited islands that have their own entry in the Atolls section
  const profiles = (await getAtolls()).filter((a) => a.parent === atoll.slug);
  const parent = atoll.parent ? await getAtoll(atoll.parent) : undefined;
  // every place to stay (resorts, resort islands, hotels) in this atoll, all published at /stay;
  // restaurants and salons are placed by the atoll or island named in their "area".
  // A single-island entry (parent set) lists only what is on that island.
  const home = parent ?? atoll;
  const atollStays = (await getStays()).filter((s) => stayInAtoll(s, home));
  const atollEats = (await getEats()).filter((e) => placeInAtoll(e.area, home));
  const atollSalons = (await getSalons()).filter((s) => salonInAtoll(s, home));
  const stays = parent ? atollStays.filter((s) => stayOnIsland(s, atoll.name)) : atollStays;
  const eats = parent ? atollEats.filter((e) => placeOnIsland(e.area, atoll.name)) : atollEats;
  const salons = parent ? atollSalons.filter((s) => salonOnIsland(s, atoll.name)) : atollSalons;

  // one card per inhabited island, with what's listed on it; every card opens the island's page
  // "at a glance": an island entry adds its population, area and distance (from Wikipedia) to its own facts
  const entries = await getIslands();
  // an island guide (parent set) gets a map of the island and its nearest islands and resorts
  const islandAt = parent ? islandCoords(parent.slug, atoll.name, findEntry(parent, atoll.name, entries)) : undefined;
  const mapped = mapPlaces(stays, eats, salons);
  const close = islandAt ? nearby(islandAt, atoll.name, await getAtolls(), entries, await getStays()) : { islands: [], resorts: [] };
  const km = (n: number) => (n < 10 ? n.toFixed(1) : Math.round(n).toString());
  const extra = parent ? islandFactRows(parent, atoll.name, findEntry(parent, atoll.name, entries)).filter((r) => r.label !== "Atoll" && !(atoll.facts ?? []).some((x) => x.label === r.label)) : [];
  // an atoll gets its official name, capital, population and island counts
  const resortCount = atollStays.filter((s) => s.type === "Resort" || s.type === "Resort island").length;
  const glance = parent ? [...extra, ...(atoll.facts ?? [])] : [...atollFactRows(atoll, resortCount, entries), ...(atoll.facts ?? [])];
  const cards = islandCards(atoll, profiles, atollStays, atollEats, atollSalons, entries);

  return (
    <>
      <ViewTracker type="atoll" slug={atoll.slug} />
      <PageHero
        image={atoll.image}
        eyebrow={parent ? `${parent.name} · Inhabited island` : `${atoll.region} Maldives`}
        title={atoll.name}
        intro={atoll.intro}
      />
      {parent ? (
        <div className="container-vm pt-8">
          <Link href={`/atolls/${parent.slug}`} className="font-mono text-[13px] text-red hover:underline">
            ← All islands of {parent.name}
          </Link>
        </div>
      ) : null}
      <Reveal as="section" className="container-vm grid gap-4 py-12 sm:grid-cols-3 lg:py-16">
        {[
          ["Getting there", `MLE → ${atoll.transfer}`],
          ["Best for", atoll.bestFor.join(" · ")],
          ["In Dhivehi", atoll.dhivehi],
        ].map(([k, v]) => (
          <div key={k} data-reveal className="rounded-card bg-shell p-6">
            <p className="eyebrow text-driftwood">{k}</p>
            <p className={`mt-2 text-[22px] leading-7 font-semibold ${k === "In Dhivehi" ? "font-thaana" : ""}`}>{v}</p>
          </div>
        ))}
      </Reveal>
      {atoll.body?.length || glance.length ? (
        <Reveal as="section" className="container-vm grid gap-12 pb-12 lg:grid-cols-[1fr_340px] lg:pb-20">
          <article>
            {atoll.body?.map((b, i) => (
              <div key={b.heading} data-reveal className={`max-w-2xl ${i ? "mt-10" : ""}`}>
                <p className="font-mono text-[12px] text-red">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-1 text-[26px] leading-8 font-semibold tracking-tight lg:text-[28px]">{b.heading}</h2>
                <p className="mt-3 text-[17px] leading-[28px]">{b.text}</p>
              </div>
            ))}
          </article>
          {glance.length ? (
            <aside data-reveal className="h-max rounded-card bg-ink p-6 text-white lg:sticky lg:top-24">
              <p className="eyebrow text-white/60">At a glance</p>
              <dl className="mt-4 divide-y divide-white/10">
                {glance.map((f) => (
                  <div key={f.label} className="flex justify-between gap-4 py-3">
                    <dt className="text-white/60">{f.label}</dt>
                    <dd className="text-right font-mono text-[14px]">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          ) : null}
        </Reveal>
      ) : null}
      {atoll.islands ? (
        <Reveal as="section" className="container-vm pb-12 lg:pb-16">
          <SectionHead eyebrow="Islands" title="Islands of" accent={atoll.name} />
          {cards.length ? (
            <div className="mt-10">
              <p className="eyebrow text-driftwood">Local islands · {cards.length}</p>
              <div className="mt-4">
                <IslandCarousel islands={cards} label={`Islands of ${atoll.name}`} />
              </div>
            </div>
          ) : null}
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <div className="rounded-card bg-shell p-6">
              <p className="eyebrow text-driftwood">
                Inhabited · {inhabitedNames(atoll, entries).length}
              </p>
              <IslandList
                variant="chips"
                items={inhabitedNames(atoll, entries).map((name) => ({ name, href: islandHref(atoll, name, profiles, entries) }))}
              />
            </div>
            <div className="rounded-card bg-shell p-6">
              <p className="eyebrow text-driftwood">
                Uninhabited · {atoll.islands.uninhabited.length}
              </p>
              <IslandList
                variant="chips"
                muted
                items={atoll.islands.uninhabited.map((name) => ({ name }))}
              />
            </div>
          </div>
        </Reveal>
      ) : null}
      {islandAt ? (
        <Reveal as="section" className="container-vm pb-12 lg:pb-16">
          <SectionHead eyebrow="Map" title="Where things are on" accent={atoll.name} />
          <div data-reveal className="mx-auto mt-8 max-w-4xl">
            <IslandMap name={atoll.name} center={islandAt} places={mapped.placed} unplaced={mapped.unplaced} />
          </div>
        </Reveal>
      ) : null}
      {close.islands.length || close.resorts.length ? (
        <Reveal as="section" className="container-vm grid gap-6 pb-12 sm:grid-cols-2 lg:pb-16">
          {[
            { title: "Nearest local islands", items: close.islands.map((x) => ({ ...x, sub: x.atoll })) },
            { title: "Nearest resorts", items: close.resorts.map((x) => ({ ...x, name: x.resort ?? x.name, sub: x.resort ? `${x.name} · ${x.atoll}` : x.atoll })) },
          ]
            .filter((g) => g.items.length)
            .map((g) => (
              <div key={g.title} data-reveal className="rounded-card bg-shell p-6">
                <p className="eyebrow text-driftwood">{g.title}</p>
                <ul className="mt-3 divide-y divide-line">
                  {g.items.map((x) => (
                    <li key={x.href}>
                      <Link href={x.href} className="group flex items-baseline justify-between gap-3 py-2.5">
                        <span className="min-w-0">
                          <span className="block truncate font-semibold group-hover:text-red">{x.name}</span>
                          <span className="block truncate text-[13px] text-driftwood">{x.sub}</span>
                        </span>
                        <span className="shrink-0 font-mono text-[13px] text-driftwood">{km(x.km)} km</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </Reveal>
      ) : null}
      <PlaceCarousels place={atoll.name} stays={stays} eats={eats} salons={salons} fallbackHref={`/atolls/${atoll.slug}`} />
      {parent && !stays.length && !eats.length && !salons.length ? (
        <section className="container-vm pb-12 lg:pb-16">
          <div className="rounded-card bg-shell p-8 text-center">
            <p className="text-[20px] font-semibold">Nothing listed on {atoll.name} yet</p>
            <p className="mx-auto mt-2 max-w-xl text-driftwood">
              We have no places to stay, restaurants or salons on {atoll.name} yet. See what&rsquo;s listed elsewhere in {parent.name}.
            </p>
            <Link href={`/atolls/${parent.slug}`} className="mt-5 inline-flex min-h-11 items-center rounded-control bg-ink px-5 font-semibold text-white hover:bg-red">
              Explore {parent.name}
            </Link>
          </div>
        </section>
      ) : null}
      {atoll.gallery?.length ? (
        <div className="container-vm -mt-4 pb-12 lg:pb-20">
          <PhotoGallery photos={atoll.gallery} title={`${atoll.name} in photos`} />
        </div>
      ) : null}
      <Reveal as="section" className="container-vm pb-12 lg:pb-24">
        <SectionHead eyebrow="Guides" title={`In and around`} accent={atoll.name} href="/things-to-do" cta="All guides" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((g) => (
            <div key={g.slug} data-reveal>
              <GuideCard guide={g} />
            </div>
          ))}
        </div>
      </Reveal>
    </>
  );
}
