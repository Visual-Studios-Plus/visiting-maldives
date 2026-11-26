"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import PhotoCard, { type ResortCard } from "@/components/PhotoCard";

/*
 * Photo cards (places to stay, restaurants, salons, resorts) in a row that stays still: swipe or
 * drag-scroll it, or use the arrows, which only show when the cards don't all fit. Each card shows
 * once; nothing moves on its own.
 */

export type { ResortCard } from "@/components/PhotoCard";

/** `inColumn`: inside a page column (no page-width padding), e.g. an island page's left column */
export default function ResortCarousel({ resorts, inColumn = false }: { resorts: ResortCard[]; inColumn?: boolean }) {
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
        className={`no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 ${inColumn ? "mt-5" : "container-vm mt-10"}`}
      >
        {resorts.map((r, i) => (
          <div key={r.href ?? `${r.resort}-${i}`} className="w-[260px] shrink-0 snap-start sm:w-[300px] lg:w-[330px]">
            <PhotoCard card={r} />
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
