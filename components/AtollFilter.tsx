"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { atolls, photo, type Atoll } from "@/lib/data";

const regions = ["All", "North", "Central", "South"] as const;

/** All atolls in one grid, filtered by region with the same pinned chip bar as Things to do. */
export default function AtollFilter() {
  const [region, setRegion] = useState<(typeof regions)[number]>("All");
  const grid = useRef<HTMLDivElement>(null);
  const list = atolls.filter((a) => region === "All" || a.region === region);

  useGSAP(() => gsap.fromTo("[data-card]", { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.7 }), {
    scope: grid,
    dependencies: [region],
  });

  return (
    <div className="min-h-[calc(100svh/var(--z)-68px)]">
      <div className="sticky top-[68px] z-30 -mx-4 border-b border-line bg-white px-4 py-4 sm:-mx-8 sm:px-8 lg:-mx-14 lg:px-14">
        <div className="no-scrollbar flex gap-2 overflow-x-auto sm:justify-center" role="tablist">
          {regions.map((r) => (
            <button
              key={r}
              type="button"
              role="tab"
              aria-selected={region === r}
              onClick={() => setRegion(r)}
              className={`inline-flex min-h-11 shrink-0 items-center rounded-control px-4 text-[15px] font-medium transition-colors ${region === r ? "bg-ink text-white" : "bg-shell text-ink hover:bg-line"}`}
            >
              {r === "All" ? "All atolls" : `${r}`}
            </button>
          ))}
        </div>
      </div>
      <div ref={grid} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((a) => (
          <AtollCard key={a.slug} atoll={a} n={atolls.indexOf(a) + 1} />
        ))}
      </div>
    </div>
  );
}

// Same family as the guide card (brand guide p.24): full photo, name over a dark fade,
// transfer pill, best-for chips, full-width white button.
function AtollCard({ atoll: a, n }: { atoll: Atoll; n: number }) {
  return (
    <Link
      data-card
      href={`/atolls/${a.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-card bg-ink text-white transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1.5 motion-reduce:hover:translate-y-0 hover:shadow-[0_32px_56px_-20px_rgba(20,18,26,0.55)] shadow-[0_24px_48px_-20px_rgba(20,18,26,0.45)]"
    >
      <Image src={photo(a.image, 900)} alt={a.name} fill sizes="(min-width:1024px) 33vw, (min-width:600px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/60 via-50% to-ink/10" />
      <span className="absolute top-4 left-5 font-mono text-[12px] text-white/85">
        {String(n).padStart(2, "0")} · {a.region}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="flex items-end justify-between gap-3">
          <h3 className="text-[28px] leading-8 font-semibold tracking-tight">{a.name}</h3>
          <span className="mb-1 shrink-0 rounded-control bg-white px-2.5 py-1 text-[12px] leading-4 font-semibold text-ink">{a.transfer}</span>
        </div>
        <p className="mt-1.5 leading-snug text-white/85">{a.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {a.bestFor.map((b) => (
            <span key={b} className="rounded-control bg-white/25 px-2.5 py-1 text-[12px] leading-4 font-medium">
              {b}
            </span>
          ))}
        </div>
        <span className="mt-4 block rounded-control bg-white py-3 text-center text-[15px] font-semibold text-ink transition-colors group-hover:bg-red group-hover:text-white">
          Explore atoll <span aria-hidden data-arrow className="inline-block">→</span>
        </span>
      </div>
    </Link>
  );
}
