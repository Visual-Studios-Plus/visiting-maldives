"use client";
import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";
import { P, photo } from "@/lib/data";

/*
 * "The Maldives in numbers": pinned, and driven by your scroll.
 * - Each number simply rises into view (no counting-up effect).
 * - Camera pull-back: the aerial of Malé starts tight, then pulls back.
 * - Each divider draws itself as its number lands; each label decodes from scrambled letters.
 * Only transforms and opacity change while scrolling.
 */
const STATS = [
  { value: "1,192", label: "Coral islands", note: "About 187 are lived on; the rest are resorts, farms or empty sand." },
  { value: "26", label: "Natural atolls", note: "Rings of reef around a lagoon, grouped into 20 administrative atolls." },
  { value: "99%", label: "Ocean", note: "The country is mostly sea, so every trip includes a boat, seaplane or ferry." },
  { value: "2", label: "Monsoon seasons", note: "Dry northeast Dec–Apr; wetter southwest May–Nov, best for mantas and surf." },
];
/** The number as written, with the % in the accent colour. */
function Num({ value }: { value: string }) {
  return (
    <>
      {value.split(/(%)/).map((part, i) =>
        part === "%" ? (
          <span key={i} className="text-red">
            %
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export default function CountersPinned() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      if (reduced()) return;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ref.current, start: "top top", end: "+=160%", pin: true, scrub: 1, anticipatePin: 1 },
      });

      // Camera: tight → wide. Transform only: animating a blur on a full-screen photo while
      // scrolling repaints the whole image every frame and was the main cause of scroll lag.
      tl.fromTo(q("[data-bg]"), { scale: 1.9 }, { scale: 1, duration: 1, ease: "power2.out" }, 0);
      tl.from(q("[data-eyebrow], [data-intro] > *"), { y: 30, autoAlpha: 0, duration: 0.2, stagger: 0.04 }, 0.02);

      // Each stat: the number rises in, its divider draws, its label decodes
      // all four appear together, rather than one after another
      q("[data-stat]").forEach((stat) => {
        const at = 0.08;
        const s = stat as HTMLElement;
        tl.from(s.querySelector("[data-num]"), { yPercent: 40, autoAlpha: 0, duration: 0.25, ease: "power2.out" }, at);
        tl.fromTo(s.querySelector("[data-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "power2.inOut" }, at);
        tl.from(s.querySelector("[data-note]"), { y: 12, autoAlpha: 0, duration: 0.25 }, at + 0.25);

        // Label decodes from scrambled letters as the scrub passes it
        const label = s.querySelector<HTMLElement>("[data-label]")!;
        const text = label.dataset.text!;
        const p = { v: 0 };
        tl.to(p, {
          v: 1,
          duration: 0.35,
          onUpdate: () => {
            // snap to the real word near the end, so a scrub that stops a frame short still reads correctly
            const n = p.v > 0.9 ? text.length : Math.floor(p.v * text.length);
            const next = text
              .split("")
              .map((c, j) => (j < n || c === " " ? c : GLYPHS[(j * 7 + Math.floor(p.v * 40)) % GLYPHS.length]))
              .join("");
            // write only when the letters actually change, so most scroll frames touch nothing
            if (label.textContent !== next) label.textContent = next;
          },
        }, at + 0.15);
      });
      tl.from(q("[data-source]"), { autoAlpha: 0, duration: 0.15 }, 0.75);
      tl.to({}, { duration: 0.15 }); // a beat to read before the pin releases
      // Measure now. Until its first refresh the trigger reads start = end = 0, so at scroll 0 the
      // scene counts as finished: it renders its end state (full-size card) and then scrubs back.
      tl.scrollTrigger?.refresh();
      tl.progress(tl.scrollTrigger?.progress ?? 0);
    },
    { scope: ref },
  );

  return (
    // React-owned wrapper: GSAP's pin-spacer lives inside it, so page changes never trip over it
    <div>
      <section ref={ref} className="relative flex h-[calc(100svh/var(--z))] items-center overflow-hidden bg-ink text-white">
        <div data-bg className="absolute inset-0 will-change-transform">
          <Image src={photo(P.maleAerial, 2000)} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        {/* shade sits behind the text side; the aerial stays vivid on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/30" />
        <div className="container-vm relative grid items-center gap-12 lg:grid-cols-[0.9fr_1.4fr] lg:gap-16">
          <div data-intro>
            <p data-eyebrow className="eyebrow inline-block rounded-control bg-white/10 px-2.5 py-1">
              The Maldives in numbers
            </p>
            <h2 data-no-split className="mt-5 text-[40px] leading-[1.02] font-semibold tracking-[-0.03em] sm:text-[56px]">
              99% sea. <br />1% island.
            </h2>
            <p className="mt-5 max-w-sm leading-snug text-white/75">
              A country spread thin across the Indian Ocean. Plan by atoll and transfer time, not by map distance.
            </p>
            <p data-source className="mt-8 font-mono text-[12px] text-white/55">Source: Maldives Bureau of Statistics · Checked 3 Nov 2026</p>
          </div>
          <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
            {STATS.map((s) => (
              <div key={s.label} data-stat className="relative pt-5">
                <span data-rule className="absolute top-0 left-0 h-px w-full origin-left bg-white/35" />
                <p data-num className="text-[56px] leading-none font-semibold tracking-[-0.04em] sm:text-[72px] xl:text-[96px]">
                  <Num value={s.value} />
                </p>
                <p data-label data-text={s.label.toUpperCase()} className="mt-3 font-mono text-[12px] tracking-wide text-white/80 [contain:layout_paint]">
                  {s.label.toUpperCase()}
                </p>
                <p data-note className="mt-2 max-w-xs text-[15px] leading-snug text-white/65">{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
