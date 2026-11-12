"use client";
import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, reduced, afterLoader } from "@/lib/gsap";
import { photo, isCommons } from "@/lib/data";

/** Splits a headline into words so GSAP can rise them in one by one. */
export function Words({ text, className = "" }: { text: string; className?: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <span data-word className={`inline-block ${className}`}>
            {w}&nbsp;
          </span>
        </span>
      ))}
    </>
  );
}

export default function PageHero({
  image,

  title,
  accent,
  intro,
  children,
  full = false,
}: {
  image: string;
  eyebrow?: string;
  title: string;
  accent?: string;
  intro?: string;
  children?: ReactNode;
  full?: boolean;
}) {
  // Every headline is two-tone (SemiBold lead + Regular accent), like "The Maldives is more than a resort."
  let lead = title;
  let tail = accent;
  if (!tail) {
    const w = title.split(" ");
    const cut = Math.max(1, Math.ceil(w.length / 2));
    lead = w.slice(0, cut).join(" ");
    tail = w.slice(cut).join(" ") || undefined;
  }
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (reduced()) return;
      // On a fresh page load, wait for the red logo loader to lift before the hero intro
      const tl = gsap.timeline({ paused: true, delay: 0.15 });
      tl.from("[data-hero-img]", { scale: 1.18, duration: 2.2, ease: "expo.out" }, 0)
        .from("[data-word]", { yPercent: 110, duration: 1.1, stagger: 0.06, ease: "expo.out" }, 0.35)
        .from("[data-hero-fade]", { y: 24, opacity: 0, stagger: 0.1, duration: 0.9 }, 0.8);
      gsap.to("[data-hero-parallax]", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-content]", {
        y: -60,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom 30%", scrub: true },
      });
      return afterLoader(() => tl.restart(true));
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className={`relative isolate flex items-center justify-center overflow-hidden bg-ink text-white ${full ? "min-h-[calc(100svh/var(--z))]" : "min-h-[calc(72svh/var(--z))]"}`}>
      <div data-hero-parallax className="absolute inset-0 -z-10">
        <div data-hero-img className="absolute inset-0">
          <Image src={photo(image, 2400)} unoptimized={isCommons(image)} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/50 via-ink/30 to-ink/70" />
      {/* Extra shade behind the centred headline so white text reads on bright lagoons */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_45%_at_50%_50%,rgba(20,18,26,0.45),transparent)]" />
      <div data-hero-content className="container-vm flex flex-col items-center pt-28 pb-16 text-center">
        <h1 className="h-display max-w-5xl text-[44px] sm:text-[64px] lg:text-[84px]">
          <Words text={lead} />
          {tail && <Words text={tail} className="accent" />}
        </h1>
        {intro && (
          <p data-hero-fade className="mt-5 max-w-xl text-[17px] leading-snug text-white/85 sm:text-[19px]">
            {intro}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
