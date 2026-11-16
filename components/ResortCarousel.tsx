"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { isCommons } from "@/lib/data";

/*
 * Photo cards (places to stay, restaurants, salons, resorts) in a row that stays still: swipe or
 * drag-scroll it, or use the arrows, which only show when the cards don't all fit. Each card shows
 * once; nothing moves on its own.
 */

export type ResortCard = {
  island: string;
  resort: string;
  image: string;
  href: string;
  /** false: a resort island whose resort we have not named yet */
  named?: boolean;
  /** small line above the title (defaults to the island) */
  label?: string;
  /** button text (defaults to "View resort") */
  cta?: string;
};

export default function ResortCarousel({ resorts }: { resorts: ResortCard[] }) {
  const row = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  // which arrows make sense: none when everything fits, else only towards hidden cards
  const measure = useCallback(() => {
    const el = row.current;
    if (!el) return;
    // a little slack: snapping can leave the row a few pixels off either end
    setEdges({ start: el.scrollLeft <= 16, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 16 });
  }, []);

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    // first measurement right after layout (the observer may be late in a background tab)
    const first = requestAnimationFrame(measure);
    const late = setTimeout(measure, 300);
    return () => {
      cancelAnimationFrame(first);
      clearTimeout(late);
      ro.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [measure, resorts.length]);

  const nudge = (dir: -1 | 1) => {
    const el = row.current;
    const card = el?.firstElementChild as HTMLElement | null;
    el?.scrollBy({ left: dir * (card ? card.offsetWidth + 16 : el.clientWidth * 0.8), behavior: "smooth" });
  };
  const arrow =
    "grid size-11 place-items-center rounded-control border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-30";
  const fits = edges.start && edges.end;

  return (
    <div>
      <div
        ref={row}
        role="region"
        aria-label="Cards, scrolling. Swipe, or use the arrows."
        tabIndex={0}
        className="no-scrollbar container-vm mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6"
      >
        {resorts.map((r) => (
          <div key={r.href} className="w-[260px] shrink-0 snap-start sm:w-[300px] lg:w-[330px]">
            <Link
              href={r.href}
              className="group relative block aspect-[4/5] overflow-hidden rounded-card bg-ink text-white shadow-[0_24px_48px_-20px_rgba(20,18,26,0.45)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1.5 hover:shadow-[0_32px_56px_-20px_rgba(20,18,26,0.55)] motion-reduce:hover:translate-y-0"
            >
              <Image
                src={r.image}
                unoptimized={isCommons(r.image)}
                alt={`${r.resort}, ${r.island}`}
                fill
                sizes="(min-width:1024px) 330px, (min-width:640px) 300px, 260px"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/45 via-45% to-ink/5" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-mono text-[11px] tracking-wide text-white/75 uppercase">{r.label ?? (r.named === false ? "Resort island" : r.island)}</p>
                <h3 className="mt-1 line-clamp-2 text-[21px] leading-[25px] font-semibold tracking-tight">{r.resort}</h3>
                <span className="mt-3 inline-flex items-center gap-2 text-[14px] font-medium text-white/90">
                  {r.cta ?? (r.named === false ? "View island" : "View resort")}
                  <span aria-hidden data-arrow className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {!fits && (
        <div className="mt-2 flex items-center justify-center gap-3">
          <button type="button" aria-label="Previous" onClick={() => nudge(-1)} disabled={edges.start} className={arrow}>
            ←
          </button>
          <button type="button" aria-label="Next" onClick={() => nudge(1)} disabled={edges.end} className={arrow}>
            →
          </button>
        </div>
      )}
    </div>
  );
}
