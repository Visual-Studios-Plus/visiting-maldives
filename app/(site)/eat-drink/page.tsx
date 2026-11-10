import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import DishCard from "@/components/DishCard";
import EatsFilter from "@/components/EatsFilter";
import { DISH_KINDS, P, photo } from "@/lib/data";
import { getDishes, getEats } from "@/lib/content/store";

export const metadata: Metadata = {
  title: "Eat & drink",
  description: "What to eat in the Maldives, where to eat it, and what to know before you order: from a teashop breakfast to a sunset tasting menu.",
};

// Practical things to know before you order
const tips = [
  { title: "Alcohol", text: "Served only in resorts, liveaboards and some Hulhumalé hotels, never on local islands." },
  { title: "Ramadan", text: "Cafés on local islands close during the day for the fasting month. Resorts run as usual." },
  { title: "Fridays", text: "Many places close around midday for Friday prayers, then reopen in the afternoon." },
  { title: "Halal", text: "Food is halal throughout the country, and there's no pork on local islands." },
  { title: "Your bill", text: "Places that cater to visitors usually add a service charge and tourism tax. Check the menu before you order." },
  { title: "Paying", text: "Carry some rufiyaa (MVR) for local cafés. US dollars and cards are widely taken at resorts and in Malé." },
];

export default async function EatDrink() {
  const [eats, dishes] = await Promise.all([getEats(), getDishes()]);
  const sortedDishes = [...dishes].sort((a, b) => DISH_KINDS.indexOf(a.kind) - DISH_KINDS.indexOf(b.kind));

  return (
    <>
      <PageHero image={P.fishCurry} eyebrow="Eat & drink" title="Tuna, coconut" accent="and chilli." intro="What to eat, where to eat it and what to know before you order: from a MVR 60 teashop breakfast in Malé to a sunset tasting menu." />

      {/* What to eat */}
      {sortedDishes.length > 0 && (
        <Reveal as="section" className="container-vm py-12 lg:py-24">
          <SectionHead eyebrow="What to eat" title="Dishes to know" accent="before you sit down" href="/guides/mas-huni-breakfast" cta="Mas huni guide" />
          <div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {sortedDishes.map((d) => (
              <div key={d.name} data-reveal>
                <DishCard dish={d} />
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {/* Where to eat */}
      {eats.length > 0 && (
        <Reveal as="section" className="py-12 lg:py-24">
          <div className="container-vm">
            <SectionHead eyebrow="Where to eat" title="From teashop" accent="to sunset deck" />
            <p data-reveal className="mt-3 max-w-2xl text-[16px] leading-[1.5] text-driftwood">
              Each place comes with what to order. Prices are a typical meal per person.
            </p>
            <div data-reveal>
              <EatsFilter eats={eats} />
            </div>
          </div>
        </Reveal>
      )}

      {/* Eat like a local */}
      <Reveal as="section" className="container-vm py-12 lg:py-24">
        <SectionHead eyebrow="Eat like a local" title="Two places" accent="to start" />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {[
            {
              image: P.fishMarket,
              alt: "Fresh reef fish laid out at a market",
              title: "Malé fish market",
              text: "Come in the late afternoon when the boats land the day's tuna and reef fish. Watch the cutting, then eat the catch grilled at a café nearby.",
            },
            {
              image: P.teaAndShortEats,
              alt: "Fried pastries with a glass of milk tea",
              title: "A hotaa (teashop)",
              text: "Point at the hedhikaa on the counter (short eats such as bajiya and gulha), order sai, and share a table. Busiest at breakfast and in the afternoon.",
            },
          ].map((f) => (
            <article key={f.title} data-reveal className="group relative isolate min-h-[340px] overflow-hidden rounded-card bg-ink text-white sm:min-h-[400px]">
              <Image src={photo(f.image, 1400)} alt={f.alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="-z-10 object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
              <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-ink/95 via-ink/55 to-transparent" />
              <div className="flex h-full min-h-[inherit] flex-col justify-end p-6 sm:p-8">
                <h3 className="text-[26px] leading-tight font-semibold tracking-[-0.02em]">{f.title}</h3>
                <p className="mt-2 max-w-md text-[15px] leading-[1.5] text-white/85">{f.text}</p>
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      {/* Good to know */}
      <Reveal as="section" className="bg-ink py-12 text-white lg:py-24">
        <div className="container-vm">
          <SectionHead dark eyebrow="Good to know" title="Before you" accent="order" />
          <dl className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {tips.map((t) => (
              <div key={t.title} data-reveal className="border-t border-white/15 pt-5">
                <dt className="text-[18px] font-semibold tracking-[-0.01em]">{t.title}</dt>
                <dd className="mt-1.5 text-[15px] leading-[1.5] text-white/70">{t.text}</dd>
              </div>
            ))}
          </dl>
          <p data-reveal className="mt-12 text-[15px] text-white/60">
            Staying on a local island? <Link href="/guides/local-islands-by-ferry" className="underline underline-offset-4 hover:text-white">Read our local island etiquette →</Link>
          </p>
        </div>
      </Reveal>
    </>
  );
}
