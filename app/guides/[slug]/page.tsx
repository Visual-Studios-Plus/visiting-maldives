import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import GuideCard from "@/components/GuideCard";
import SaveButton from "@/components/SaveButton";
import { CHECKED, getGuide, guides } from "@/lib/data";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const g = getGuide((await params).slug);
  return { title: g?.title ?? "Guide", description: g?.summary };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();
  const more = guides.filter((g) => g.slug !== guide.slug).slice(0, 3);

  return (
    <>
      <PageHero image={guide.image} eyebrow={`${guide.category} · ${guide.atoll}`} title={guide.title} intro={guide.summary} />
      <Reveal as="section" className="container-vm grid gap-12 py-12 lg:grid-cols-[1fr_340px] lg:py-24">
        <article>
          <div data-reveal className="flex flex-wrap items-center gap-3 font-mono text-[12px] text-driftwood">
            <span>{guide.read} min read</span>·<span>{CHECKED}</span>·<span>By our local writers</span>
            <SaveButton slug={guide.slug} className="ml-auto border border-line" />
          </div>
          {guide.body.map((b) => (
            <div key={b.heading} data-reveal className="mt-10 max-w-2xl">
              <h2 className="text-[28px] leading-8 font-semibold tracking-tight">{b.heading}</h2>
              <p className="mt-3 text-[17px] leading-[28px]">{b.text}</p>
            </div>
          ))}
          <p data-reveal className="mt-12 max-w-2xl rounded-card bg-shell p-5 text-[15px] leading-[22px] text-driftwood">
            Facts in this guide are checked against official sources every six months. Spot something out of date? Tell us and we will fix it.
          </p>
        </article>
        <aside data-reveal className="h-max rounded-card bg-ink p-6 text-white lg:sticky lg:top-24">
          <p className="eyebrow text-white/60">At a glance</p>
          <dl className="mt-4 divide-y divide-white/10">
            {[{ label: "Season", value: guide.season }, { label: "Where", value: guide.atoll }, ...guide.facts].map((f) => (
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
      <Reveal as="section" className="bg-shell py-12 lg:py-24">
        <div className="container-vm">
          <h2 data-reveal className="text-[36px] leading-[1.05] font-semibold tracking-[-0.03em] lg:text-[48px]">
            Keep <span className="accent">reading</span>
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((g) => (
              <div key={g.slug} data-reveal>
                <GuideCard guide={g} />
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </>
  );
}
