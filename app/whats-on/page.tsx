import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import Seasons from "@/components/Seasons";
import { CHECKED, events, P } from "@/lib/data";

export const metadata: Metadata = { title: "What's on" };

export default function WhatsOn() {
  return (
    <>
      <PageHero image={P.maleSea} eyebrow="What's on" title="The year" accent="in the Maldives." intro="Monsoons, marine seasons and national holidays, dated so you can plan around them." />
      <Reveal as="section" className="container-vm py-12 lg:py-24">
        <div className="grid gap-10">
          <SectionHead eyebrow="Two monsoons" title="When" accent="to go" />
          <div data-reveal className="mx-auto w-full max-w-3xl rounded-card bg-shell p-6">
            <Seasons />
            <div className="mt-5 flex flex-wrap gap-4 font-mono text-[12px] text-driftwood">
              <span><i className="mr-1.5 inline-block size-2.5 rounded-sm bg-red" />Dry, Dec–Apr</span>
              <span><i className="mr-1.5 inline-block size-2.5 rounded-sm bg-red/45" />Shoulder</span>
              <span><i className="mr-1.5 inline-block size-2.5 rounded-sm bg-driftwood/20" />Wet, mantas &amp; surf</span>
            </div>
          </div>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e, i) => (
            <article key={e.title} data-reveal className={`flex min-h-[260px] flex-col rounded-card p-6 ${i % 3 === 1 ? "bg-ink text-white" : "bg-shell"}`}>
              <p className="font-mono text-[14px] text-red">{e.month}</p>
              <h3 className="mt-auto text-[28px] leading-8 font-semibold tracking-tight">{e.title}</h3>
              <p className="mt-2 opacity-80">{e.text}</p>
              <p className="mt-4 font-mono text-[12px] opacity-60">{e.where}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 font-mono text-[12px] text-driftwood">Islamic holidays move each year with the lunar calendar. {CHECKED}.</p>
      </Reveal>
    </>
  );
}
