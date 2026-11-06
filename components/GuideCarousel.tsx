"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";
import { guides } from "@/lib/data";
import GuideCard from "./GuideCard";
import MobileGuides from "./MobileGuides";

/** Guide p.33: tall photo cards with the featured guide in the centre, arrows either side of "View all guides". */
export default function GuideCarousel() {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(1);

  const { contextSafe } = useGSAP(
    () => {
      layout(active, true);
      if (!reduced())
        gsap.from("[data-slide]", {
          y: 80,
          opacity: 0,
          stagger: 0.08,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: wrap.current, start: "top 75%", once: true },
        });
      const onResize = () => layout(activeRef.current, true);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    { scope: wrap },
  );
  const activeRef = useRef(active);

  function layout(i: number, instant = false) {
    const t = track.current;
    if (!t) return;
    const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", t);
    const s = slides[i];
    const x = t.parentElement!.clientWidth / 2 - (s.offsetLeft + s.offsetWidth / 2);
    const d = instant ? 0 : 0.9;
    gsap.to(t, { x, duration: d, ease: "power3.inOut" });
    slides.forEach((el, j) =>
      gsap.to(el, { scale: j === i ? 1 : 0.88, opacity: Math.abs(j - i) > 2 ? 0.4 : j === i ? 1 : 0.75, duration: d, ease: "power3.inOut" }),
    );
  }

  const go = contextSafe((dir: 1 | -1) => {
    const next = (activeRef.current + dir + guides.length) % guides.length;
    activeRef.current = next;
    setActive(next);
    layout(next);
  });

  const arrow = "grid size-11 place-items-center rounded-control border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white";

  return (
    <section ref={wrap} className="overflow-x-clip py-12 lg:py-24">
      <MobileGuides />
      <div className="hidden sm:block">
      <div className="container-vm text-center">
        <span className="eyebrow inline-block rounded-control bg-shell px-2.5 py-1 text-red">Travel guides</span>
        <h2 className="mt-4 text-[36px] leading-[1.03] font-semibold tracking-[-0.03em] sm:text-[48px] lg:text-[60px]">
          Start with <span className="accent">our most-read guides</span>
        </h2>
      </div>
      <div className="mt-12">
        <div ref={track} className="flex w-max gap-4">
          {guides.map((g, i) => (
            <div
              key={g.slug}
              data-slide
              onClick={(e) => {
                if (i !== activeRef.current) {
                  e.preventDefault();
                  go(i > activeRef.current ? 1 : -1);
                }
              }}
              className="w-[78vw] shrink-0 sm:w-[340px] lg:w-[380px]"
            >
              <GuideCard guide={g} tall sizes="380px" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 flex items-center justify-center gap-3">
        <button type="button" aria-label="Previous guide" onClick={() => go(-1)} className={arrow}>
          ←
        </button>
        <Link href="/things-to-do" className="rounded-control border border-line px-5 py-2.5 text-[15px] font-medium transition-colors hover:border-red hover:bg-red hover:text-white">
          View all guides
        </Link>
        <button type="button" aria-label="Next guide" onClick={() => go(1)} className={arrow}>
          →
        </button>
      </div>
      </div>
    </section>
  );
}
