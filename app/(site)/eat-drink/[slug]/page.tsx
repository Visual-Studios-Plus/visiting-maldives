import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Stars from "@/components/Stars";
import RestaurantCard from "@/components/RestaurantCard";
import { eatSlug } from "@/lib/data";
import { getEat, getEats, slugParams } from "@/lib/content/store";

// Every page is prerendered from generateStaticParams, so a blocking route is fine here
export const instant = false;

export async function generateStaticParams() {
  return slugParams((await getEats()).map((e) => ({ slug: eatSlug(e) })));
}

export async function generateMetadata({ params }: PageProps<"/eat-drink/[slug]">): Promise<Metadata> {
  const e = await getEat((await params).slug);
  return { title: e ? `${e.name} · ${e.area}` : "Eat & drink", description: e?.about ?? (e ? `${e.kind} in ${e.area}. Order: ${e.dish}.` : undefined) };
}

/** OpenStreetMap embed around a point (no API key, no tracking cookies). */
const mapEmbed = (lat: number, lng: number) => {
  const dLat = 0.004, dLng = 0.006;
  const bbox = [lng - dLng, lat - dLat, lng + dLng, lat + dLat].map((n) => n.toFixed(5)).join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
};

export default async function EatPage({ params }: PageProps<"/eat-drink/[slug]">) {
  const eat = await getEat((await params).slug);
  if (!eat) notFound();

  const reviews = eat.reviews ?? [];
  const avg = reviews.length ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length : null;
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, c: reviews.filter((r) => Math.round(r.rating) === n).length }));
  const hasMap = typeof eat.lat === "number" && typeof eat.lng === "number";
  const recommends = (eat.recommends ?? []).filter((r) => r.dish.toLowerCase() !== eat.dish.toLowerCase());
  const more = (await getEats()).filter((e) => eatSlug(e) !== eatSlug(eat)).slice(0, 3);
  const directions = hasMap
    ? `https://www.google.com/maps/dir/?api=1&destination=${eat.lat},${eat.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${eat.name}, ${eat.address ?? eat.area}, Maldives`)}`;

  return (
    <>
      <PageHero image={eat.image} eyebrow={`${eat.kind} · ${eat.area}`} title={eat.name} intro={eat.about ?? `Order the ${eat.dish}.`} />

      <Reveal as="section" className="container-vm grid gap-10 py-12 lg:grid-cols-[1fr_340px] lg:py-20">
        <div className="min-w-0">
          {eat.rating ? (
            <div data-reveal className="flex flex-wrap items-center gap-3">
              <Stars value={eat.rating} size={22} />
              <span className="text-[20px] font-semibold tabular-nums">{eat.rating.toFixed(1)}</span>
              <span className="text-driftwood">Our rating{reviews.length ? ` · ${reviews.length} guest reviews` : ""}</span>
            </div>
          ) : null}

          {/* What to order */}
          <h2 data-reveal data-no-split className="mt-8 text-[28px] font-semibold tracking-tight">
            What to order
          </h2>
          <div data-reveal className="mt-4 flex items-center gap-3 rounded-card bg-red/[0.07] px-5 py-4">
            <span className="text-[12px] font-semibold tracking-[0.08em] text-red uppercase">Order this</span>
            <span className="text-[18px] font-semibold">{eat.dish}</span>
          </div>
          {recommends.length > 0 && (
            <ul data-reveal className="mt-4 divide-y divide-line rounded-card border border-line">
              {recommends.map((r) => (
                <li key={r.dish} className="flex gap-3 px-5 py-3.5">
                  <svg viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-red" aria-hidden>
                    <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>
                    <span className="font-semibold">{r.dish}</span>
                    <span className="block text-[15px] text-driftwood">{r.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Map */}
          <section id="map" className="mt-14">
            <h2 data-reveal data-no-split className="text-[28px] font-semibold tracking-tight">
              Where it is
            </h2>
            {eat.address && <p data-reveal className="mt-2 text-driftwood">{eat.address}</p>}
            {hasMap ? (
              <div data-reveal className="mt-5 overflow-hidden rounded-card border border-line bg-shell">
                <iframe
                  title={`Map showing ${eat.name}`}
                  src={mapEmbed(eat.lat!, eat.lng!)}
                  className="block aspect-[16/10] w-full sm:aspect-[16/8]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
                <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line bg-white px-4 py-3 text-[14px] font-medium">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${eat.lat},${eat.lng}`} target="_blank" rel="noopener noreferrer" className="text-red hover:underline">
                    Open in Google Maps ↗
                  </a>
                  <a href={`https://www.openstreetmap.org/?mlat=${eat.lat}&mlon=${eat.lng}#map=17/${eat.lat}/${eat.lng}`} target="_blank" rel="noopener noreferrer" className="text-driftwood hover:text-ink hover:underline">
                    OpenStreetMap ↗
                  </a>
                </div>
              </div>
            ) : (
              <p data-reveal className="mt-4 rounded-card bg-shell p-5 text-[15px] text-driftwood">
                Map coming soon. <a href={directions} target="_blank" rel="noopener noreferrer" className="font-medium text-red hover:underline">Search for it on Google Maps ↗</a>
              </p>
            )}
          </section>

          {/* Reviews */}
          <section id="reviews" className="mt-14">
            <h2 data-reveal data-no-split className="text-[28px] font-semibold tracking-tight">
              Reviews
            </h2>
            {avg === null ? (
              <p data-reveal className="mt-4 text-driftwood">No reviews yet.</p>
            ) : (
              <>
                <div data-reveal className="mt-6 grid gap-6 rounded-card bg-shell p-6 sm:grid-cols-[auto_1fr] sm:items-center">
                  <div className="text-center sm:pr-6">
                    <p className="text-[48px] leading-none font-semibold tracking-tight tabular-nums">{avg.toFixed(1)}</p>
                    <Stars value={avg} size={18} className="mt-2" />
                    <p className="mt-1 text-[13px] text-driftwood">{reviews.length} reviews</p>
                  </div>
                  <div className="space-y-1.5">
                    {dist.map((d) => (
                      <div key={d.n} className="flex items-center gap-3 text-[13px]">
                        <span className="w-10 shrink-0 font-mono">{d.n} ★</span>
                        <span className="h-2 flex-1 overflow-hidden rounded-full bg-black/10">
                          <span className="block h-full rounded-full bg-[#f5a623]" style={{ width: `${(d.c / reviews.length) * 100}%` }} />
                        </span>
                        <span className="w-4 text-right text-driftwood tabular-nums">{d.c}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <ul className="mt-8 divide-y divide-black/10">
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
              </>
            )}
          </section>
        </div>

        {/* At a glance */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div data-reveal className="rounded-card bg-ink p-6 text-white">
            <p className="eyebrow text-white/70">Typical meal</p>
            <p className="mt-1 text-[24px] font-semibold">
              {eat.price} <span className="text-[15px] font-normal text-white/60">per person</span>
            </p>
            <dl className="mt-6 space-y-4 border-t border-white/15 pt-6">
              <div>
                <dt className="eyebrow text-white/70">Area</dt>
                <dd className="mt-1 font-mono text-[14px]">{eat.area}</dd>
              </div>
              {eat.address && (
                <div>
                  <dt className="eyebrow text-white/70">Address</dt>
                  <dd className="mt-1 font-mono text-[14px]">{eat.address}</dd>
                </div>
              )}
              {eat.hours && (
                <div>
                  <dt className="eyebrow text-white/70">Opening hours</dt>
                  <dd className="mt-1 font-mono text-[14px]">{eat.hours}</dd>
                </div>
              )}
            </dl>
            <a href={directions} target="_blank" rel="noopener noreferrer" className="mt-6 block rounded-control bg-red px-6 py-3.5 text-center font-semibold transition-colors hover:bg-red-deep">
              Get directions ↗
            </a>
          </div>
          <Link href="/eat-drink" className="mt-4 inline-block text-[14px] text-driftwood hover:text-ink">
            ← All places to eat
          </Link>
        </aside>
      </Reveal>

      {more.length > 0 && (
        <Reveal as="section" className="container-vm pb-16 lg:pb-24">
          <h2 data-reveal className="text-[28px] font-semibold tracking-tight">
            More places to eat
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((e) => (
              <div key={eatSlug(e)} data-reveal>
                <RestaurantCard eat={e} />
              </div>
            ))}
          </div>
        </Reveal>
      )}
    </>
  );
}
