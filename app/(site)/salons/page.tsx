import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { P, isCommons, photo, salonSlug, salonWhere } from "@/lib/data";
import { getSalons } from "@/lib/content/store";

export const metadata: Metadata = { title: "Salons & spas" };

export default async function Salons() {
  const salons = await getSalons();
  return (
    <>
      <PageHero image={P.villaRoom} eyebrow="Salons & spas" title="Salons" accent="and spas." intro="Massages, haircuts and treatments on local islands, each with opening hours, a map and directions." />
      <Reveal as="section" className="container-vm py-12 lg:py-20">
        {salons.length ? (
          <div className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {salons.map((s) => (
              <Link key={salonSlug(s)} href={`/salons/${salonSlug(s)}`} data-reveal className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-shell">
                  <Image src={photo(s.image, 900)} unoptimized={isCommons(s.image)} alt={s.name} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute top-3 left-3 rounded-control bg-white px-2.5 py-1 text-[13px] font-medium">{s.kind}</span>
                </div>
                <h3 className="mt-4 text-[22px] leading-[26px] font-semibold group-hover:underline">{s.name}</h3>
                <p className="mt-1 text-[15px] text-driftwood">{salonWhere(s)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-driftwood">No salons or spas listed yet.</p>
        )}
      </Reveal>
    </>
  );
}
