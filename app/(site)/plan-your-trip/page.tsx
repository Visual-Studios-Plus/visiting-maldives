import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import Essentials from "@/components/Essentials";
import Seasons from "@/components/Seasons";
import { CHECKED, P } from "@/lib/data";

export const metadata: Metadata = { title: "Plan your trip" };

// Figures marked "verify" in the brand guide (p.07) must be confirmed before launch.
const facts = [
  ["Islands", "About 1,192"],
  ["Inhabited islands", "About 187"],
  ["Population", "About 515,000 (2022 census)"],
  ["Capital", "Malé"],
  ["Electricity", "230 V, 50 Hz, Type G and D"],
  ["Exchange rate", "1 USD = 15.42 MVR, as of Nov 2026"],
  ["Government hours", "Sun–Thu, 8am–4pm"],
];

// [mode, time, note, max minutes for the comparison bar]
const transfers: [string, string, string, number][] = [
  ["Speedboat", "15–90 min", "Kaafu, North and South Malé. Runs day and night.", 90],
  ["Seaplane", "25–60 min", "Most atolls. Daylight only. Booked by your resort.", 60],
  ["Domestic flight", "25–75 min", "Far atolls and Addu, then a boat.", 75],
  ["Public ferry", "1–3 hours", "Local islands near Malé. Cheapest, few Friday sailings.", 180],
];

export default function Plan() {
  return (
    <>
      <PageHero image={P.maleAerial} eyebrow="Plan your trip" title="Before you" accent="land." intro="Time, money, power and transfers, checked and dated for your arrival at Velana." />
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
            {transfers.map(([m, t, d, max]) => (
              <div key={m} data-reveal className="flex flex-col rounded-card bg-white/5 p-6">
                <div className="flex items-center gap-2 font-mono text-[12px] text-white/60">
                  MLE <span className="h-px flex-1 bg-white/20" /> Island
                </div>
                <h3 className="mt-8 text-[22px] leading-[26px] font-semibold">{m}</h3>
                <p className="mt-1 text-[32px] leading-none font-semibold tracking-tight">{t}</p>
                <div className="mt-4 h-1.5 rounded-full bg-white/10" aria-hidden>
                  <div className="h-full rounded-full bg-red" style={{ width: `${(max / 180) * 100}%` }} />
                </div>
                <p className="mt-4 flex-1 text-[15px] leading-snug text-white/70">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="container-vm grid gap-12 py-12 lg:grid-cols-2 lg:py-24">
        <div id="weather" className="scroll-mt-24">
          <SectionHead eyebrow="Weather" title="Warm all year," accent="two monsoons" />
          <p data-reveal className="mx-auto mt-5 max-w-xl text-center leading-snug text-driftwood">
            Around 30 °C all year. The dry northeast monsoon (Dec–Apr) brings calm seas; the southwest monsoon (May–Nov) brings showers, mantas and surf.
          </p>
          <div data-reveal className="mt-8 rounded-card bg-shell p-6">
            <Seasons />
          </div>
        </div>
        <div>
          <SectionHead eyebrow="Key facts" title="Checked" accent="and dated" />
          <dl data-reveal className="mt-8 divide-y divide-line border-y border-line">
            {facts.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 py-4">
                <dt className="text-driftwood">{k}</dt>
                <dd className="text-right font-medium">
                  {v}
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
