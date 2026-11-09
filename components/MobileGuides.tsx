"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { guides, photo, type Category } from "@/lib/data";
import { gsap, useGSAP, reduced } from "@/lib/gsap";

// Phone layout of "Most-read guides" (brand guide p.35) optimized for mobile touch ergonomics & scanning.
const chips: (Category | "All")[] = ["All", "Marine life", "Heritage", "Food"];

export default function MobileGuides() {
  const [active, setActive] = useState<Category | "All">("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const list = guides.filter((g) => active === "All" || g.category === active).slice(0, 6);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);

  // Keep pagination dot synced with active swipe position
  useEffect(() => {
    const el = scrollTrackRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 14 : 290;
      const idx = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(Math.max(idx, 0), list.length - 1));
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [list.length]);

  useGSAP(
    () => {
      if (reduced()) return;

      const cardEls = gsap.utils.toArray<HTMLElement>("[data-mobile-card]", containerRef.current);

      gsap.fromTo(
        cardEls,
        {
          autoAlpha: 0,
          x: 32,
          scale: 0.96,
        },
        {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: scrollTrackRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    },
    { scope: containerRef, dependencies: [active] }
  );

  return (
    <div ref={containerRef} className="container-vm sm:hidden">
      <div className="flex items-center justify-between">
        <span className="eyebrow inline-block rounded-control bg-shell px-2.5 py-1 text-red">Travel guides</span>
        <span className="font-mono text-[11px] text-driftwood">
          {String(list.length).padStart(2, "0")} guides
        </span>
      </div>

      <h2 className="mt-3 text-[32px] leading-[1.05] font-semibold tracking-[-0.03em]">
        Most-read <span className="accent">guides</span>
      </h2>

      {/* Filter chips bar */}
      <div className="no-scrollbar sticky top-[68px] z-30 -mx-4 mt-5 flex gap-2 overflow-x-auto border-b border-line bg-white px-4 py-3">
        {chips.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setActive(c);
              setActiveIndex(0);
              if (scrollTrackRef.current) {
                scrollTrackRef.current.scrollTo({ left: 0, behavior: "smooth" });
              }
            }}
            className={`inline-flex min-h-11 shrink-0 items-center rounded-control px-3.5 text-[14px] font-medium transition-colors ${active === c ? "bg-ink text-white" : "bg-shell text-ink active:bg-line"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollTrackRef}
        className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 pb-3 pt-1 scroll-smooth"
      >
        {list.map((g) => (
          <div
            key={g.slug}
            data-mobile-card
            className="w-[78vw] max-w-[300px] shrink-0 snap-start will-change-transform"
          >
            <Link
              href={`/guides/${g.slug}`}
              className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-card bg-ink text-white shadow-[0_20px_40px_-16px_rgba(20,18,26,0.4)] transition-transform duration-300 active:scale-[0.98]"
            >
              <Image
                src={photo(g.image, 800)}
                alt={g.title}
                fill
                sizes="(max-width: 640px) 78vw, 300px"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 via-50% to-transparent" />

              {/* Top Bar inside Card: Category & Read Time Pill */}
              <div className="relative z-10 flex items-center justify-between p-4">
                <span className="rounded-control bg-ink/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                  {g.category}
                </span>
                <span className="rounded-control bg-white px-2.5 py-1 text-[11px] leading-4 font-semibold text-ink shadow-sm">
                  {g.read} min
                </span>
              </div>

              {/* Bottom Content Area */}
              <div className="relative z-10 p-4 pt-0">
                <h3 className="line-clamp-2 text-[20px] leading-[25px] font-semibold tracking-[-0.01em]">
                  {g.short}
                </h3>
                <p className="mt-1 line-clamp-2 text-[13px] leading-[18px] text-white/85">
                  {g.summary}
                </p>

                {/* Season & Atoll metadata */}
                <div className="mt-2.5 flex items-center gap-1.5">
                  <span className="rounded-control bg-white/25 px-2 py-0.5 text-[11px] font-medium text-white">
                    {g.season}
                  </span>
                  <span className="rounded-control bg-white/25 px-2 py-0.5 text-[11px] font-medium text-white">
                    {g.atoll}
                  </span>
                </div>

                {/* Direct Action Button */}
                <span className="mt-3.5 flex items-center justify-center gap-1.5 rounded-control bg-white py-2.5 text-center text-[14px] font-semibold text-ink transition-colors group-hover:bg-red group-hover:text-white group-active:bg-red group-active:text-white">
                  Read guide <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Ergonomic Pagination Indicators */}
      {list.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5" aria-hidden="true">
          {list.map((g, i) => (
            <span
              key={g.slug}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === i ? "w-6 bg-red" : "w-1.5 bg-line"
              }`}
            />
          ))}
        </div>
      )}

      <Link
        href="/things-to-do"
        className="mt-6 block rounded-control border border-line py-3 text-center font-medium transition-colors hover:border-red hover:bg-red hover:text-white active:bg-shell"
      >
        View all guides
      </Link>
    </div>
  );
}
