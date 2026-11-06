"use client";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { categories, guides, type Category } from "@/lib/data";
import GuideCard from "./GuideCard";

export default function GuideFilter() {
  const params = useSearchParams();
  const initial = (params.get("c") as Category | null) ?? "All";
  const [active, setActive] = useState<Category | "All">(categories.includes(initial as Category) ? initial : "All");
  const [q, setQ] = useState(params.get("q") ?? "");
  const grid = useRef<HTMLDivElement>(null);

  const term = q.trim().toLowerCase();
  const list = guides.filter(
    (g) =>
      (active === "All" || g.category === active) &&
      (!term || `${g.title} ${g.summary} ${g.atoll} ${g.category}`.toLowerCase().includes(term)),
  );

  useGSAP(
    () => {
      gsap.fromTo("[data-card]", { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.7 });
    },
    { scope: grid, dependencies: [active, term] },
  );

  const chip = (on: boolean) =>
    `rounded-control px-4 py-2.5 text-[15px] font-medium leading-5 transition-colors ${on ? "bg-ink text-white" : "bg-shell text-ink hover:bg-line"}`;

  return (
    <div className="min-h-[calc(100svh/var(--z)-68px)]">
      <div className="sticky top-[68px] z-30 -mx-4 flex flex-col gap-4 border-b border-line bg-white px-4 py-4 sm:-mx-8 sm:px-8 lg:-mx-14 lg:flex-row lg:items-center lg:justify-between lg:px-14">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist">
          {(["All", ...categories] as const).map((c) => (
            <button key={c} type="button" role="tab" aria-selected={active === c} onClick={() => setActive(c)} className={`${chip(active === c)} shrink-0`}>
              {c}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3 rounded-control border border-line px-4 lg:w-80">
          <span className="sr-only">Search guides</span>
          <svg viewBox="0 0 24 24" className="size-5 text-driftwood" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search guides, islands, atolls" className="h-11 flex-1 bg-transparent outline-none" />
        </label>
      </div>
      <div ref={grid} className="mt-8 grid gap-5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((g) => (
          <div key={g.slug} data-card>
            <GuideCard guide={g} />
          </div>
        ))}
      </div>
      {list.length === 0 && <p className="mt-10 text-driftwood">No guides match that yet. Try another atoll or interest.</p>}
    </div>
  );
}
