"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
}

export const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, SplitText, useGSAP };

/**
 * Line-by-line heading reveal (SplitText, as on columbus-travel.com). Call inside a component's
 * useGSAP so the split runs after hydration and is reverted before React removes the nodes.
 */
export function splitReveal(scope: Element | null) {
  if (!scope || reduced()) return;
  gsap.utils.toArray<HTMLElement>("h2:not([data-no-split]), [data-split]", scope).forEach((el) => {
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.09,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        }),
    });
  });
}
