"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import "./DepthCarousel.css";

/*
 * Depth carousel, adapted from React Bits' <DepthCarousel /> for this site:
 * - Renders any card (renderItem), not just images. A click on a card in the back brings it to
 *   the front; only the front card's own link is followed, and a drag never counts as a click.
 * - Receding cards are shaded by a tint layer's opacity instead of brightness/blur filters, so
 *   every frame changes only transform and opacity (filters made earlier scenes lag).
 * - No built-in arrows or dots: the page drives it through `controlRef` (prev / next / goTo).
 * Drag with momentum, wheel, arrow keys and autoplay (paused on hover or focus) all work.
 */

export type DepthCarouselControl = { prev: () => void; next: () => void; goTo: (i: number) => void };

type Props<T> = {
  items: T[];
  renderItem: (item: T, index: number, isActive: boolean) => ReactNode;
  getKey: (item: T, index: number) => string;
  getLabel?: (item: T, index: number) => string;
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  tint?: string;
  depth?: number;
  spread?: number;
  tilt?: number;
  tiltDirection?: "left" | "right";
  perspective?: number;
  visibleCards?: number;
  /** Side room (px) kept around the stack when fitting it to the width. */
  gutter?: number;
  falloff?: number;
  duration?: number;
  ease?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  label?: string;
  className?: string;
  controlRef?: RefObject<DepthCarouselControl | null>;
  onChange?: (index: number, item: T) => void;
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const wrap = (v: number, n: number) => ((v % n) + n) % n;

export default function DepthCarousel<T>({
  items,
  renderItem,
  getKey,
  getLabel,
  cardWidth = 300,
  cardHeight = 380,
  radius = 18,
  tint = "#14121a",
  depth = 220,
  spread = 90,
  tilt = 22,
  tiltDirection = "right",
  perspective = 1400,
  visibleCards = 4,
  gutter = 120,
  falloff = 0.2,
  duration = 700,
  ease = "power3.out",
  autoplay = false,
  autoplayDelay = 3200,
  loop = true,
  label = "Carousel",
  className = "",
  controlRef,
  onChange,
}: Props<T>) {
  const count = items.length;

  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tintRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const posRef = useRef(0);
  const focusRef = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const scaleRef = useRef(1);
  const reducedRef = useRef(false);
  const dragRef = useRef<{ x: number; startPos: number; lastX: number; lastT: number; v: number; moved: boolean; id: number } | null>(null);
  const movedRef = useRef(false); // survives until the click that follows a drag
  const wheelTimerRef = useRef<number | null>(null);

  const [active, setActive] = useState(0);

  // Latest settings for callbacks that outlive a render
  const cfgRef = useRef({ count, depth, spread, tilt, tiltDirection, visibleCards, falloff, duration, ease, loop, cardWidth, gutter });
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    cfgRef.current = { count, depth, spread, tilt, tiltDirection, visibleCards, falloff, duration, ease, loop, cardWidth, gutter };
    onChangeRef.current = onChange;
  });

  const layout = useCallback((pos: number) => {
    const cfg = cfgRef.current;
    const n = cfg.count;
    if (!n) return;
    const dir = cfg.tiltDirection === "left" ? -1 : 1;
    const sc = scaleRef.current;

    for (let i = 0; i < n; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      let d = i - pos;
      if (cfg.loop && n > 1) {
        d = wrap(d, n);
        if (d > n / 2) d -= n;
      }

      const back = Math.max(0, d);
      const shown = Math.abs(d) <= cfg.visibleCards + 0.5;

      const tz = -cfg.depth * d;
      const tx = dir * cfg.spread * d;
      const ry = dir * cfg.tilt * clamp(d, 0, 1);

      let opacity = d < 0 ? Math.max(0, 1 + d) : 1; // cards in front fade out as they pass
      if (!shown) opacity = 0;

      el.style.transform = `translate(-50%, -50%) scale(${sc}) translateX(${tx.toFixed(2)}px) translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg)`;
      el.style.opacity = opacity.toFixed(3);
      el.style.zIndex = String(Math.round(2000 - d * 20));
      el.style.pointerEvents = shown && opacity > 0.05 ? "auto" : "none";

      const t = tintRefs.current[i];
      if (t) t.style.opacity = clamp(back * cfg.falloff * 1.6, 0, 0.82).toFixed(3);
    }
  }, []);

  const tweenTo = useCallback(
    (target: number, animate: boolean) => {
      tweenRef.current?.kill();
      const cfg = cfgRef.current;
      const proxy = { p: posRef.current };
      tweenRef.current = gsap.to(proxy, {
        p: target,
        duration: animate && !reducedRef.current ? cfg.duration / 1000 : 0,
        ease: cfg.ease,
        onUpdate: () => {
          posRef.current = proxy.p;
          layout(proxy.p);
        },
        onComplete: () => {
          if (cfg.count > 0) posRef.current = wrap(posRef.current, cfg.count);
          layout(posRef.current);
        },
      });
    },
    [layout],
  );

  const setFocus = useCallback(
    (rawIndex: number, animate = true) => {
      const cfg = cfgRef.current;
      const n = cfg.count;
      if (!n) return;
      const idx = cfg.loop ? wrap(rawIndex, n) : clamp(rawIndex, 0, n - 1);
      let delta = idx - posRef.current;
      if (cfg.loop && n > 1) {
        delta = wrap(delta, n);
        if (delta > n / 2) delta -= n;
      }
      // starts from the live position, so a new input always redirects a moving carousel smoothly
      tweenTo(posRef.current + delta, animate);
      if (idx !== focusRef.current) {
        focusRef.current = idx;
        setActive(idx);
        onChangeRef.current?.(idx, items[idx]);
      }
    },
    [tweenTo, items],
  );

  const navigateBy = useCallback((step: number) => setFocus(focusRef.current + step, true), [setFocus]);

  // Imperative controls for the page's own buttons
  useEffect(() => {
    if (!controlRef) return;
    controlRef.current = { prev: () => navigateBy(-1), next: () => navigateBy(1), goTo: (i) => setFocus(i, true) };
    return () => {
      controlRef.current = null;
    };
  }, [controlRef, navigateBy, setFocus]);

  // Fit the stack to the available width
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      const cfg = cfgRef.current;
      const needed = cfg.cardWidth + Math.abs(cfg.spread) * 2 + cfg.gutter;
      scaleRef.current = clamp(w / needed, 0.4, 1);
      layout(posRef.current);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [layout]);

  // Horizontal wheel / trackpad swipes move the stack; vertical scroll keeps scrolling the page
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const cfg = cfgRef.current;
      if (cfg.count < 2 || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      tweenRef.current?.kill();
      const delta = e.deltaMode === 1 ? e.deltaX * 24 : e.deltaX;
      posRef.current += clamp(delta / (cfg.cardWidth * 0.9), -0.6, 0.6);
      layout(posRef.current);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = window.setTimeout(() => setFocus(Math.round(posRef.current), true), 130);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [layout, setFocus]);

  // Drag: tracks the pointer 1:1, then projects the release velocity to pick the landing card
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (cfgRef.current.count < 2 || e.button !== 0) return;
    tweenRef.current?.kill();
    movedRef.current = false;
    dragRef.current = { x: e.clientX, startPos: posRef.current, lastX: e.clientX, lastT: performance.now(), v: 0, moved: false, id: e.pointerId };
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const stepPx = Math.max(cfgRef.current.cardWidth * 0.55 * scaleRef.current, 40);
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 6) {
        drag.moved = true;
        movedRef.current = true;
        rootRef.current?.setPointerCapture(drag.id);
      }
      if (!drag.moved) return;
      const now = performance.now();
      drag.v = (e.clientX - drag.lastX) / Math.max(now - drag.lastT, 1);
      drag.lastX = e.clientX;
      drag.lastT = now;
      posRef.current = drag.startPos - dx / stepPx;
      layout(posRef.current);
    },
    [layout],
  );

  const onPointerEnd = useCallback(() => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag?.moved) {
      // a tap that didn't move: let any running tween settle on the focused card
      if (drag) setFocus(focusRef.current, true);
      return;
    }
    const stepPx = Math.max(cfgRef.current.cardWidth * 0.55 * scaleRef.current, 40);
    setFocus(Math.round(posRef.current - (drag.v * 180) / stepPx), true);
  }, [setFocus]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.target !== e.currentTarget) return; // leave keys inside cards (links) alone
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigateBy(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        navigateBy(1);
      }
    },
    [navigateBy],
  );

  // Clicks: a drag is never a click; a card in the back comes forward instead of opening
  const onCardClickCapture = useCallback(
    (e: React.MouseEvent, index: number) => {
      if (movedRef.current || index !== focusRef.current) {
        e.preventDefault();
        e.stopPropagation();
        if (!movedRef.current) setFocus(index, true);
      }
      movedRef.current = false;
    },
    [setFocus],
  );

  // Autoplay, paused while hovered or focused, off for reduced motion
  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!autoplay || reducedRef.current || count < 2) return;
    const root = rootRef.current;
    let hovered = false;
    let focused = false;
    const timer = window.setInterval(() => {
      if (!hovered && !focused && !dragRef.current && !document.hidden) navigateBy(1);
    }, Math.max(autoplayDelay, 600));
    const on = (fn: () => void) => fn;
    const enter = on(() => (hovered = true));
    const leave = on(() => (hovered = false));
    const fin = on(() => (focused = true));
    const fout = on(() => (focused = false));
    root?.addEventListener("pointerenter", enter);
    root?.addEventListener("pointerleave", leave);
    root?.addEventListener("focusin", fin);
    root?.addEventListener("focusout", fout);
    return () => {
      clearInterval(timer);
      root?.removeEventListener("pointerenter", enter);
      root?.removeEventListener("pointerleave", leave);
      root?.removeEventListener("focusin", fin);
      root?.removeEventListener("focusout", fout);
    };
  }, [autoplay, autoplayDelay, count, navigateBy]);

  useEffect(() => {
    layout(posRef.current);
  }, [layout, depth, spread, tilt, tiltDirection, visibleCards, falloff, cardWidth, cardHeight, radius, count]);

  useEffect(() => () => void tweenRef.current?.kill(), []);

  return (
    <div
      ref={rootRef}
      className={`depth-carousel ${className}`.trim()}
      style={{ ["--dc-perspective" as string]: `${perspective}px` }}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={onKeyDown}
    >
      <div className="depth-carousel__stage">
        {items.map((item, i) => (
          <div
            key={getKey(item, i)}
            className="depth-carousel__card"
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            style={{ width: cardWidth, height: cardHeight, borderRadius: radius }}
            aria-roledescription="slide"
            aria-label={getLabel ? getLabel(item, i) : `${i + 1} of ${count}`}
            aria-hidden={active !== i}
            onClickCapture={(e) => onCardClickCapture(e, i)}
            onDragStart={(e) => e.preventDefault()}
          >
            {renderItem(item, i, active === i)}
            <span
              className="depth-carousel__tint"
              ref={(el) => {
                tintRefs.current[i] = el;
              }}
              style={{ background: tint }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
