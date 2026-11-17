import type { Metadata } from "next";
import { eatInAtoll, salonInAtoll, stayInAtoll } from "@/lib/data";
import { atollFactRows, inhabitedNames, islandCards, islandHref } from "@/lib/islands";
import { islandSlug } from "@/lib/resorts";
import IslandCarousel from "@/components/IslandCarousel";
import PlaceCarousels from "@/components/PlaceCarousels";
import { notFound, permanentRedirect } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import GuideCard from "@/components/GuideCard";
import IslandList from "@/components/IslandList";
import ViewTracker from "@/components/ViewTracker";
import CustomSections from "@/components/blocks/CustomSections";
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
  // islands live at /atolls/<atoll>/islands/<island>; older single-island entries redirect there
  if (atoll.parent) permanentRedirect(`/atolls/${atoll.parent}/islands/${islandSlug(atoll.name)}`);
  const key = atoll.name.split(" ")[0].replace("&", "").trim();
  const guides = await getGuides();
  const related = guides.filter((g) => g.atoll.includes(key) || (atoll.slug === "male" && /Malé|Kaafu|Velana/.test(g.atoll)));
  const list = related.length ? related : guides.slice(0, 3);
  // older single-island entries of this atoll (their photo and tagline still show on island cards)
  const profiles = (await getAtolls()).filter((a) => a.parent === atoll.slug);
  // every place to stay (resorts, resort islands, hotels) in this atoll, all published at /stay;
  // restaurants and salons are placed by the atoll or island named in their "area"
  const stays = (await getStays()).filter((s) => stayInAtoll(s, atoll));
  const eats = (await getEats()).filter((e) => eatInAtoll(e, atoll));
  const salons = (await getSalons()).filter((s) => salonInAtoll(s, atoll));

  const entries = await getIslands();
  // "at a glance": official name, capital, population and island counts
  const resortCount = stays.filter((x) => x.type === "Resort" || x.type === "Resort island").length;
  const glance = [...atollFactRows(atoll, resortCount, entries), ...(atoll.facts ?? [])];
  // one card per inhabited island, with what's listed on it; every card opens the island's page
  const cards = islandCards(atoll, profiles, stays, eats, salons, entries);

  return (
    <>
      <ViewTracker type="atoll" slug={atoll.slug} />
      <PageHero
        image={atoll.image}
        eyebrow={`${atoll.region} Maldives`}
        title={atoll.name}
        intro={atoll.intro}
      />
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
      {/* sections built in the dashboard (Page sections) */}
      <CustomSections page={{ kind: "atoll", atoll }} position="Main column" variant="wide" />
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
      <PlaceCarousels place={atoll.name} stays={stays} eats={eats} salons={salons} fallbackHref={`/atolls/${atoll.slug}`} />
      {atoll.gallery?.length ? (
        <div className="container-vm -mt-4 pb-12 lg:pb-20">
          <PhotoGallery photos={atoll.gallery} title={`${atoll.name} in photos`} />
        </div>
      ) : null}
      <CustomSections page={{ kind: "atoll", atoll }} position="Full width, at the end" variant="wide" />
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
