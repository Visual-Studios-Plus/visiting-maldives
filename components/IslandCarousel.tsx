"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import IslandCard, { type IslandCardData } from "@/components/IslandCard";

/** Island cards in a swipeable row that snaps card by card, with arrow buttons. */
export default function IslandCarousel({ islands, label = "Islands" }: { islands: IslandCardData[]; label?: string }) {
  const row = useRef<HTMLDivElement>(null);
  const nudge = (dir: -1 | 1) => {
    const el = row.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };
  const arrow =
    "grid size-11 place-items-center rounded-control border border-line bg-white text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white";

  return (
    <div>
      <div
        ref={row}
        role="region"
        aria-label={`${label}, scrolling. Swipe, or use the arrows.`}
        tabIndex={0}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pt-2 pb-8 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:-mx-14 lg:scroll-px-14 lg:px-14"
      >
        {islands.map((c) => (
          <div key={c.name} className="w-[82vw] max-w-[360px] shrink-0 snap-start sm:w-[44vw] lg:w-[30%]">
            <IslandCard island={c} />
          </div>
        ))}
      </div>
      {islands.length > 1 ? (
        <div className="flex justify-center gap-2">
          <button type="button" aria-label="Previous island" onClick={() => nudge(-1)} className={arrow}>
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <button type="button" aria-label="Next island" onClick={() => nudge(1)} className={arrow}>
            <ChevronRight aria-hidden className="size-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
