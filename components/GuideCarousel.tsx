"use client";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, reduced, splitReveal } from "@/lib/gsap";
import { guides } from "@/lib/data";
import GuideCard from "./GuideCard";
import MobileGuides from "./MobileGuides";

/*
 * "Start with our most-read guides": an endless, slowly drifting row of guide cards.
 * - Infinite: cards are positioned on a loop each frame, so the row never ends.
 * - Centre focus: cards grow, straighten and brighten as they pass the middle, and turn
 *   away a little towards the edges (a gentle 3D arc).
 * - Control: drag or swipe with momentum, arrows glide one card, hovering pauses the drift.
 * - Entrance: title lines rise, then the cards sweep up into place.
 * Only transforms and opacity change per frame, with no layout reads.
 */
const SPEED = 38; // px per second of idle drift

export default function GuideCarousel() {
  const wrap = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const api = useRef<{ nudge: (dir: 1 | -1) => void }>({ nudge: () => {} });

  useGSAP(
    () => {
      splitReveal(wrap.current);
      const el = stage.current!;
      const cards = gsap.utils.toArray<HTMLElement>("[data-loop-card]", el);
      const still = reduced();

      // Geometry, measured once and on resize
      let W = 0, cardW = 0, step = 0, loop = 0;
      const measure = () => {
        W = el.clientWidth;
        cardW = cards[0].offsetWidth;
        step = cardW + 20;
        loop = step * cards.length;
      };
      measure();

      // Motion state — start with the first guide in the centre
      let pos = -(W / 2 - cardW / 2); // how far the row has travelled (px)
      let vel = still ? 0 : SPEED; // px/s, eases between drift, pause and fling
      const target = { speed: still ? 0 : SPEED };
      let dragging = false;

      const setters = cards.map((c) => ({
        x: gsap.quickSetter(c, "x", "px"),
        scale: gsap.quickSetter(c, "scale"),
        rot: gsap.quickSetter(c, "rotationY", "deg"),
        op: gsap.quickSetter(c, "opacity"),
        el: c,
      }));
      const wrapX = (v: number) => gsap.utils.wrap(-step, loop - step, v);

      const render = () => {
        setters.forEach((s, i) => {
          const x = wrapX(i * step - pos); // left edge of this card in the stage
          const centre = x + cardW / 2 - W / 2;
          const d = gsap.utils.clamp(-1.4, 1.4, centre / (W * 0.55));
          const a = Math.abs(d);
          s.x(x);
          s.scale(1 - Math.min(a, 1) * 0.16);
          s.rot(-d * 14);
          s.op(1 - Math.min(a, 1.4) * 0.38);
          s.el.style.zIndex = String(100 - Math.round(a * 50));
        });
      };

      const tick = (...[, dt]: [number, number]) => {
        if (!dragging) {
          vel += (target.speed - vel) * Math.min(1, dt / 400); // ease towards drift / pause
          pos += (vel * dt) / 1000;
        }
        render();
      };
      gsap.ticker.add(tick);
      render();

      // Arrows: glide exactly one card
      let glide: gsap.core.Tween | null = null;
      api.current.nudge = (dir) => {
        glide?.kill();
        const o = { p: pos };
        glide = gsap.to(o, { p: pos + dir * step, duration: 0.9, ease: "power3.inOut", onUpdate: () => (pos = o.p) });
      };

      // Hover pauses; leaving resumes
      const pause = () => (target.speed = 0);
      const resume = () => (target.speed = still ? 0 : SPEED);
      el.addEventListener("pointerenter", pause);
      el.addEventListener("pointerleave", resume);

      // Drag / swipe with momentum
      let startX = 0, lastX = 0, lastT = 0, moved = 0;
      const down = (e: PointerEvent) => {
        dragging = true;
        glide?.kill();
        startX = lastX = e.clientX;
        lastT = performance.now();
        moved = 0;
        el.setPointerCapture(e.pointerId);
      };
      const move = (e: PointerEvent) => {
        if (!dragging) return;
        const dx = e.clientX - lastX;
        const now = performance.now();
        pos -= dx;
        vel = (-dx / Math.max(1, now - lastT)) * 1000;
        lastX = e.clientX;
        lastT = now;
        moved = Math.abs(e.clientX - startX);
      };
      const up = () => {
        dragging = false; // vel keeps the fling, then eases back to the drift speed
      };
      // a drag is not a click
      const click = (e: MouseEvent) => {
        if (moved > 6) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
      el.addEventListener("click", click, true);

      const onResize = () => measure();
      window.addEventListener("resize", onResize);

      // Entrance: cards sweep up from below, centre first
      if (!still) {
        gsap.from(gsap.utils.toArray("[data-loop-inner]", el), {
          yPercent: 40,
          autoAlpha: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: { each: 0.06, from: "center" },
          scrollTrigger: { trigger: wrap.current, start: "top 60%", once: true, refreshPriority: -1 },
        });
        gsap.from("[data-land]", { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.1, scrollTrigger: { trigger: wrap.current, start: "top 60%", once: true, refreshPriority: -1 } });
      }

      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("resize", onResize);
      };
    },
    { scope: wrap },
  );

  const arrow = "grid size-11 place-items-center rounded-control border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white";
  // two laps of the list so the loop is always wider than the screen
  const loopCards = [...guides, ...guides];

  return (
    <section ref={wrap} className="overflow-x-clip py-12 lg:py-24">
      <MobileGuides />
      <div className="hidden sm:block">
        <div className="container-vm text-center">
          <span data-land className="eyebrow inline-block rounded-control bg-shell px-2.5 py-1 text-red">
            Travel guides
          </span>
          <h2 className="mt-4 text-[36px] leading-[1.03] font-semibold tracking-[-0.03em] sm:text-[48px] lg:text-[60px]">Start with our most-read guides</h2>
        </div>

        <div
          ref={stage}
          className="relative mt-12 h-[460px] cursor-grab touch-pan-y select-none [perspective:1400px] active:cursor-grabbing lg:h-[520px]"
          aria-label="Most-read guides, scrolling. Drag, or use the arrows."
          role="region"
        >
          {loopCards.map((g, i) => (
            <div
              key={`${g.slug}-${i}`}
              data-loop-card
              aria-hidden={i >= guides.length}
              className="absolute top-0 left-0 w-[320px] will-change-transform lg:w-[360px]"
            >
              <div data-loop-inner className="[backface-visibility:hidden] [transform:translateZ(0)]">
                <GuideCard guide={g} tall sizes="360px" />
              </div>
            </div>
          ))}
        </div>

        <div data-land className="mt-6 flex items-center justify-center gap-3">
          <button type="button" aria-label="Previous guide" onClick={() => api.current.nudge(-1)} className={arrow}>
            ←
          </button>
          <Link href="/things-to-do" className="rounded-control border border-line px-5 py-2.5 text-[15px] font-medium transition-colors hover:border-red hover:bg-red hover:text-white">
            View all guides
          </Link>
          <button type="button" aria-label="Next guide" onClick={() => api.current.nudge(1)} className={arrow}>
            →
          </button>
        </div>
      </div>
    </section>
  );
}
