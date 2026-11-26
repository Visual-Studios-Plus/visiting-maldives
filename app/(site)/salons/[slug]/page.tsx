import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Stars from "@/components/Stars";
import { salonSlug, salonWhere } from "@/lib/data";
import { getSalon, getSalons, slugParams } from "@/server/content/store";

// Every page is prerendered from generateStaticParams, so a blocking route is fine here
export const instant = false;

export async function generateStaticParams() {
  return slugParams((await getSalons()).map((s) => ({ slug: salonSlug(s) })));
}

export async function generateMetadata({ params }: PageProps<"/salons/[slug]">): Promise<Metadata> {
  const s = await getSalon((await params).slug);
  return { title: s ? `${s.name} · ${salonWhere(s)}` : "Salons & spas", description: s?.about ?? (s ? `${s.kind} in ${salonWhere(s)}.` : undefined) };
}

/** OpenStreetMap embed around a point (no API key, no tracking cookies). */
const mapEmbed = (lat: number, lng: number) => {
  const dLat = 0.004,
    dLng = 0.006;
  const bbox = [lng - dLng, lat - dLat, lng + dLng, lat + dLat].map((n) => n.toFixed(5)).join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
};

export default async function SalonPage({ params }: PageProps<"/salons/[slug]">) {
  const salon = await getSalon((await params).slug);
  if (!salon) notFound();

  const reviews = salon.reviews ?? [];
  const avg = reviews.length ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length : null;
  const hasMap = typeof salon.lat === "number" && typeof salon.lng === "number";
  const directions = hasMap
    ? `https://www.google.com/maps/dir/?api=1&destination=${salon.lat},${salon.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${salon.name}, ${salon.address ?? salon.area}, Maldives`)}`;
  const more = (await getSalons()).filter((s) => salonSlug(s) !== salonSlug(salon)).slice(0, 3);

  return (
    <>
      <PageHero image={salon.image} eyebrow={`${salon.kind} · ${salon.area}`} title={salon.name} intro={salon.about ?? `${salon.kind} in ${salon.area}.`} />

      <Reveal as="section" className="container-vm grid gap-10 py-12 lg:grid-cols-[1fr_340px] lg:py-20">
        <div className="min-w-0">
          {salon.rating ? (
            <div data-reveal className="flex flex-wrap items-center gap-3">
              <Stars value={salon.rating} size={22} />
              <span className="text-[20px] font-semibold tabular-nums">{salon.rating.toFixed(1)}</span>
              <span className="text-driftwood">Our rating{reviews.length ? ` · ${reviews.length} guest reviews` : ""}</span>
            </div>
          ) : null}

          {salon.services?.length ? (
            <>
              <h2 data-reveal data-no-split className="mt-8 text-[28px] font-semibold tracking-tight">
                Services
              </h2>
              <ul data-reveal className="mt-4 flex flex-wrap gap-2">
                {salon.services.map((s) => (
                  <li key={s} className="rounded-full bg-shell px-3.5 py-1.5 text-[15px] font-medium">
                    {s}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <section id="map" className="mt-14 first:mt-0">
            <h2 data-reveal data-no-split className="text-[28px] font-semibold tracking-tight">
              Where it is
            </h2>
            {salon.address && <p data-reveal className="mt-2 text-driftwood">{salon.address}</p>}
            {hasMap ? (
              <>
                <iframe
                  title={`Map showing ${salon.name}`}
                  src={mapEmbed(salon.lat!, salon.lng!)}
                  loading="lazy"
                  className="mt-4 aspect-[16/10] w-full rounded-card border border-line"
                />
                <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[15px]">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${salon.lat},${salon.lng}`} target="_blank" rel="noopener noreferrer" className="text-red hover:underline">
                    Open in Google Maps ↗
                  </a>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${salon.lat}&mlon=${salon.lng}#map=17/${salon.lat}/${salon.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-driftwood hover:text-ink hover:underline"
                  >
                    OpenStreetMap ↗
                  </a>
                </p>
              </>
            ) : (
              <p data-reveal className="mt-4 rounded-card bg-shell p-5 text-driftwood">
                Map coming soon.{" "}
                <a href={directions} target="_blank" rel="noopener noreferrer" className="font-medium text-red hover:underline">
                  Search for it on Google Maps ↗
                </a>
              </p>
            )}
          </section>

          <section className="mt-14">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 data-reveal data-no-split className="text-[28px] font-semibold tracking-tight">
                Reviews
              </h2>
              {avg !== null ? (
                <div className="flex items-center gap-2 text-[15px]">
                  <Stars value={avg} size={16} />
                  <span className="font-semibold tabular-nums">{avg.toFixed(1)}</span>
                </div>
              ) : null}
            </div>
            {reviews.length ? (
              <ul className="mt-6 divide-y divide-line">
                {reviews.map((r, i) => (
                  <li key={i} className="py-6">
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
            ) : (
              <p className="mt-4 text-driftwood">No reviews yet.</p>
            )}
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div data-reveal className="rounded-card bg-ink p-6 text-white">
            <p className="eyebrow text-white/70">{salon.kind}</p>
            <p className="mt-1 text-[24px] font-semibold">{salon.name}</p>
            <dl className="mt-6 space-y-4 border-t border-white/15 pt-6">
              {[
                ["Where", salon.address ?? salon.area],
                ["Opening hours", salon.hours],
                ["Phone", salon.phone],
              ]
                .filter((x): x is [string, string] => !!x[1])
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="eyebrow text-white/70">{k}</dt>
                    <dd className="mt-1 font-mono text-[14px]">{k === "Phone" ? <a href={`tel:${v.replace(/\s/g, "")}`} className="hover:underline">{v}</a> : v}</dd>
                  </div>
                ))}
            </dl>
            <a href={directions} target="_blank" rel="noopener noreferrer" className="mt-6 block rounded-control bg-red px-6 py-3.5 text-center font-semibold transition-colors hover:bg-red-deep">
              Get directions
            </a>
            {salon.link ? (
              <a href={salon.link} target="_blank" rel="noopener noreferrer" className="mt-3 block rounded-control border border-white/30 px-6 py-3 text-center font-medium hover:border-white">
                Website or booking ↗
              </a>
            ) : null}
          </div>
          <Link href="/salons" className="mt-4 inline-block text-[14px] text-driftwood hover:text-ink">
            ← All salons &amp; spas
          </Link>
        </aside>
      </Reveal>

      {more.length ? (
        <Reveal as="section" className="container-vm border-t border-line py-12 lg:py-20">
          <h2 data-reveal className="text-[28px] font-semibold tracking-tight">
            More salons &amp; spas
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {more.map((s) => (
              <li key={salonSlug(s)} data-reveal>
                <Link href={`/salons/${salonSlug(s)}`} className="group block rounded-card bg-shell p-5">
                  <p className="font-semibold group-hover:text-red">{s.name}</p>
                  <p className="mt-1 text-[14px] text-driftwood">
                    {s.kind} · {salonWhere(s)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}
    </>
  );
}
