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
      const show = (batch: Element[]) => gsap.to(batch, { y: 0, opacity: 1, stagger: 0.08, duration: 1, overwrite: true });
      ScrollTrigger.batch(items, { start: "top 88%", once: true, onEnter: show });

      // Safety net: anything already on (or above) the screen that hasn't revealed after a
      // moment — e.g. positions measured before photos loaded — is shown, never left invisible.
      const net = gsap.delayedCall(2.2, () => {
        const stuck = items.filter((el) => Number(gsap.getProperty(el, "opacity")) < 0.05 && el.getBoundingClientRect().top < window.innerHeight);
        if (stuck.length) show(stuck);
      });
      return () => net.kill();
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
