"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";
import { P, photo } from "@/lib/data";

/*
 * Pinned "ways to see the Maldives" (after columbus-travel.com's services):
 * a photo card grows to fill the screen, then each way slides up in turn — photo, title
 * rolling up, short line — with a progress bar along the bottom.
 */
const WAYS = [
  {
    title: "Marine life",
    best: "Jun–Nov",
    why: "Mantas peak in August; reefs are good all year",
    text: "Mantas in Baa, whale sharks off South Ari and house reefs you can swim to.",
    image: P.diver,
    href: "/things-to-do?c=Marine%20life",
  },
  {
    title: "Heritage",
    best: "All year",
    why: "Mornings, before the heat; mosques close for Friday prayers",
    text: "Coral-stone mosques, Sultan Park and the fish market in Malé.",
    image: P.hukuru,
    href: "/things-to-do?c=Heritage",
  },
  {
    title: "Local islands",
    best: "Dec–Apr",
    why: "Dry season: calm seas and reliable ferries",
    text: "Guesthouses, public ferries and village life beyond the resorts.",
    image: P.felidhoo,
    href: "/things-to-do?c=Islands",
  },
  {
    title: "Adventure",
    best: "Mar–Oct",
    why: "Southwest swell for surf; sandbanks best at low tide",
    text: "Surf breaks, seaplanes and sandbanks at low tide.",
    image: P.wave,
    href: "/things-to-do?c=Adventure",
  },
];

export default function ExploreStack() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const imgs = q("[data-way-img]");
      const texts = q("[data-way-text]");
      if (reduced()) return;

      gsap.set(imgs.slice(1), { yPercent: 100 });
      gsap.set(texts, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(q("[data-way-title]"), { yPercent: 110 });

      const tl = gsap.timeline({
        defaults: { ease: "power1.inOut" },
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: `+=${WAYS.length * 90 + 80}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. The card grows to fill the screen; the marquee steps back
      tl.fromTo(
        q("[data-frame]"),
        // a real pixel width: GSAP cannot tween from a CSS min(), and on re-measure it fell back to
        // the end width, so the card showed full-size before the scene began. Matches the CSS class.
        { width: () => Math.min(window.innerWidth * 0.46, 520), height: "62%", borderRadius: 12 },
        {
          width: "100%",
          height: "100%",
          borderRadius: 0,
          ease: "none",
          duration: 1,
        },
      )
        .to(q("[data-marquee]"), { autoAlpha: 0, duration: 0.3 }, "-=0.3")
        .to(texts[0], { autoAlpha: 1, pointerEvents: "auto", duration: 0.25 })
        .to(
          texts[0].querySelector("[data-way-title]"),
          { yPercent: 0, duration: 0.4, ease: "power3.out" },
          "<",
        );
      const start = tl.duration();

      // 2. Each next way slides up over the last
      for (let i = 1; i < WAYS.length; i++) {
        tl.to(imgs[i - 1], { yPercent: -30, duration: 0.6 }, "+=0.25")
          .to(imgs[i], { yPercent: 0, duration: 0.6 }, "<")
          .to(
            texts[i - 1].querySelector("[data-way-title]"),
            { yPercent: -110, duration: 0.4 },
            "<",
          )
          .to(
            texts[i - 1],
            { autoAlpha: 0, pointerEvents: "none", duration: 0.3 },
            "<",
          )
          .to(
            texts[i],
            { autoAlpha: 1, pointerEvents: "auto", duration: 0.3 },
            "<0.2",
          )
          .to(
            texts[i].querySelector("[data-way-title]"),
            { yPercent: 0, duration: 0.45, ease: "power3.out" },
            "<",
          );
      }
      tl.to({}, { duration: 0.3 });
      tl.fromTo(
        q("[data-progress]"),
        { scaleX: 0 },
        { scaleX: 1, ease: "none", duration: tl.duration() - start },
        start,
      );

      // Measure now. Until its first refresh the trigger reads start = end = 0, so at scroll 0 the
      // scene counts as finished: it renders its end state (full-size card) and then scrubs back.
      tl.scrollTrigger?.refresh();
      tl.progress(tl.scrollTrigger?.progress ?? 0);

      // marquee drifts on its own
      gsap.to(q("[data-marquee-track]"), {
        xPercent: -50,
        duration: 22,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: ref },
  );

  const line = "Ways to see the Maldives · ";
  return (
    // React-owned wrapper: GSAP's pin-spacer lives inside it, so page changes never trip over it
    <div>
      <section
        ref={ref}
        className="relative h-[calc(100svh/var(--z))] overflow-hidden bg-white"
      >
        {/* Marquee behind the card */}
        <div
          data-marquee
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden"
          aria-hidden
        >
          <div data-marquee-track className="flex w-max">
            {[0, 1].map((k) => (
              <span
                key={k}
                className="pr-6 text-[16vw] leading-none font-semibold tracking-[-0.04em] whitespace-nowrap text-ink lg:text-[11vw]"
              >
                {line.repeat(2)}
              </span>
            ))}
          </div>
        </div>

        {/* The expanding frame */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            data-frame
            className="relative h-[62%] w-[min(46vw,520px)] overflow-hidden rounded-card bg-ink"
          >
            {WAYS.map((w, i) => (
              <div
                key={w.title}
                data-way-img
                className="absolute inset-0"
                style={{ zIndex: i }}
              >
                <Image
                  src={photo(w.image, 2000)}
                  alt={w.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
              </div>
            ))}

            {WAYS.map((w) => (
              <div
                key={w.title}
                data-way-text
                className="absolute inset-x-0 bottom-0 z-20 p-6 text-white opacity-0 sm:p-10 lg:p-14"
              >
                <div className="overflow-hidden pb-[0.06em]">
                  <h3
                    data-way-title
                    className="text-[52px] leading-none font-semibold tracking-[-0.04em] sm:text-[88px] lg:text-[120px]"
                  >
                    {w.title}
                  </h3>
                </div>
                <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div className="max-w-md">
                    <p className="text-[17px] leading-snug text-white/85">{w.text}</p>
                    <p className="mt-4 flex flex-wrap items-center gap-2 text-[14px] text-white/80">
                      <span className="rounded-control bg-white px-2.5 py-1 font-mono text-[12px] font-medium text-ink">Best time · {w.best}</span>
                      {w.why}
                    </p>
                  </div>
                  <Link
                    href={w.href}
                    className="inline-flex shrink-0 items-center gap-2 self-start rounded-control bg-white px-5 py-3 font-semibold text-ink transition-colors hover:bg-red hover:text-white"
                  >
                    Explore {w.title.toLowerCase()}{" "}
                    <span aria-hidden data-arrow className="inline-block">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            ))}

            {/* progress */}
            <div className="absolute inset-x-0 bottom-0 z-30 h-1 bg-white/15">
              <div
                data-progress
                className="h-full origin-left scale-x-0 bg-red"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
