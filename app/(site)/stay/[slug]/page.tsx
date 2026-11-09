import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Stars from "@/components/Stars";
import ViewTracker from "@/components/ViewTracker";
import PhotoGallery from "@/components/PhotoGallery";
import { photo } from "@/lib/data";
import { slugParams, getStay, getStays } from "@/lib/content/store";

// Every stay is prerendered from generateStaticParams, so a blocking route is fine here
export const instant = false;

export async function generateStaticParams() {
  return slugParams(await getStays());
}

export async function generateMetadata({ params }: PageProps<"/stay/[slug]">): Promise<Metadata> {
  const s = await getStay((await params).slug);
  return { title: s ? `${s.name} · ${s.atoll}` : "Stay", description: s?.note };
}

export default async function StayPage({ params }: PageProps<"/stay/[slug]">) {
  const stay = await getStay((await params).slug);
  if (!stay) notFound();

  const avg = stay.reviews.reduce((n, r) => n + r.rating, 0) / stay.reviews.length;
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, c: stay.reviews.filter((r) => Math.round(r.rating) === n).length }));
  const more = (await getStays()).filter((s) => s.slug !== stay.slug).slice(0, 3);

  return (
    <>
      <ViewTracker type="stay" slug={stay.slug} />
      <PageHero image={stay.image} eyebrow={`${stay.type} · ${stay.atoll}`} title={stay.name} intro={stay.note} />

      <Reveal as="section" className="container-vm grid gap-10 py-12 lg:grid-cols-[1fr_340px] lg:py-20">
        <div>
          <div data-reveal className="flex flex-wrap items-center gap-3">
            <Stars value={stay.rating} size={22} />
            <span className="text-[20px] leading-none font-semibold tabular-nums">{stay.rating.toFixed(1)}</span>
            <span className="text-driftwood">Our rating · {stay.reviews.length} guest reviews</span>
            {stay.partner && <span className="rounded-control bg-ink px-2.5 py-1 text-[12px] text-white">Partner</span>}
          </div>

          <h2 data-reveal className="mt-8 text-[28px] font-semibold tracking-tight">About this {stay.type.toLowerCase()}</h2>
          <p data-reveal className="mt-3 max-w-2xl text-[17px] leading-relaxed">{stay.about}</p>

          <h3 data-reveal className="mt-10 text-[20px] font-semibold">What&apos;s included</h3>
          <ul data-reveal className="mt-4 flex flex-wrap gap-2">
            {stay.amenities.map((a) => (
              <li key={a} className="rounded-control bg-shell px-3.5 py-2 text-[14px]">{a}</li>
            ))}
          </ul>

          {stay.gallery?.length ? <PhotoGallery photos={stay.gallery} /> : null}

          <section id="reviews" className="mt-14">
            <h2 data-reveal className="text-[28px] font-semibold tracking-tight">Reviews</h2>
            <div data-reveal className="mt-6 grid gap-6 rounded-card bg-shell p-6 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="text-center sm:pr-6">
                <p className="text-[48px] leading-none font-semibold tracking-tight tabular-nums">{avg.toFixed(1)}</p>
                <Stars value={avg} size={18} className="mt-2" />
                <p className="mt-1 text-[13px] text-driftwood">{stay.reviews.length} reviews</p>
              </div>
              <div className="space-y-1.5">
                {dist.map((d) => (
                  <div key={d.n} className="flex items-center gap-3 text-[13px]">
                    <span className="w-10 shrink-0 font-mono">{d.n} ★</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-black/10">
                      <span className="block h-full rounded-full bg-[#f5a623]" style={{ width: `${(d.c / stay.reviews.length) * 100}%` }} />
                    </span>
                    <span className="w-4 text-right tabular-nums text-driftwood">{d.c}</span>
                  </div>
                ))}
              </div>
            </div>
            <ul className="mt-8 divide-y divide-black/10">
              {stay.reviews.map((r, i) => (
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
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div data-reveal className="rounded-card bg-ink p-6 text-white">
            <p className="eyebrow text-white/70">Price</p>
            <p className="mt-1 text-[24px] font-semibold">{stay.price}</p>
            <dl className="mt-6 space-y-4 border-t border-white/15 pt-6">
              <div>
                <dt className="eyebrow text-white/70">Location</dt>
                <dd className="mt-1 font-mono text-[14px]">{stay.atoll}</dd>
              </div>
              {stay.facts.map((f) => (
                <div key={f.label}>
                  <dt className="eyebrow text-white/70">{f.label}</dt>
                  <dd className="mt-1 font-mono text-[14px]">{f.value}</dd>
                </div>
              ))}
            </dl>
            <Link href="/plan-your-trip" className="mt-6 block rounded-control bg-red px-6 py-3.5 text-center font-semibold transition-colors hover:bg-red-deep">
              Plan your trip
            </Link>
          </div>
          <Link href="/stay" className="mt-4 inline-block text-[14px] text-driftwood hover:text-ink">
            ← All places to stay
          </Link>
        </aside>
      </Reveal>

      <Reveal as="section" className="container-vm pb-16 lg:pb-24">
        <h2 data-reveal className="text-[28px] font-semibold tracking-tight">More places to stay</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {more.map((s) => (
            <Link key={s.slug} href={`/stay/${s.slug}`} data-reveal className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-card">
                <Image src={photo(s.image, 700)} alt={s.name} fill sizes="33vw" className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
              </div>
              <p className="mt-3 font-semibold group-hover:underline">{s.name}</p>
              <div className="mt-1 flex items-center gap-2 text-[13px] leading-none text-driftwood">
                <Stars value={s.rating} size={13} /> {s.rating.toFixed(1)} · {s.atoll}
              </div>
            </Link>
          ))}
        </div>
      </Reveal>
    </>
  );
}
