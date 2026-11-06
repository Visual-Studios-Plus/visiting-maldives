import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import Essentials from "@/components/Essentials";
import Seasons from "@/components/Seasons";
import { CHECKED, P } from "@/lib/data";

export const metadata: Metadata = { title: "Plan your trip" };

const facts = [
  ["Islands", "About 1,192", "verify"],
  ["Inhabited islands", "About 187", "verify"],
  ["Population", "About 515,000 (2022 census)", "verify"],
  ["Capital", "Malé", ""],
  ["Electricity", "230 V, 50 Hz, Type G and D", ""],
  ["Exchange rate", "1 USD = 15.42 MVR, as of Nov 2026", ""],
  ["Government hours", "Sun–Thu, 8am–4pm", ""],
];

const transfers = [
  ["Speedboat", "15–90 min", "Kaafu, North and South Malé. Runs day and night."],
  ["Seaplane", "25–60 min", "Most atolls. Daylight only. Booked by your resort."],
  ["Domestic flight", "25–75 min", "Far atolls and Addu, then a boat."],
  ["Public ferry", "1–3 hours", "Local islands near Malé. Cheapest, few Friday sailings."],
];

export default function Plan() {
  return (
    <>
      <PageHero image={P.seaplane} eyebrow="Plan your trip" title="Before you" accent="land." intro="Time, money, power and transfers, checked and dated for your arrival at Velana." />
      <Reveal as="section" className="container-vm py-12 lg:py-24">
        <SectionHead eyebrow="Essentials" title="What to know" accent="before you fly" />
        <div className="mt-10">
          <Essentials />
        </div>
      </Reveal>

      <Reveal as="section" className="bg-ink py-12 text-white lg:py-24">
        <div id="transfers" className="container-vm scroll-mt-24">
          <SectionHead dark eyebrow="Transfers" title="From Velana" accent="to your island" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {transfers.map(([m, t, d]) => (
              <div key={m} data-reveal className="rounded-card border border-white/15 p-6">
                <p className="font-mono text-[12px] text-white/60">MLE →</p>
                <h3 className="mt-6 text-[22px] leading-[26px] font-semibold">{m}</h3>
                <p className="mt-1 text-[28px] font-semibold tracking-tight text-red">{t}</p>
                <p className="mt-3 text-[15px] leading-[22px] text-white/70">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="container-vm grid gap-12 py-12 lg:grid-cols-2 lg:py-24">
        <div id="weather" className="scroll-mt-24">
          <SectionHead eyebrow="Weather" title="Warm all year," accent="two monsoons" />
          <p data-reveal className="mt-5 leading-snug text-driftwood">
            Around 30 °C all year. The dry northeast monsoon (Dec–Apr) brings calm seas; the southwest monsoon (May–Nov) brings showers, mantas and surf.
          </p>
          <div data-reveal className="mt-8 rounded-card border border-line p-6">
            <Seasons />
          </div>
        </div>
        <div>
          <SectionHead eyebrow="Key facts" title="Checked" accent="and dated" />
          <dl data-reveal className="mt-8 divide-y divide-line border-y border-line">
            {facts.map(([k, v, verify]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 py-4">
                <dt className="text-driftwood">{k}</dt>
                <dd className="text-right font-medium">
                  {v}
                  {verify && <span className="ml-2 rounded-control bg-shell px-1.5 py-0.5 font-mono text-[11px] text-driftwood">to verify</span>}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 font-mono text-[12px] text-driftwood">Sources: Maldives Bureau of Statistics, Ministry of Tourism. {CHECKED}.</p>
        </div>
      </Reveal>
    </>
  );
}
