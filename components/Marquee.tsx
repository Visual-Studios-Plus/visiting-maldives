"use client";
import { useRef } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";

export default function Marquee({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (reduced()) return;
      const tween = gsap.to("[data-marquee]", { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
      // Speed up briefly with scroll velocity
      let last = window.scrollY;
      const onScroll = () => {
        const v = Math.min(Math.abs(window.scrollY - last), 60);
        last = window.scrollY;
        gsap.to(tween, { timeScale: 1 + v / 8, duration: 0.2, overwrite: true, onComplete: () => void gsap.to(tween, { timeScale: 1, duration: 1 }) });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    },
    { scope: ref },
  );
  const row = [...items, ...items];
  return (
    <div ref={ref} className="overflow-hidden" aria-hidden>
      <div data-marquee className="flex w-max">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 pr-8 text-[44px] leading-none font-semibold tracking-[-0.03em] whitespace-nowrap sm:text-[72px]">
            {t}
            <svg viewBox="0 0 48 48" className="size-8 sm:size-12">
              <circle cx="24" cy="24" r="12.5" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeDasharray="62 16.54" transform="rotate(-7 24 24)" />
              <circle cx="27.4" cy="20.6" r="3" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
