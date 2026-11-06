"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";
import { P, photo } from "@/lib/data";

/*
 * Homepage hero: a bird's-eye view of a Maldives island (beach, palms and lagoon from
 * straight above) with soft SVG clouds drifting across it. The clouds are real SVG:
 * puff shapes run through a turbulence + displacement filter, so their edges look like
 * cumulus at any size. They drift on their own, follow the mouse slightly, and part and
 * rush past the camera as you scroll. Title layout as in the original hero.
 */

type CloudDef = { x: number; y: number; w: number; depth: number; seed: number; opacity: number };

// Positions in % of the hero; depth 1 = far (slow, small), 3 = near (fast, large)
const CLOUDS: CloudDef[] = [
  // far: small, faint, slow
  { x: -8, y: 4, w: 30, depth: 1, seed: 3, opacity: 0.55 },
  { x: 26, y: -4, w: 26, depth: 1, seed: 7, opacity: 0.45 },
  { x: 58, y: 8, w: 32, depth: 1, seed: 11, opacity: 0.55 },
  { x: 84, y: 22, w: 28, depth: 1, seed: 5, opacity: 0.5 },
  { x: 38, y: 64, w: 30, depth: 1, seed: 9, opacity: 0.45 },
  // middle
  { x: -18, y: 34, w: 44, depth: 2, seed: 13, opacity: 0.75 },
  { x: 70, y: 40, w: 46, depth: 2, seed: 17, opacity: 0.7 },
  { x: 12, y: 80, w: 40, depth: 2, seed: 3, opacity: 0.7 },
  { x: 52, y: -10, w: 40, depth: 2, seed: 9, opacity: 0.6 },
  // near: large, bright, fast
  { x: -30, y: 70, w: 70, depth: 3, seed: 7, opacity: 0.9 },
  { x: 62, y: 72, w: 74, depth: 3, seed: 11, opacity: 0.9 },
  { x: -34, y: -14, w: 60, depth: 3, seed: 17, opacity: 0.8 },
];

// The bank along the bottom edge: wide, solid white clouds overlapping each other
const BANK = [
  { x: -22, y: -16, w: 70, seed: 5 },
  { x: 18, y: -20, w: 72, seed: 13 },
  { x: 56, y: -17, w: 70, seed: 3 },
  { x: -6, y: -24, w: 64, seed: 17 },
  { x: 40, y: -26, w: 66, seed: 9 },
];

/** SVG source of one cumulus: overlapping puffs, roughened by fractal noise and softened by blur. */
function cloudSvg(seed: number) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-120 -90 640 380" width="1280" height="760">
  <defs>
    <filter id="f" x="-30%" y="-40%" width="160%" height="180%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="${seed}" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="70" xChannelSelector="R" yChannelSelector="G" result="shape"/>
      <feGaussianBlur in="shape" stdDeviation="7"/>
    </filter>
    <radialGradient id="g" cx="45%" cy="35%" r="70%">
      <stop offset="0" stop-color="#ffffff"/><stop offset="0.7" stop-color="#f4f8fb"/><stop offset="1" stop-color="#dfe8ef"/>
    </radialGradient>
  </defs>
  <g filter="url(#f)" fill="url(#g)">
    <ellipse cx="200" cy="120" rx="150" ry="48"/><circle cx="140" cy="100" r="52"/><circle cx="210" cy="80" r="66"/>
    <circle cx="275" cy="102" r="48"/><circle cx="95" cy="122" r="36"/><circle cx="315" cy="124" r="34"/>
  </g>
</svg>`;
}

/**
 * The cloud is drawn from its SVG once, into a bitmap, and the bitmap is what animates.
 * A live SVG filter would be recomputed on every frame of every movement, which is what
 * made the hero lag; a bitmap just slides on the GPU.
 */
const baked = new Map<number, Promise<string>>();
function bake(seed: number) {
  let p = baked.get(seed);
  if (!p) {
    p = new Promise<string>((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        // half resolution is plenty for a soft, blurred shape
        c.width = 640;
        c.height = 380;
        c.getContext("2d")!.drawImage(img, 0, 0, 640, 380);
        c.toBlob((b) => resolve(b ? URL.createObjectURL(b) : ""), "image/png");
      };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(cloudSvg(seed));
    });
    baked.set(seed, p);
  }
  return p;
}

function Cloud({ seed }: { seed: number }) {
  const [src, setSrc] = useState<string>();
  useEffect(() => {
    let live = true;
    bake(seed).then((u) => live && u && setSrc(u));
    return () => {
      live = false;
    };
  }, [seed]);
  // eslint-disable-next-line @next/next/no-img-element
  return src ? <img src={src} alt="" decoding="async" className="block h-auto w-full" draggable={false} /> : <div className="aspect-[640/380] w-full" />;
}

export default function SkyHero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current!;
      const q = gsap.utils.selector(root);
      if (reduced()) return;
      const loading = !!document.getElementById("vm-loader");
      const d = loading ? 2.8 : 0.1;

      // Opening: the island settles, clouds slide in, the title rises
      gsap.from(q("[data-island]"), { scale: 1.2, duration: 2.6, ease: "expo.out", delay: d });
      q("[data-cloud]").forEach((c) => {
        const el = c as HTMLElement;
        const dir = Number(el.dataset.x) < 40 ? -1 : 1;
        gsap.from(el, { xPercent: dir * 40, autoAlpha: 0, duration: 2.2, ease: "power3.out", delay: d + Math.random() * 0.4 });
      });
      gsap.from(q("[data-word]"), { yPercent: 110, duration: 1.1, stagger: 0.06, ease: "expo.out", delay: d + 0.5 });
      gsap.from(q("[data-fade]"), { y: 24, autoAlpha: 0, stagger: 0.1, duration: 0.9, delay: d + 0.9 });

      // Idle: each cloud drifts and breathes; nearer clouds drift further
      q("[data-drift]").forEach((c) => {
        const depth = Number((c as HTMLElement).dataset.depth);
        gsap.to(c, { x: `+=${40 * depth}`, y: `+=${6 * depth}`, duration: 14 - depth * 2, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });

      // Scroll: clouds part and rush past (nearer = faster), the island sinks back, the title lifts away
      const st = { trigger: root, start: "top top", end: "bottom top", scrub: 0.8 };
      q("[data-cloud]").forEach((c) => {
        const el = c as HTMLElement;
        const depth = Number(el.dataset.depth);
        const dir = Number(el.dataset.x) < 40 ? -1 : 1;
        gsap.to(el, { xPercent: dir * 30 * depth, yPercent: -20 * depth, scale: 1 + 0.35 * depth, ease: "none", scrollTrigger: st });
      });
      gsap.to(q("[data-bank]"), { yPercent: 0, y: -60, ease: "none", scrollTrigger: st });
      gsap.to(q("[data-island]"), { scale: 1.15, yPercent: 8, ease: "none", scrollTrigger: st });
      gsap.to(q("[data-content]"), { yPercent: -10, autoAlpha: 0, ease: "none", scrollTrigger: { ...st, end: "32% top" } });

      // Mouse: clouds shift by depth for a sense of height
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const movers = q("[data-mouse]").map((c) => {
          const depth = Number((c as HTMLElement).dataset.depth);
          return { depth, x: gsap.quickTo(c, "x", { duration: 1.4, ease: "power3.out" }), y: gsap.quickTo(c, "y", { duration: 1.4, ease: "power3.out" }) };
        });
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(-nx * 14 * m.depth);
            m.y(-ny * 8 * m.depth);
          });
        };
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      }
    },
    { scope: ref },
  );

  return (
    // React-owned wrapper so GSAP never moves nodes React is tracking
    <div>
      <section ref={ref} className="relative h-[calc(118svh/var(--z))] min-h-[700px] overflow-hidden bg-[#7fd3d1] text-white">
        {/* The island from straight above */}
        <div data-island className="absolute inset-0 will-change-transform">
          <Image src={photo(P.birdsEye, 2400)} alt="A white sandbank in a turquoise lagoon, seen from straight above, with one person standing on it" fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_48%,rgba(20,18,26,0.45),rgba(20,18,26,0.1)_70%)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/45 to-transparent" />

        {/* SVG clouds, three depths, blended into the photo as one layer (one blend, not one per cloud) */}
        <div className="pointer-events-none absolute inset-0 mix-blend-screen">
          {CLOUDS.map((c, i) => (
            <div
              key={i}
              data-cloud
              data-depth={c.depth}
              data-x={c.x}
              className="absolute will-change-transform"
              // the baked image carries a soft margin (640 × 380 units around the 400 × 200 cloud), so scale and offset it to match
              style={{ left: `calc(${c.x}% - ${c.w * 0.3}vw)`, top: `calc(${c.y}% - ${c.w * 0.225}vw)`, width: `${c.w * 1.6}vw`, opacity: c.opacity, zIndex: c.depth }}
            >
              <div data-mouse data-depth={c.depth}>
                <div data-drift data-depth={c.depth}>
                  <Cloud seed={c.seed} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hand-off: a white gradient with a bank of white clouds, so the hero melts into the page below */}
        <div className="pointer-events-none absolute inset-x-0 -bottom-[2px] z-[15] h-[48%] bg-gradient-to-t from-white from-10% via-white/60 via-45% to-transparent" />
        <div data-bank className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-0 will-change-transform">
          {BANK.map((b, i) => (
            <div key={i} className="absolute" style={{ left: `${b.x}%`, bottom: `${b.y}vw`, width: `${b.w}vw` }}>
              <Cloud seed={b.seed} />
            </div>
          ))}
        </div>

        {/* Original title layout */}
        <div data-content className="container-vm relative z-20 flex h-full flex-col items-center justify-center pt-16 text-center">
          <h1 data-no-split className="h-display max-w-5xl text-[44px] [text-shadow:0_4px_30px_rgba(20,18,26,0.35)] sm:text-[64px] lg:text-[84px]">
            {["Every", "island", "tells", "a", "story."].map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span data-word className="inline-block">
                  {w}&nbsp;
                </span>
              </span>
            ))}
          </h1>
          <p data-fade className="mt-5 max-w-xl text-[17px] leading-snug text-white/90 sm:text-[19px]">
            The independent guide to local islands, reefs and atolls, with checked facts and honest advice.
          </p>
          <div data-fade className="mt-8 flex w-[72%] max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
            <Link href="/things-to-do" className="rounded-control bg-red px-6 py-3.5 text-center font-semibold text-white transition-colors hover:bg-red-deep">
              Start exploring
            </Link>
            <Link href="/atolls" className="rounded-control border border-white/70 px-6 py-3.5 text-center font-semibold transition-colors hover:bg-white hover:text-ink">
              Browse atolls
            </Link>
          </div>
          <div data-fade className="mt-12 hidden flex-wrap items-center justify-center gap-2 sm:flex">
            <span className="eyebrow mr-1 text-white/80">Popular now</span>
            {[
              ["Manta season · Baa", "/guides/manta-season-hanifaru-bay"],
              ["Malé in a day", "/guides/male-on-foot"],
              ["Local islands", "/guides/local-islands-by-ferry"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="inline-flex min-h-11 items-center rounded-control bg-ink/55 px-3.5 text-[14px] font-medium transition-colors hover:bg-white hover:text-ink">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
