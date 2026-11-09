"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { guides, photo, type Category, type Guide } from "@/lib/data";
import { gsap, useGSAP, reduced } from "@/lib/gsap";
import DepthCarousel, { type DepthCarouselControl } from "./DepthCarousel";

/*
 * Phone layout of "Most-read guides" (brand guide p.35). Desktop uses GuideCarousel instead.
 * - Entrance: eyebrow, title and chips rise in; then the card stack fades up.
 * - Depth carousel: guide cards recede along a 3D rail; swipe (with momentum), tap a card in the
 *   back to bring it forward, tap the front card to open the guide. Autoplays, pausing on touch.
 * - Filter change: the stack steps back and fades, then the new set comes forward.
 */
const chips: (Category | "All")[] = ["All", "Marine life", "Heritage", "Food"];

function Card({ g }: { g: Guide }) {
  return (
    <Link
      href={`/guides/${g.slug}`}
      draggable={false}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-card bg-ink text-white shadow-[0_20px_40px_-16px_rgba(20,18,26,0.45)]"
    >
      <Image src={photo(g.image, 800)} alt={g.title} fill sizes="260px" draggable={false} className="pointer-events-none object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 via-50% to-transparent" />

      <div className="relative z-10 flex items-center justify-between p-4">
        <span className="rounded-control bg-ink/70 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-white uppercase">{g.category}</span>
        <span className="rounded-control bg-white px-2.5 py-1 text-[11px] leading-4 font-semibold text-ink shadow-sm">{g.read} min</span>
      </div>

      <div className="relative z-10 p-4 pt-0">
        <h3 className="line-clamp-2 text-[20px] leading-[25px] font-semibold tracking-[-0.01em]">{g.short}</h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-[18px] text-white/85">{g.summary}</p>
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="rounded-control bg-white/25 px-2 py-0.5 text-[11px] font-medium text-white">{g.season}</span>
          <span className="rounded-control bg-white/25 px-2 py-0.5 text-[11px] font-medium text-white">{g.atoll}</span>
        </div>
        <span className="mt-3.5 flex items-center justify-center gap-1.5 rounded-control bg-white py-2.5 text-center text-[14px] font-semibold text-ink transition-colors duration-200 group-active:bg-red group-active:text-white">
          Read guide <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

export default function MobileGuides() {
  const [active, setActive] = useState<Category | "All">("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const list = guides.filter((g) => active === "All" || g.category === active).slice(0, 6);
  const containerRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<DepthCarouselControl | null>(null);
  const firstRun = useRef(true);

  // Heading entrance (once)
  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from("[data-mg-head]", {
        y: 24,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: containerRef.current, start: "top 85%", once: true },
      });
    },
    { scope: containerRef },
  );

  // Stack entrance: on first scroll into view, then on every filter change
  useGSAP(
    () => {
      if (reduced()) return;
      const from = { autoAlpha: 0, y: 40, scale: 0.94 };
      const to = { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: "expo.out" };
      if (firstRun.current) {
        firstRun.current = false;
        gsap.fromTo(stackRef.current, from, { ...to, scrollTrigger: { trigger: stackRef.current, start: "top 90%", once: true } });
      } else {
        gsap.fromTo(stackRef.current, from, to);
      }
    },
    { scope: containerRef, dependencies: [active] },
  );

  const choose = (c: Category | "All") => {
    if (c === active) return;
    const swap = () => {
      setActive(c);
      setActiveIndex(0);
    };
    if (reduced()) return swap();
    // the stack steps back and fades, then the new set comes forward (effect above)
    gsap.to(stackRef.current, { autoAlpha: 0, scale: 0.94, duration: 0.25, ease: "power2.in", onComplete: swap });
  };

  return (
    <div ref={containerRef} className="container-vm sm:hidden">
      <div data-mg-head className="flex items-center justify-between">
        <span className="eyebrow inline-block rounded-control bg-shell px-2.5 py-1 text-red">Travel guides</span>
        <span className="font-mono text-[11px] text-driftwood">{String(list.length).padStart(2, "0")} guides</span>
      </div>

      <h2 data-mg-head data-no-split className="mt-3 text-[32px] leading-[1.05] font-semibold tracking-[-0.03em]">
        Most-read <span className="accent">guides</span>
      </h2>

      {/* Filter chips bar */}
      <div data-mg-head className="no-scrollbar sticky top-[68px] z-30 -mx-4 mt-5 flex gap-2 overflow-x-auto border-b border-line bg-white px-4 py-3">
        {chips.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => choose(c)}
            aria-pressed={active === c}
            className={`inline-flex min-h-11 shrink-0 items-center rounded-control px-3.5 text-[14px] font-medium transition-colors duration-300 ${active === c ? "bg-ink text-white" : "bg-shell text-ink active:bg-line"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Depth carousel: remounted per filter so it starts on the first guide */}
      <div ref={stackRef} className="relative -mx-4 mt-4 h-[400px] overflow-x-clip">
        <DepthCarousel
          key={active}
          items={list}
          getKey={(g) => g.slug}
          getLabel={(g, i) => `${i + 1} of ${list.length}: ${g.title}`}
          renderItem={(g) => <Card g={g} />}
          controlRef={carouselRef}
          onChange={(i) => setActiveIndex(i)}
          label="Most-read guides. Swipe, or tap a card behind to bring it forward."
          cardWidth={256}
          cardHeight={340}
          radius={12}
          depth={150}
          spread={34}
          tilt={18}
          tiltDirection="right"
          perspective={1100}
          visibleCards={3}
          falloff={0.22}
          gutter={36}
          duration={650}
          autoplay
          autoplayDelay={4000}
        />
      </div>

      {/* Pagination: the active dot stretches smoothly; tap to jump */}
      {list.length > 1 && (
        <div className="mt-1 flex items-center justify-center gap-1" role="tablist" aria-label="Guides">
          {list.map((g, i) => (
            <button
              key={g.slug}
              type="button"
              role="tab"
              aria-selected={activeIndex === i}
              aria-label={`Show ${g.short}`}
              onClick={() => carouselRef.current?.goTo(i)}
              className="grid h-6 place-items-center px-1"
            >
              <span
                className={`block h-1.5 rounded-full transition-[width,background-color] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${activeIndex === i ? "w-6 bg-red" : "w-1.5 bg-line"}`}
              />
            </button>
          ))}
        </div>
      )}

      <Link
        href="/things-to-do"
        className="mt-5 block rounded-control border border-line py-3 text-center font-medium transition-colors hover:border-red hover:bg-red hover:text-white active:bg-shell"
      >
        View all guides
      </Link>
    </div>
  );
}
