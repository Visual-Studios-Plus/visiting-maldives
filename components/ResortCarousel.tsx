"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";

/*
 * Resort islands as photo cards: an endless, slowly drifting row, same feel as the guide carousel.
 * Drag, swipe or use the arrows. It only animates while on screen, and stills under reduced motion.
 */
const SPEED = 26; // px per second of idle drift

export type ResortCard = {
  island: string;
  resort: string;
  image: string;
  href: string;
};

export default function ResortCarousel({ resorts }: { resorts: ResortCard[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const api = useRef<{ nudge: (dir: 1 | -1) => void }>({ nudge: () => {} });

  useGSAP(
    () => {
      const el = stage.current!;
      const cards = gsap.utils.toArray<HTMLElement>("[data-loop-card]", el);
      const still = reduced();

      let W = 0, cardW = 0, step = 0, loop = 0;
      const measure = () => {
        W = el.clientWidth;
        cardW = cards[0].offsetWidth;
        step = cardW + (W < 640 ? 14 : 20);
        loop = step * cards.length;
      };
      measure();

      let pos = -(W / 2 - cardW / 2); // first card centred
      let vel = still ? 0 : SPEED;
      const target = { speed: still ? 0 : SPEED };
      let dragging = false;

      const setters = cards.map((c) => ({
        el: c,
        x: gsap.quickSetter(c, "x", "px") as (v: number) => void,
        shown: undefined as boolean | undefined,
      }));
      const wrapX = (v: number) => gsap.utils.wrap(-step, loop - step, v);

      // hide and skip cards that are off screen, so only the visible few are drawn
      const render = () => {
        for (let i = 0; i < setters.length; i++) {
          const s = setters[i];
          const x = wrapX(i * step - pos);
          const onScreen = x > -cardW - 60 && x < W + 60;
          if (onScreen !== s.shown) {
            s.shown = onScreen;
            s.el.style.visibility = onScreen ? "" : "hidden";
            s.el.style.willChange = onScreen ? "transform" : "auto";
          }
          if (onScreen) s.x(x);
        }
      };

      const tick = (...[, dt]: [number, number]) => {
        if (!dragging) {
          vel += (target.speed - vel) * Math.min(1, dt / 400);
          pos += (vel * dt) / 1000;
        }
        render();
      };
      let running = false;
      const run = (on: boolean) => {
        if (on === running) return;
        running = on;
        if (on) gsap.ticker.add(tick);
        else gsap.ticker.remove(tick);
      };
      const io = new IntersectionObserver(([e]) => run(e.isIntersecting), { rootMargin: "100px 0px" });
      io.observe(el);
      render();

      let glide: gsap.core.Tween | null = null;
      api.current.nudge = (dir) => {
        glide?.kill();
        const o = { p: pos };
        glide = gsap.to(o, { p: pos + dir * step, duration: 0.9, ease: "power3.inOut", onUpdate: () => (pos = o.p) });
      };

      const pause = () => (target.speed = 0);
      const resume = () => (target.speed = still ? 0 : SPEED);
      el.addEventListener("pointerenter", pause);
      el.addEventListener("pointerleave", resume);

      let startX = 0, lastX = 0, lastT = 0, moved = 0;
      const down = (e: PointerEvent) => {
        if (e.button !== 0) return;
        dragging = true;
        glide?.kill();
        startX = lastX = e.clientX;
        lastT = performance.now();
        moved = 0;
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
        if (moved > 6 && !el.hasPointerCapture(e.pointerId)) el.setPointerCapture(e.pointerId);
      };
      const up = () => {
        dragging = false;
      };
      // a drag is not a click, so dragging over a card never opens it
      const click = (e: MouseEvent) => {
        if (moved > 6 && el.contains(e.target as Node)) {
          e.preventDefault();
          e.stopPropagation();
        }
        moved = 0;
      };
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
      window.addEventListener("click", click, true);

      const onResize = () => {
        measure();
        render();
      };
      window.addEventListener("resize", onResize);

      // entrance: cards rise into place once, the row sweeps up from below
      if (!still) {
        gsap.from(gsap.utils.toArray("[data-loop-inner]", el), {
          yPercent: 30,
          autoAlpha: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: { each: 0.05, from: "center" },
          scrollTrigger: { trigger: wrap.current, start: "top 70%", once: true, refreshPriority: -1 },
        });
      }

      return () => {
        run(false);
        io.disconnect();
        window.removeEventListener("resize", onResize);
        window.removeEventListener("click", click, true);
      };
    },
    { scope: wrap },
  );

  const arrow = "grid size-11 place-items-center rounded-control border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white";
  // two laps so the loop is always wider than the screen
  const loopCards = [...resorts, ...resorts];

  return (
    <div ref={wrap} className="overflow-x-clip">
      <div
        ref={stage}
        className="relative mt-10 h-[360px] cursor-grab touch-pan-y select-none active:cursor-grabbing sm:h-[410px] lg:h-[440px]"
        role="region"
        aria-label="Resort islands, scrolling. Drag, or use the arrows."
      >
        {loopCards.map((r, i) => (
          <div
            key={`${r.island}-${i}`}
            data-loop-card
            aria-hidden={i >= resorts.length}
            className="absolute top-0 left-0 w-[260px] sm:w-[300px] lg:w-[330px]"
          >
            <div data-loop-inner>
              <Link
                href={r.href}
                className="group relative block aspect-[4/5] overflow-hidden rounded-card bg-ink text-white shadow-[0_24px_48px_-20px_rgba(20,18,26,0.45)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1.5 hover:shadow-[0_32px_56px_-20px_rgba(20,18,26,0.55)] motion-reduce:hover:translate-y-0"
              >
                <Image
                  src={r.image}
                  alt={`${r.resort}, ${r.island}`}
                  fill
                  sizes="(min-width:1024px) 330px, (min-width:640px) 300px, 260px"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/45 via-45% to-ink/5" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-mono text-[11px] tracking-wide text-white/75 uppercase">{r.island}</p>
                  <h3 className="mt-1 line-clamp-2 text-[21px] leading-[25px] font-semibold tracking-tight">{r.resort}</h3>
                  <span className="mt-3 inline-flex items-center gap-2 text-[14px] font-medium text-white/90">
                    View resort
                    <span aria-hidden data-arrow className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button type="button" aria-label="Previous resort" onClick={() => api.current.nudge(-1)} className={arrow}>
          ←
        </button>
        <button type="button" aria-label="Next resort" onClick={() => api.current.nudge(1)} className={arrow}>
          →
        </button>
      </div>
    </div>
  );
}
