import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import { atolls, P, photo } from "@/lib/data";

export const metadata: Metadata = { title: "Islands & atolls" };

export default function Atolls() {
  return (
    <>
      <PageHero
        image={P.shallows}
        eyebrow="Islands & atolls"
        title="26 atolls,"
        accent="one country."
        intro="From the capital's lagoons to Addu south of the equator. Pick an atoll by what you want to do and how far you want to travel."
      />
      {(["North", "Central", "South"] as const).map((region) => (
        <Reveal as="section" key={region} className="container-vm py-12 lg:py-20">
          <SectionHead eyebrow={`${region} Maldives`} title={`${region}ern`} accent="atolls" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {atolls
              .filter((a) => a.region === region)
              .map((a) => (
                <Link key={a.slug} data-reveal href={`/atolls/${a.slug}`} className="group overflow-hidden rounded-card border border-line">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={photo(a.image, 900)} alt={a.name} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                    <span className="font-thaana absolute top-3 right-4 text-[28px] text-white drop-shadow">{a.dhivehi}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-[22px] leading-[26px] font-semibold group-hover:text-red">{a.name}</h3>
                    <p className="mt-1 text-driftwood">{a.tagline}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {a.bestFor.map((b) => (
                        <span key={b} className="rounded-control bg-shell px-2.5 py-1 text-[13px]">
                          {b}
                        </span>
                      ))}
                    </div>
                    <p className="mt-5 border-t border-line pt-4 font-mono text-[12px] text-driftwood">MLE → {a.transfer}</p>
                  </div>
                </Link>
              ))}
          </div>
        </Reveal>
      ))}
    </>
  );
}
