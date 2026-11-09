"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { guides, photo, type Category } from "@/lib/data";
import { gsap, useGSAP, reduced } from "@/lib/gsap";

/*
 * Phone layout of "Most-read guides" (brand guide p.35), tuned for touch.
 * Motion (transform and opacity only, so it stays smooth on phones):
 * - Entrance: eyebrow, title and chips rise in; then the cards slide in from the right.
 * - Swipe depth: tracks the finger 1:1. The card in focus is full size; its neighbours
 *   ease back slightly and dim, and each photo drifts a little against the swipe (parallax).
 * - Filter change: the old cards fade out, then the new ones slide in.
 * - Press: the card sinks a touch on press (CSS `scale`, separate from the swipe transform).
 */
const chips: (Category | "All")[] = ["All", "Marine life", "Heritage", "Food"];

export default function MobileGuides() {
  const [active, setActive] = useState<Category | "All">("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const list = guides
    .filter((g) => active === "All" || g.category === active)
    .slice(0, 6);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);

  // Keep pagination dot synced with active swipe position
  useEffect(() => {
    const el = scrollTrackRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = el.firstElementChild
        ? (el.firstElementChild as HTMLElement).offsetWidth + 14
        : 290;
      const idx = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(Math.max(idx, 0), list.length - 1));
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [list.length]);

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
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: containerRef },
  );

  // Cards: entrance (first time on scroll, then on every filter change) + swipe depth and parallax
  useGSAP(
    () => {
      if (reduced()) return;
      const track = scrollTrackRef.current!;
      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-mobile-card]",
        track,
      );
      // The entrance moves an inner layer, never the card itself: the card is the scroll-snap
      // target, and moving it would shift the snap points so the row snaps to the wrong place.
      const layers = gsap.utils.toArray<HTMLElement>("[data-mg-enter]", track);
      const enter = {
        autoAlpha: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.07,
        ease: "expo.out",
      };
      gsap.set(layers, { autoAlpha: 0, x: 48 });
      if (firstRun.current) {
        firstRun.current = false;
        gsap.to(layers, {
          ...enter,
          scrollTrigger: { trigger: track, start: "top 85%", once: true },
        });
      } else {
        gsap.to(layers, enter);
      }

      // Swipe depth: read the track once per frame while it scrolls, write transforms only
      const faces = cards.map((c) => ({
        face: c.querySelector<HTMLElement>("[data-mg-face]")!,
        img: c.querySelector<HTMLElement>("[data-mg-img]")!,
      }));
      faces.forEach(({ img }) => gsap.set(img, { scale: 1.12 })); // room for the parallax drift
      // each card’s resting scroll position (layout only, so the depth transforms never skew it)
      let stops: number[] = [];
      let snap = 1;
      const measure = () => {
        const first = cards[0]?.offsetLeft ?? 0;
        stops = cards.map((c) => c.offsetLeft - first);
        snap = Math.max(1, (cards[1]?.offsetLeft ?? first + 1) - first);
      };
      measure();
      let frame = 0;
      const update = () => {
        frame = 0;
        const left = track.scrollLeft;
        faces.forEach(({ face, img }, i) => {
          const d = gsap.utils.clamp(-1.5, 1.5, (stops[i] - left) / snap); // 0 = in focus
          const a = Math.min(Math.abs(d), 1);
          gsap.set(face, {
            scale: 1 - a * 0.06,
            opacity: 1 - a * 0.35,
            force3D: true,
          });
          gsap.set(img, { xPercent: -d * 6, force3D: true });
        });
      };
      const onScroll = () => {
        if (!frame) frame = requestAnimationFrame(update);
      };
      update();
      track.addEventListener("scroll", onScroll, { passive: true });
      const onResize = () => {
        measure();
        onScroll();
      };
      window.addEventListener("resize", onResize);
      return () => {
        cancelAnimationFrame(frame);
        track.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
      };
    },
    { scope: containerRef, dependencies: [active] },
  );

  const choose = (c: Category | "All") => {
    if (c === active) return;
    const track = scrollTrackRef.current;
    const swap = () => {
      setActive(c);
      setActiveIndex(0);
      track?.scrollTo({ left: 0 });
    };
    if (reduced() || !track) return swap();
    // old cards step back and fade, then the new set slides in (see the effect above)
    gsap.to(gsap.utils.toArray("[data-mg-enter]", track), {
      autoAlpha: 0,
      x: -24,
      duration: 0.25,
      ease: "power2.in",
      stagger: 0.03,
      onComplete: swap,
    });
  };

  return (
    <div ref={containerRef} className="container-vm sm:hidden">
      <div data-mg-head className="flex items-center justify-between">
        <span className="eyebrow inline-block rounded-control bg-shell px-2.5 py-1 text-red">
          Travel guides
        </span>
        <span className="font-mono text-[11px] text-driftwood">
          {String(list.length).padStart(2, "0")} guides
        </span>
      </div>

      <h2
        data-mg-head
        data-no-split
        className="mt-3 text-[32px] leading-[1.05] font-semibold tracking-[-0.03em]"
      >
        Most-read <span className="accent">guides</span>
      </h2>

      {/* Filter chips bar */}
      <div
        data-mg-head
        className="no-scrollbar sticky top-[68px] z-30 -mx-4 mt-5 flex gap-2 overflow-x-auto border-b border-line bg-white px-4 py-3"
      >
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

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollTrackRef}
        className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-3.5 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-3 pt-1"
      >
        {list.map((g) => (
          <div
            key={g.slug}
            data-mobile-card
            className="w-[78vw] max-w-[300px] shrink-0 snap-start"
          >
            {/* enter: entrance and filter-change slide · face: swipe depth (set per frame) */}
            <div data-mg-enter>
              <div data-mg-face className="origin-center will-change-transform">
                <Link
                  href={`/guides/${g.slug}`}
                  className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-card bg-ink text-white shadow-[0_20px_40px_-16px_rgba(20,18,26,0.4)] transition-[scale] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.98] active:duration-75"
                >
                  <div
                    data-mg-img
                    className="absolute inset-0 will-change-transform"
                  >
                    <Image
                      src={photo(g.image, 800)}
                      alt={g.title}
                      fill
                      sizes="(max-width: 640px) 78vw, 300px"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 via-50% to-transparent" />

                  {/* Top Bar inside Card: Category & Read Time Pill */}
                  <div className="relative z-10 flex items-center justify-between p-4">
                    <span className="rounded-control bg-ink/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
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
                    <span className="mt-3.5 flex items-center justify-center gap-1.5 rounded-control bg-white py-2.5 text-center text-[14px] font-semibold text-ink transition-colors duration-200 group-active:bg-red group-active:text-white">
                      Read guide <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination: the active dot stretches smoothly */}
      {list.length > 1 && (
        <div
          className="mt-3 flex items-center justify-center gap-1.5"
          aria-hidden="true"
        >
          {list.map((g, i) => (
            <span
              key={g.slug}
              className={`h-1.5 rounded-full transition-[width,background-color] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
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
