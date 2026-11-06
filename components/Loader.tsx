"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";

const C = 2 * Math.PI * 12.5; // ring circumference ≈ 78.54
const FINAL = 62; // visible arc in the logo (11-unit channel + round caps)

/**
 * Loading screen: the white atoll mark on Maldives red.
 * The reef ring spins like a material progress arc (growing and shrinking while it turns),
 * then settles into the logo's open ring, the island drops in, and the screen lifts away.
 */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const ring = root.current!.querySelector<SVGCircleElement>("[data-ring]")!;
      const spin = root.current!.querySelector<SVGGElement>("[data-spin]")!;
      const finish = () => setDone(true);

      if (reduced()) {
        gsap.to(root.current, { autoAlpha: 0, duration: 0.3, delay: 0.2, onComplete: finish });
        return;
      }

      const arc = { len: 4 };
      const draw = () => gsap.set(ring, { attr: { "stroke-dasharray": `${arc.len} ${C - arc.len}` } });
      draw();

      // Continuous turn while the arc breathes
      const turn = gsap.to(spin, { rotation: "+=360", duration: 1, ease: "none", repeat: -1, svgOrigin: "24 24" });

      gsap
        .timeline({ onComplete: finish })
        .from("[data-mark]", { scale: 0.6, opacity: 0, duration: 0.4, ease: "back.out(2)" })
        .to(arc, { len: 58, duration: 0.45, ease: "power2.inOut", onUpdate: draw })
        .to(arc, { len: 6, duration: 0.45, ease: "power2.inOut", onUpdate: draw })
        .to(arc, { len: 58, duration: 0.45, ease: "power2.inOut", onUpdate: draw })
        // Settle: stop spinning at the logo angle and open to the final arc
        .add(() => {
          turn.kill();
          const r = ((Number(gsap.getProperty(spin, "rotation")) % 360) + 360) % 360;
          gsap.set(spin, { rotation: r, svgOrigin: "24 24" });
          // land on the logo angle (-7° = 353°), always turning forward
          gsap.to(spin, { rotation: r < 353 ? 353 : 713, duration: 0.6, ease: "power3.out", svgOrigin: "24 24" });
        })
        .to(arc, { len: FINAL, duration: 0.6, ease: "power3.out", onUpdate: draw }, "<")
        .fromTo("[data-island]", { scale: 0, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(3)" }, "-=0.25")
        .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "power4.inOut" }, "+=0.2");
    },
    { scope: root },
  );

  if (done) return null;
  return (
    <div
      ref={root}
      id="vm-loader"
      className="fixed inset-0 z-[100] grid place-items-center bg-red"
      style={{ clipPath: "inset(0 0 0% 0)" }}
      role="status"
      aria-label="Loading Visiting Maldives"
    >
      <svg data-mark viewBox="8 8 32 32" className="size-24 sm:size-28" aria-hidden="true">
        <g data-spin>
          <circle data-ring cx="24" cy="24" r="12.5" fill="none" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" strokeDasharray={`4 ${C - 4}`} />
        </g>
        <circle data-island cx="27.4" cy="20.6" r="3" fill="#fff" opacity="0" />
      </svg>
    </div>
  );
}
