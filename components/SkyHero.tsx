"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { CloudShader } from "@/components/ui/cloud-shader";
import { gsap, useGSAP, reduced } from "@/lib/gsap";
import { P, photo } from "@/lib/data";

/*
 * Homepage hero: a bird's-eye view of a Maldives island (beach, palms and lagoon from
 * straight above) with WebGL shader clouds (Aceternity cloud-shader) drifting across it. Title layout as in the original hero.
 */

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
      gsap.from(q("[data-clouds]"), { autoAlpha: 0, duration: 2.2, ease: "power2.out", delay: d });
      gsap.from(q("[data-word]"), { yPercent: 110, duration: 1.1, stagger: 0.06, ease: "expo.out", delay: d + 0.5 });
      gsap.from(q("[data-fade]"), { y: 24, autoAlpha: 0, stagger: 0.1, duration: 0.9, delay: d + 0.9 });

      // Scroll: clouds part and rush past (nearer = faster), the island sinks back, the title lifts away
      const st = { trigger: root, start: "top top", end: "bottom top", scrub: 0.8 };
      gsap.to(q("[data-clouds]"), { scale: 1.4, yPercent: -10, ease: "none", scrollTrigger: st });
      gsap.to(q("[data-island]"), { scale: 1.15, yPercent: 8, ease: "none", scrollTrigger: st });
      gsap.to(q("[data-content]"), { yPercent: -10, autoAlpha: 0, ease: "none", scrollTrigger: { ...st, end: "32% top" } });

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

        {/* WebGL cloud shader; black sky + screen blend lets only the clouds show over the photo */}
        <div data-clouds className="pointer-events-none absolute inset-0 mix-blend-screen will-change-transform">
          <CloudShader className="h-full w-full" count={5} speed={0.8} cloudColor="#ffffff" skyTopColor="#000000" skyBottomColor="#000000" />
        </div>

        {/* Hand-off: a white gradient so the hero melts into the page below */}
        <div className="pointer-events-none absolute inset-x-0 -bottom-[2px] z-[15] h-[48%] bg-gradient-to-t from-white from-10% via-white/60 via-45% to-transparent" />

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
