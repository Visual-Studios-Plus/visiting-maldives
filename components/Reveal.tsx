"use client";
import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, reduced, splitReveal } from "@/lib/gsap";

/** Fades and lifts every [data-reveal] descendant as it scrolls into view, in staggered batches. */
export default function Reveal({ children, className, as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "section" | "main" }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      splitReveal(ref.current);
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", ref.current);
      if (reduced()) {
        gsap.set(items, { opacity: 1 });
        return;
      }
      gsap.set(items, { y: 40, opacity: 0 });
      ScrollTrigger.batch(items, {
        start: "top 88%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, stagger: 0.08, duration: 1 }),
      });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
