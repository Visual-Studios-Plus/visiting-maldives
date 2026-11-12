import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { isCommons, photo, stayInAtoll } from "@/lib/data";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import GuideCard from "@/components/GuideCard";
import IslandList from "@/components/IslandList";
import ResortCarousel from "@/components/ResortCarousel";
import ViewTracker from "@/components/ViewTracker";
import PhotoGallery from "@/components/PhotoGallery";
import { atollResorts, islandSlug, resortImage } from "@/lib/resorts";
import { slugParams, getAtoll, getAtolls, getGuides, getStays } from "@/lib/content/store";

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
  // places to stay listed on the site that are in this atoll (island entries use their parent atoll)
  const stays = (await getStays()).filter((s) => stayInAtoll(s, parent ?? atoll));

  // Each resort island has its own page under the atoll
  const resorts = atollResorts(atoll).map((r) => ({
    ...r,
    image: resortImage(r.index, 900),
    href: `/atolls/${atoll.slug}/resorts/${islandSlug(r.island)}`,
  }));

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
      {atoll.body?.length || atoll.facts?.length ? (
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
          {atoll.facts?.length ? (
            <aside data-reveal className="h-max rounded-card bg-ink p-6 text-white lg:sticky lg:top-24">
              <p className="eyebrow text-white/60">At a glance</p>
              <dl className="mt-4 divide-y divide-white/10">
                {atoll.facts.map((f) => (
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
          {resorts.length ? (
            <div className="mt-10">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="eyebrow text-driftwood">Resorts · one island, one resort</p>
                <Link href="/stay" className="text-[14px] font-medium text-red hover:underline">
                  All places to stay →
                </Link>
              </div>
              <ResortCarousel resorts={resorts} />
            </div>
          ) : null}
          {profiles.length ? (
            <div className="mt-10">
              <p className="eyebrow text-driftwood">Local islands · {profiles.length}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {profiles.map((p) => (
                  <Link key={p.slug} href={`/atolls/${p.slug}`} data-reveal className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-shell">
                      <Image
                        src={photo(p.image, 800)}
                        unoptimized={isCommons(p.image)}
                        alt={p.gallery?.[0]?.alt ?? p.name}
                        fill
                        sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-3 text-[17px] font-semibold group-hover:text-red">{p.name}</p>
                    <p className="text-sm leading-snug text-driftwood">{p.tagline}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {atoll.islands.halfResort?.length ? (
              <div className="rounded-card bg-shell p-6 lg:col-span-2">
                <p className="eyebrow text-driftwood">Half resort, half local island</p>
                <IslandList items={atoll.islands.halfResort.map((r) => ({ name: r.island, detail: r.resort }))} />
              </div>
            ) : null}
            <div className="rounded-card bg-shell p-6">
              <p className="eyebrow text-driftwood">
                Inhabited · {atoll.islands.inhabited.length}
              </p>
              <IslandList
                variant="chips"
                items={atoll.islands.inhabited.map((name) => {
                  const page = profiles.find((p) => p.name === name);
                  return { name, href: page ? `/atolls/${page.slug}` : undefined };
                })}
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
            {atoll.islands.resortIslands?.length ? (
              <div className="rounded-card bg-shell p-6 lg:col-span-2">
                <p className="eyebrow text-driftwood">Resort islands · {atoll.islands.resortIslands.length}</p>
                <p className="mt-2 max-w-2xl text-sm text-driftwood">
                  Islands leased or planned for resorts in the government register. Some are open, others still being built.
                </p>
                <IslandList variant="chips" items={atoll.islands.resortIslands.map((name) => ({ name }))} />
              </div>
            ) : null}
          </div>
        </Reveal>
      ) : null}
      {stays.length ? (
        <Reveal as="section" className="container-vm pb-12 lg:pb-16">
          <SectionHead eyebrow="Places to stay" title="Where to stay in" accent={(parent ?? atoll).name} href="/stay" cta="All places to stay" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stays.map((s) => (
              <Link key={s.slug} href={`/stay/${s.slug}`} data-reveal className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-shell">
                  <Image
                    src={photo(s.image, 900)}
                    unoptimized={isCommons(s.image)}
                    alt={s.name}
                    fill
                    sizes="(min-width:1024px) 33vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-control bg-white px-2.5 py-1 text-[13px] font-medium">{s.type}</span>
                </div>
                <h3 className="mt-3 text-[20px] leading-6 font-semibold group-hover:underline">{s.name}</h3>
                <p className="mt-1 text-sm text-driftwood">
                  {s.atoll} · {s.price}
                </p>
              </Link>
            ))}
          </div>
        </Reveal>
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
