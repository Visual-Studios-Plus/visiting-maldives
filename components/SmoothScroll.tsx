"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, reduced } from "@/lib/gsap";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync, plus the
 * housekeeping every page change needs:
 * - jump Lenis to the top at once (otherwise it eases back towards the old scroll position);
 * - re-measure every ScrollTrigger once the new page has laid out, and again as its photos
 *   load (late images move content, so reveals would fire at the wrong point or not at all).
 */
export default function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (reduced()) return;
    const l = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.current = l;
    l.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("lenis");
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      lenis.current = null;
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  useEffect(() => {
    // new page: start at the top, immediately
    lenis.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);

    // re-measure after layout, then as each image in the page finishes loading
    let pending = 0;
    const refresh = () => {
      cancelAnimationFrame(pending);
      // safe = true: if the user is mid-scroll, wait until scrolling stops. Re-measuring
      // during a scrubbed, pinned animation resets it visibly (the card jumps back and replays).
      pending = requestAnimationFrame(() => ScrollTrigger.refresh(true));
    };
    const t1 = window.setTimeout(refresh, 120);
    const t2 = window.setTimeout(refresh, 900);
    // Only images that can change the layout. `fill` images sit in a box that is already
    // sized, so their loading never moves anything and must not trigger a re-measure.
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("main img")).filter((i) => !i.complete && i.dataset.nimg !== "fill");
    imgs.forEach((i) => i.addEventListener("load", refresh, { once: true }));

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      cancelAnimationFrame(pending);
      imgs.forEach((i) => i.removeEventListener("load", refresh));
    };
  }, [pathname]);

  return null;
}
