"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, reduced } from "@/lib/gsap";

/*
 * Page transition: a Maldives-red curtain with the white ring mark.
 * - Leave: clicking an internal link sweeps the curtain up from the bottom, then navigates.
 * - Arrive: when the new route has rendered, the curtain lifts off the top and the page rises in.
 * Ignored for new-tab / modified clicks, downloads, external links and same-page anchors.
 * The curtain only animates transform-free clip-path and opacity, on one fixed layer.
 */
export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const first = useRef(true);

  // Leave: intercept internal link clicks
  useEffect(() => {
    if (reduced()) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // same page (incl. #anchors, ?filters)
      // take over before Next.js's own link handler (we listen in the capture phase)
      e.preventDefault();
      e.stopPropagation();
      if (busy.current) return;
      busy.current = true;

      const c = curtain.current!;
      gsap.killTweensOf([c, c.querySelector("[data-mark]")]);
      // navigate when the curtain is up — or after a fallback delay if frames aren't being drawn
      let gone = false;
      const go = () => {
        if (gone) return;
        gone = true;
        router.push(url.pathname + url.search + url.hash);
      };
      window.setTimeout(go, 900);
      gsap
        .timeline({ onComplete: go })
        .set(c, { display: "grid", clipPath: "inset(100% 0 0 0)" })
        .to(c, { clipPath: "inset(0% 0 0 0)", duration: 0.55, ease: "power4.inOut" })
        .fromTo(c.querySelector("[data-mark]"), { scale: 0.6, autoAlpha: 0, rotation: -90 }, { scale: 1, autoAlpha: 1, rotation: 0, duration: 0.45, ease: "back.out(2)" }, "-=0.2");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  // Arrive: the new route has rendered — lift the curtain and bring the page up
  useEffect(() => {
    if (first.current) {
      first.current = false; // the first load has its own loader
      return;
    }
    const c = curtain.current!;
    const main = document.querySelector("main");
    if (reduced() || !busy.current) {
      // back/forward or programmatic navigation: no curtain was raised
      busy.current = false;
      if (main && !reduced()) gsap.fromTo(main, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", clearProps: "transform,opacity,visibility" });
      return;
    }
    const done = () => {
      gsap.set(c, { display: "none" });
      if (main) gsap.set(main, { clearProps: "transform,opacity,visibility" });
      busy.current = false;
    };
    // fallback: never leave the curtain up if frames aren't being drawn
    const safety = window.setTimeout(done, 2000);
    gsap
      .timeline({
        delay: 0.1,
        onComplete: () => {
          clearTimeout(safety);
          done();
        },
      })
      .to(c.querySelector("[data-mark]"), { scale: 0.8, autoAlpha: 0, duration: 0.3, ease: "power2.in" })
      .to(c, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "power4.inOut" }, "-=0.05")
      .fromTo(main, { y: 60, autoAlpha: 0.4 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", clearProps: "transform,opacity,visibility" }, "<0.15");
  }, [pathname]);

  return (
    <div ref={curtain} className="pointer-events-none fixed inset-0 z-[90] hidden place-items-center bg-red" aria-hidden>
      <svg data-mark viewBox="8 8 32 32" className="size-20 opacity-0">
        <circle cx="24" cy="24" r="12.5" fill="none" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" strokeDasharray="62 16.54" transform="rotate(-7 24 24)" />
        <circle cx="27.4" cy="20.6" r="3" fill="#fff" />
      </svg>
    </div>
  );
}
