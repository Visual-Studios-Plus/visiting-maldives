import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import PhotoGallery from "@/components/PhotoGallery";
import Reveal from "@/components/Reveal";
import Stars from "@/components/Stars";
import { photo } from "@/lib/data";
import { getAtoll, getAtolls, getStays } from "@/lib/content/store";
import { atollResorts, findResort, islandSlug, resortImage } from "@/lib/resorts";

// Every resort is prerendered from generateStaticParams, so a blocking route is fine here
export const instant = false;

export async function generateStaticParams() {
  const atolls = await getAtolls();
  const params = atolls.flatMap((a) => atollResorts(a).map((r) => ({ slug: a.slug, island: islandSlug(r.island) })));
  return params.length ? params : [{ slug: "not-seeded", island: "not-seeded" }];
}

export async function generateMetadata({ params }: PageProps<"/atolls/[slug]/resorts/[island]">): Promise<Metadata> {
  const { slug, island } = await params;
  const atoll = await getAtoll(slug);
  const resort = atoll && findResort(atoll, island);
  if (!atoll || !resort) return { title: "Resort" };
  return {
    title: `${resort.resort} · ${resort.island}`,
    description: `${resort.resort} on ${resort.island}, ${atoll.name}.`,
  };
}

export default async function ResortPage({ params }: PageProps<"/atolls/[slug]/resorts/[island]">) {
  const { slug, island } = await params;
  const atoll = await getAtoll(slug);
  if (!atoll) notFound();
  const resort = findResort(atoll, island);
  if (!resort) notFound();

  const others = atollResorts(atoll).filter((r) => r.island !== resort.island).slice(0, 3);

  // Sample reviews: rotated through our resort stays until each resort has its own verified ones
  const stays = await getStays();
  const pool = stays.flatMap((s) => s.reviews);
  const start = [...resort.island].reduce((n, c) => n + c.charCodeAt(0), 0) % Math.max(1, pool.length);
  const reviews = pool.length ? [0, 1, 2].map((n) => pool[(start + n) % pool.length]) : [];
  const rating = reviews.length ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length : null;

  const gallery = [
    { src: resortImage(resort.index, 1600), alt: `${resort.resort} on ${resort.island}` },
    ...(atoll.gallery ?? []),
  ];

  return (
    <>
      <PageHero
        image={resortImage(resort.index, 2400)}
        eyebrow={`${atoll.name} · Resort island`}
        title={resort.resort}
        intro={`One island, one resort: ${resort.island} is given over entirely to ${resort.resort}, in ${atoll.name}, ${atoll.region} Maldives.`}
      />

      <Reveal as="section" className="container-vm grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        {[
          ["Island", resort.island],
          ["Atoll", atoll.name],
          ["Transfer", atoll.transfer],
          ["Best for", atoll.bestFor.join(" · ")],
        ].map(([k, v]) => (
          <div key={k} data-reveal className="rounded-card bg-shell p-6">
            <p className="eyebrow text-driftwood">{k}</p>
            <p className="mt-2 text-[20px] leading-6 font-semibold">{v}</p>
          </div>
        ))}
      </Reveal>

      <Reveal as="section" className="container-vm grid gap-10 pb-12 lg:grid-cols-[1fr_340px] lg:pb-20">
        <div>
          <h2 data-reveal className="text-[28px] font-semibold tracking-tight">
            About this island
          </h2>
          <p data-reveal className="mt-3 max-w-2xl text-[17px] leading-relaxed">
            {resort.resort} occupies {resort.island} on its own, the classic one-island-one-resort set-up
            that {atoll.name} is known for. {atoll.intro}
          </p>

          {gallery.length ? <PhotoGallery photos={gallery} title={`${atoll.name} in photos`} /> : null}

          {reviews.length ? (
            <section className="mt-14">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 data-reveal className="text-[28px] font-semibold tracking-tight">Reviews</h2>
                {rating !== null ? (
                  <div data-reveal className="flex items-center gap-2 text-[15px] leading-none">
                    <Stars value={rating} size={16} />
                    <span className="font-semibold tabular-nums">{rating.toFixed(1)}</span>
                  </div>
                ) : null}
              </div>
              <ul className="mt-6 divide-y divide-black/10">
                {reviews.map((r, i) => (
                  <li key={i} data-reveal className="py-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-semibold">
                        {r.author} <span className="font-normal text-driftwood">· {r.from}</span>
                      </p>
                      <span className="font-mono text-[12px] text-driftwood">{r.date}</span>
                    </div>
                    <Stars value={r.rating} size={14} className="mt-2" />
                    <p className="mt-2 leading-relaxed">{r.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div data-reveal className="rounded-card bg-ink p-6 text-white">
            <p className="eyebrow text-white/70">Island</p>
            <p className="mt-1 text-[24px] font-semibold">{resort.island}</p>
            <dl className="mt-6 space-y-4 border-t border-white/15 pt-6">
              <div>
                <dt className="eyebrow text-white/70">Atoll</dt>
                <dd className="mt-1 font-mono text-[14px]">{atoll.name}</dd>
              </div>
              <div>
                <dt className="eyebrow text-white/70">Transfer</dt>
                <dd className="mt-1 font-mono text-[14px]">{atoll.transfer}</dd>
              </div>
              <div>
                <dt className="eyebrow text-white/70">Region</dt>
                <dd className="mt-1 font-mono text-[14px]">{atoll.region} Maldives</dd>
              </div>
            </dl>
            <Link
              href="/plan-your-trip"
              className="mt-6 block rounded-control bg-red px-6 py-3.5 text-center font-semibold transition-colors hover:bg-red-deep"
            >
              Plan your trip
            </Link>
          </div>
          <Link href={`/atolls/${atoll.slug}`} className="mt-4 inline-block text-[14px] text-driftwood hover:text-ink">
            ← {atoll.name}
          </Link>
        </aside>
      </Reveal>

      {others.length ? (
        <Reveal as="section" className="container-vm pb-16 lg:pb-24">
          <h2 data-reveal className="text-[28px] font-semibold tracking-tight">
            More resorts in {atoll.name}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {others.map((r) => (
              <Link key={r.island} href={`/atolls/${atoll.slug}/resorts/${islandSlug(r.island)}`} data-reveal className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-ink">
                  <Image
                    src={photo(resortImage(r.index, 700))}
                    alt={`${r.resort}, ${r.island}`}
                    fill
                    sizes="33vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>
                <p className="mt-3 font-semibold group-hover:underline">{r.resort}</p>
                <p className="mt-1 text-[13px] text-driftwood">{r.island}</p>
              </Link>
            ))}
          </div>
        </Reveal>
      ) : null}
    </>
  );
}
