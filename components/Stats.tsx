"use client";
import { useRef } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";

const stats = [
  { n: 1192, suffix: "", label: "Coral islands" },
  { n: 26, suffix: "", label: "Natural atolls" },
  { n: 99, suffix: "%", label: "Ocean" },
  { n: 2, suffix: "", label: "Monsoon seasons" },
];

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-count]", ref.current).forEach((el) => {
        const target = Number(el.dataset.count);
        if (reduced()) return;
        const o = { v: 0 };
        el.textContent = "0";
        gsap.to(o, {
          v: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString("en-GB")),
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="border-y border-line">
      <div className="container-vm grid grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`py-10 lg:py-16 ${i % 2 ? "pl-6 lg:pl-10" : "lg:pl-10"} ${i ? "lg:border-l" : ""} ${i % 2 ? "border-l" : ""} border-line ${i > 1 ? "border-t lg:border-t-0" : ""}`}>
            <p className="text-[56px] leading-none font-semibold tracking-[-0.04em] lg:text-[84px]">
              <span data-count={s.n}>{s.n.toLocaleString("en-GB")}</span>
              <span className="text-red">{s.suffix}</span>
            </p>
            <p className="mt-3 font-mono text-[12px] tracking-wide text-driftwood uppercase">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="container-vm pb-6 font-mono text-[12px] text-driftwood">Source: Maldives Bureau of Statistics {"·"} Checked 3 Nov 2026</p>
    </section>
  );
}
