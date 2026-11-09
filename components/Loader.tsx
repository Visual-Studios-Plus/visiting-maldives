"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP, reduced, LOADED_EVENT } from "@/lib/gsap";

const C = 2 * Math.PI * 12.5; // ring circumference ≈ 78.54
const FINAL = 62; // visible arc in the logo (11-unit channel + round caps)
const MAX_WAIT = 12000; // never keep people on the loader longer than this, even on a slow network

/**
 * Resolves when the page's assets are in: every image (including ones further down that would
 * normally lazy-load on scroll), the web fonts and the window load event. Capped at MAX_WAIT so a
 * single slow or broken image can never trap people on the loading screen.
 */
function assetsReady() {
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
  // start the lazy ones now, so scrolling never meets an empty photo
  imgs.forEach((img) => {
    if (img.loading === "lazy") img.loading = "eager";
  });
  const each = imgs.map((img) =>
    img.complete
      ? Promise.resolve()
      : new Promise<void>((done) => {
          img.addEventListener("load", () => done(), { once: true });
          img.addEventListener("error", () => done(), { once: true }); // a broken image still counts as settled
        }),
  );
  const page =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((done) => window.addEventListener("load", () => done(), { once: true }));
  const fonts = document.fonts?.ready.then(() => undefined) ?? Promise.resolve();
  return Promise.race([
    Promise.all([...each, page, fonts]).then(() => undefined),
    new Promise<void>((done) => window.setTimeout(done, MAX_WAIT)),
  ]);
}

/**
 * Loading screen: the white atoll mark on Maldives red.
 * The reef ring spins like a material progress arc (growing and shrinking while it turns) for as
 * long as the page's images and fonts are still loading, then settles into the logo's open ring,
 * the island drops in, and the screen lifts away. Intros elsewhere start on LOADED_EVENT.
 */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const ring = root.current!.querySelector<SVGCircleElement>("[data-ring]")!;
      const spin = root.current!.querySelector<SVGGElement>("[data-spin]")!;
      const finish = () => setDone(true);
      const lifted = () => window.dispatchEvent(new Event(LOADED_EVENT));

      let ready = false;
      const loaded = assetsReady();
      loaded.then(() => {
        ready = true;
      });

      if (reduced()) {
        // no spinning, but still wait for the assets before revealing the page
        loaded.then(() => {
          lifted();
          gsap.to(root.current, { autoAlpha: 0, duration: 0.3, onComplete: finish });
        });
        return;
      }

      const arc = { len: 4 };
      const draw = () => gsap.set(ring, { attr: { "stroke-dasharray": `${arc.len} ${C - arc.len}` } });
      draw();

      // Continuous turn while the arc breathes
      const turn = gsap.to(spin, { rotation: "+=360", duration: 1, ease: "none", repeat: -1, svgOrigin: "24 24" });

      // Settle: stop spinning at the logo angle, open to the final arc, drop the island in, lift away
      const settle = () => {
        const r = ((Number(gsap.getProperty(spin, "rotation")) % 360) + 360) % 360;
        turn.kill();
        gsap.set(spin, { rotation: r, svgOrigin: "24 24" });
        gsap
          .timeline({ onComplete: finish })
          // land on the logo angle (-7° = 353°), always turning forward
          .to(spin, { rotation: r < 353 ? 353 : 713, duration: 0.6, ease: "power3.out", svgOrigin: "24 24" })
          .to(arc, { len: FINAL, duration: 0.6, ease: "power3.out", onUpdate: draw }, "<")
          .fromTo("[data-island]", { scale: 0, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(3)" }, "-=0.25")
          .add(lifted, "+=0.2")
          .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "power4.inOut" }, "<");
      };

      // One more breath (short, then long), then check again: keeps going until the assets are in
      const breathe = () => {
        if (ready) return settle();
        gsap
          .timeline({ onComplete: breathe })
          .to(arc, { len: 6, duration: 0.45, ease: "power2.inOut", onUpdate: draw })
          .to(arc, { len: 58, duration: 0.45, ease: "power2.inOut", onUpdate: draw });
      };

      // The opening is the same as before; it always plays in full, so the loader never just blinks
      gsap
        .timeline({ onComplete: breathe })
        .from("[data-mark]", { scale: 0.6, opacity: 0, duration: 0.4, ease: "back.out(2)" })
        .to(arc, { len: 58, duration: 0.45, ease: "power2.inOut", onUpdate: draw })
        .to(arc, { len: 6, duration: 0.45, ease: "power2.inOut", onUpdate: draw })
        .to(arc, { len: 58, duration: 0.45, ease: "power2.inOut", onUpdate: draw });
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
