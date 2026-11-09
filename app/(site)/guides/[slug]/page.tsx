import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import GuideCard from "@/components/GuideCard";
import SaveButton from "@/components/SaveButton";
import ViewTracker from "@/components/ViewTracker";
import { CHECKED } from "@/lib/data";
import { getGuide, getGuides } from "@/lib/content/store";

// Every page is prerendered from generateStaticParams, so a blocking route is fine here
export const instant = false;

export async function generateStaticParams() {
  return (await getGuides()).map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const g = await getGuide((await params).slug);
  return { title: g?.title ?? "Guide", description: g?.summary };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const guide = await getGuide((await params).slug);
  if (!guide) notFound();
  const more = (await getGuides()).filter((g) => g.slug !== guide.slug).slice(0, 3);

  const glance = [{ label: "Season", value: guide.season }, { label: "Where", value: guide.atoll }, ...guide.facts];

  return (
    <>
      <ViewTracker type="guide" slug={guide.slug} />
      <PageHero image={guide.image} title={guide.title} intro={guide.summary} />

      {/* Phone: key facts first, as a swipeable strip (desktop keeps the sidebar) */}
      <section className="lg:hidden" aria-label="At a glance">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pt-6 sm:px-8">
          {glance.map((f) => (
            <div key={f.label} className="shrink-0 rounded-card bg-shell px-4 py-3">
              <p className="eyebrow text-driftwood">{f.label}</p>
              <p className="mt-1 font-mono text-[14px] whitespace-nowrap">{f.value}</p>
            </div>
          ))}
        </div>
      </section>

      <Reveal as="section" className="container-vm grid gap-12 pt-6 pb-12 lg:grid-cols-[1fr_340px] lg:py-24">
        <article>
          <div data-reveal className="flex items-center justify-between gap-4 border-b border-line pb-4">
            <div className="font-mono text-[12px] leading-5 text-driftwood">
              <p>
                <span className="text-red">{guide.category}</span> · {guide.read} min read
              </p>
              <p>{CHECKED} · By our local writers</p>
            </div>
            <SaveButton slug={guide.slug} className="hidden border border-line lg:grid" />
          </div>
          {guide.body.map((b, i) => (
            <div key={b.heading} data-reveal className="mt-10 max-w-2xl">
              <p className="font-mono text-[12px] text-red">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-1 text-[26px] leading-8 font-semibold tracking-tight lg:text-[28px]">{b.heading}</h2>
              <p className="mt-3 text-[17px] leading-[28px]">{b.text}</p>
            </div>
          ))}
          <p data-reveal className="mt-12 max-w-2xl rounded-card bg-shell p-5 text-[15px] leading-[22px] text-driftwood">
            Facts in this guide are checked against official sources every six months. Spot something out of date? Tell us and we will fix it.
          </p>
        </article>
        <aside data-reveal className="hidden h-max rounded-card bg-ink p-6 text-white lg:sticky lg:top-24 lg:block">
          <p className="eyebrow text-white/60">At a glance</p>
          <dl className="mt-4 divide-y divide-white/10">
            {glance.map((f) => (
              <div key={f.label} className="flex justify-between gap-4 py-3">
                <dt className="text-white/60">{f.label}</dt>
                <dd className="text-right font-mono text-[14px]">{f.value}</dd>
              </div>
            ))}
          </dl>
          <Link href="/plan-your-trip" className="mt-6 block rounded-control bg-red py-3 text-center font-semibold transition-colors hover:bg-red-deep">
            Plan your trip
          </Link>
        </aside>
      </Reveal>

      <Reveal as="section" className="border-t border-line py-12 lg:py-24">
        <div className="container-vm">
          <h2 data-reveal className="text-[32px] leading-[1.05] font-semibold tracking-[-0.03em] lg:text-center lg:text-[48px]">
            Keep <span className="accent">reading</span>
          </h2>
          {/* Phone: the desktop photo cards in a swipeable row */}
          <div className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-8 sm:hidden">
            {more.map((g) => (
              <div key={g.slug} className="w-[78vw] shrink-0 snap-start">
                <GuideCard guide={g} sizes="80vw" />
              </div>
            ))}
          </div>
          <div className="mt-10 hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {more.map((g) => (
              <div key={g.slug} data-reveal>
                <GuideCard guide={g} />
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Phone: actions always in reach */}
      <div className="sticky bottom-0 z-40 flex gap-2 border-t border-line bg-white px-4 py-3 lg:hidden">
        <SaveButton slug={guide.slug} className="shrink-0 border border-line" />
        <Link href="/plan-your-trip" className="flex flex-1 items-center justify-center rounded-control bg-red font-semibold text-white">
          Plan your trip
        </Link>
      </div>
    </>
  );

}
