"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";
import { atolls, photo } from "@/lib/data";

/** Pinned horizontal scroll through the atolls on desktop; a swipeable row on phones. */
export default function AtollScroller() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        if (reduced()) return;
        const el = track.current!;
        const dist = () => el.scrollWidth - section.current!.clientWidth;
        gsap.to(el, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-atoll-img]").forEach((img) =>
          gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: { trigger: section.current, start: "top top", end: () => `+=${dist()}`, scrub: true } }),
        );
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} className="overflow-hidden bg-ink py-16 text-white lg:flex lg:h-[calc(100svh/var(--z))] lg:flex-col lg:justify-center lg:py-0">
      <div className="container-vm">
        <span className="eyebrow inline-block rounded-control bg-white/10 px-2.5 py-1">Islands & atolls</span>
        <h2 className="mt-4 max-w-2xl text-[36px] leading-[1.03] font-semibold tracking-[-0.03em] sm:text-[48px] lg:text-[60px]">
          26 atolls, <span className="accent">not one postcard.</span>
        </h2>
      </div>
      <div
        ref={track}
        className="no-scrollbar mt-10 flex gap-4 overflow-x-auto px-4 sm:px-8 lg:w-max lg:overflow-visible lg:px-[max(56px,calc((100vw/var(--z)-1280px)/2+56px))]"
      >
        {atolls.map((a, i) => (
          <Link
            key={a.slug}
            href={`/atolls/${a.slug}`}
            className="group relative aspect-[4/5] w-[78vw] shrink-0 overflow-hidden rounded-card sm:w-[42vw] lg:aspect-auto lg:h-[calc(58vh/var(--z))] lg:w-[min(30vw,420px)]"
          >
            <div data-atoll-img className="absolute inset-[-10%]">
              <Image src={photo(a.image, 1000)} alt={a.name} fill sizes="420px" className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/30" />
            <span className="absolute top-4 left-4 font-mono text-[12px] text-white/80">0{i + 1} · {a.region}</span>
            <span className="font-thaana absolute top-3 right-4 text-[28px] text-white/80">{a.dhivehi}</span>
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h3 className="text-[28px] leading-8 font-semibold tracking-tight">{a.name}</h3>
              <p className="mt-1 text-white/80">{a.tagline}</p>
              <p className="mt-3 font-mono text-[12px] text-white/70">{a.transfer}</p>
            </div>
          </Link>
        ))}
        <Link
          href="/atolls"
          className="grid aspect-[4/5] w-[60vw] shrink-0 place-items-center rounded-card border border-white/20 text-center transition-colors hover:bg-red sm:w-[30vw] lg:aspect-auto lg:h-[calc(58vh/var(--z))] lg:w-[300px]"
        >
          <span className="text-[22px] font-semibold">
            All atolls <br />→
          </span>
        </Link>
      </div>
    </section>
  );
}
