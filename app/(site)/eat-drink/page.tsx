import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import { P, photo } from "@/lib/data";
import { getEats } from "@/lib/content/store";

export const metadata: Metadata = { title: "Eat & drink" };

const dishes = [
  ["Mas huni", "Smoked tuna, coconut, chilli and lime, with roshi."],
  ["Garudhiya", "Clear fish broth, eaten with rice, lime and chilli."],
  ["Hedhikaa", "Afternoon short eats: gulha, bajiya, fish cakes."],
  ["Bis keemiya", "Pastry filled with tuna, cabbage and egg."],
];

export default async function EatDrink() {
  const eats = await getEats();
  return (
    <>
      <PageHero image={P.restaurant} eyebrow="Eat & drink" title="Tuna, coconut" accent="and chilli." intro="From a MVR 60 breakfast in a Malé hotaa to a sunset tasting menu. Prices in MVR and USD." />
      <Reveal as="section" className="container-vm py-12 lg:py-24">
        <SectionHead eyebrow="Know the menu" title="Four dishes" accent="to try first" href="/guides/mas-huni-breakfast" cta="Mas huni guide" />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dishes.map(([n, d], i) => (
            <li key={n} data-reveal className="rounded-card bg-shell p-6">
              <span className="font-mono text-[12px] text-red">0{i + 1}</span>
              <h3 className="mt-8 text-[22px] leading-[26px] font-semibold">{n}</h3>
              <p className="mt-2 text-[15px] leading-[22px] text-driftwood">{d}</p>
            </li>
          ))}
        </ol>
      </Reveal>
      <Reveal as="section" className="bg-ink py-12 text-white lg:py-24">
        <div className="container-vm">
          <SectionHead dark eyebrow="Where to eat" title="From hotaa" accent="to sunset deck" />
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {eats.map((e) => (
              <article key={e.name} data-reveal className="group grid grid-cols-[120px_1fr] gap-5 rounded-card bg-white/5 p-3 transition-colors hover:bg-white/10 sm:grid-cols-[180px_1fr]">
                <div className="relative aspect-square overflow-hidden rounded-control">
                  <Image src={photo(e.image, 500)} alt={e.name} fill sizes="180px" className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
                </div>
                <div className="flex flex-col justify-center py-2 pr-3">
                  <p className="eyebrow text-white/50">
                    {e.kind} · {e.area}
                  </p>
                  <h3 className="mt-2 text-[22px] leading-[26px] font-semibold">{e.name}</h3>
                  <p className="mt-1 text-white/70">Try: {e.dish}</p>
                  <p className="mt-3 font-mono text-[12px] text-white/60">About {e.price} per person</p>
                </div>
              </article>
            ))}
          </div>
          <p data-reveal className="mt-10 text-[15px] text-white/60">
            Alcohol is served only in resorts, liveaboards and some Hulhumalé hotels, never on local islands. <Link href="/guides/local-islands-by-ferry" className="underline">Local island etiquette →</Link>
          </p>
        </div>
      </Reveal>
    </>
  );
}
