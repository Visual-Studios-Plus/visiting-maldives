import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Stars from "@/components/Stars";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import { P, photo } from "@/lib/data";
import { getAtolls, getStays } from "@/lib/content/store";
import { atollResorts, islandSlug } from "@/lib/resorts";

export const metadata: Metadata = { title: "Where to stay" };

const types = [
  { t: "Resort", d: "One island, one hotel. Seaplane or speedboat transfer, all-inclusive options." },
  { t: "Guesthouse", d: "On a local island, among the people who live there. Public ferry and a marked bikini beach." },
  { t: "Liveaboard", d: "A week on a dive boat, moving between atolls with the best conditions." },
];

export default async function Stay() {
  const stays = await getStays();
  // every resort island, grouped by atoll (north to south), each linking to its page
  const byAtoll = (await getAtolls())
    .filter((a) => !a.parent)
    .map((a) => ({ atoll: a, resorts: atollResorts(a), half: a.islands?.halfResort ?? [] }))
    .filter((g) => g.resorts.length || g.half.length);
  const total = byAtoll.reduce((n, g) => n + g.resorts.length + g.half.length, 0);
  return (
    <>
      <PageHero image={P.villas} eyebrow="Where to stay" title="Resort, guesthouse" accent="or boat?" intro="Three ways to stay, with honest prices and transfer times. Partner listings are always labelled." />
      <Reveal as="section" className="container-vm py-12 lg:py-24">
        <div className="grid gap-4 lg:grid-cols-3">
          {types.map((x, i) => (
            <div key={x.t} data-reveal className={`rounded-card p-8 ${i === 1 ? "bg-ink text-white" : "bg-shell"}`}>
              <p className="font-mono text-[12px] opacity-70">0{i + 1}</p>
              <h3 className="mt-6 text-[28px] leading-8 font-semibold tracking-tight">{x.t}s</h3>
              <p className="mt-3 opacity-85">{x.d}</p>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal as="section" className="container-vm pb-12 lg:pb-24">
        <SectionHead eyebrow="Places to stay" title="Our picks," accent="island by island" />
        <div className="mt-10 grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {stays.map((s) => (
            <Link key={s.slug} href={`/stay/${s.slug}`} data-reveal className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-card">
                <Image src={photo(s.image, 900)} alt={s.name} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
                <span className="absolute top-3 left-3 rounded-control bg-white px-2.5 py-1 text-[13px] font-medium">{s.type}</span>
                {s.partner && <span className="absolute top-3 right-3 rounded-control bg-ink px-2.5 py-1 text-[12px] text-white">Partner</span>}
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[22px] leading-[26px] font-semibold group-hover:underline">{s.name}</h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 leading-none">
                    <Stars value={s.rating} />
                    <span className="text-[14px] font-medium tabular-nums">{s.rating.toFixed(1)}</span>
                    <span className="text-[13px] whitespace-nowrap text-driftwood">({s.reviews.length} reviews)</span>
                  </div>
                  <p className="mt-1 text-[15px] text-driftwood">{s.note}</p>
                </div>
                <p className="shrink-0 text-right font-mono text-[12px] text-driftwood">
                  {s.atoll}
                  <br />
                  <span className="text-ink">{s.price}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Reveal>
      <Reveal as="section" className="container-vm border-t border-line py-12 lg:py-24">
        <SectionHead eyebrow="Resorts" title="Every resort island," accent="atoll by atoll" />
        <p data-reveal className="mx-auto mt-4 max-w-2xl text-center text-driftwood">
          {total} resort islands across {byAtoll.length} atolls. Where we have not named the resort yet, the island is listed by name and marked
          &ldquo;resort island&rdquo;.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {byAtoll.map(({ atoll, resorts, half }) => (
            <div key={atoll.slug} data-reveal className="rounded-card bg-shell p-6">
              <div className="flex items-baseline justify-between gap-3">
                <Link href={`/atolls/${atoll.slug}`} className="text-[20px] font-semibold hover:text-red">
                  {atoll.name}
                </Link>
                <span className="font-mono text-[12px] text-driftwood">{resorts.length + half.length}</span>
              </div>
              <ul className="mt-4 space-y-2">
                {resorts.map((r) => (
                  <li key={r.island}>
                    <Link href={`/atolls/${atoll.slug}/resorts/${islandSlug(r.island)}`} className="group flex items-baseline justify-between gap-3">
                      <span className="font-medium group-hover:text-red">{r.resort}</span>
                      <span className="shrink-0 text-[13px] text-driftwood">{r.named ? r.island : "resort island"}</span>
                    </Link>
                  </li>
                ))}
                {half.map((h) => (
                  <li key={h.island}>
                    <Link href={`/atolls/${atoll.slug}`} className="group flex items-baseline justify-between gap-3">
                      <span className="font-medium group-hover:text-red">{h.resort}</span>
                      <span className="shrink-0 text-[13px] text-driftwood">{h.island} · local island</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </>
  );
}
