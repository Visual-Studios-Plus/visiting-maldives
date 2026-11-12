"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { photo, isCommons, type GalleryPhoto } from "@/lib/data";

/*
 * Photo gallery for guide, atoll and stay pages (cards show only the cover photo).
 * - Desktop: a mosaic, one large photo plus up to four smaller; "+N more" on the last tile.
 * - Phones: a swipeable row that snaps photo by photo.
 * - Tap any photo: a full-screen viewer (native <dialog>: focus stays inside, Esc closes) with
 *   caption, counter, arrow buttons, ← → keys and swipe. Fades only for reduced motion.
 */
export default function PhotoGallery({ photos, title = "Photos" }: { photos: GalleryPhoto[]; title?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const touch = useRef<number | null>(null);
  const n = photos.length;

  const show = useCallback((i: number) => {
    setOpen(i);
    if (!dialog.current?.open) dialog.current?.showModal();
  }, []);
  const go = useCallback((d: 1 | -1) => setOpen((i) => (i === null ? i : (i + d + n) % n)), [n]);

  // keyboard arrows while the viewer is open; lock page scroll behind it
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [open, go]);

  if (!n) return null;
  const tiles = photos.slice(0, 5);
  const extra = n - tiles.length;
  const current = open !== null ? photos[open] : null;

  return (
    <section aria-label={title} className="mt-12">
      <div className="flex items-end justify-between gap-4">
        <h2 data-no-split className="text-[28px] font-semibold tracking-tight">
          {title}
        </h2>
        <p className="font-mono text-[12px] text-driftwood">
          {n} photo{n > 1 ? "s" : ""}
        </p>
      </div>

      {/* Phones: swipeable row */}
      <ul className="no-scrollbar -mx-4 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:hidden">
        {photos.map((p, i) => (
          <li key={p.src + i} className="w-[82%] shrink-0 snap-start">
            <button type="button" onClick={() => show(i)} className="group relative block aspect-[4/3] w-full overflow-hidden rounded-card bg-shell" aria-label={`Open photo ${i + 1} of ${n}: ${p.alt}`}>
              <Image src={photo(p.src, 900)} unoptimized={isCommons(p.src)} alt={p.alt} fill sizes="82vw" className="object-cover" />
            </button>
            {p.caption && <p className="mt-2 text-[13px] leading-snug text-driftwood">{p.caption}</p>}
          </li>
        ))}
      </ul>

      {/* Desktop: mosaic */}
      <ul className={`mt-6 hidden gap-3 sm:grid ${tiles.length === 1 ? "grid-cols-1" : tiles.length === 2 ? "grid-cols-2" : "grid-cols-4 grid-rows-2"} h-[min(70vh,560px)]`}>
        {tiles.map((p, i) => {
          const big = tiles.length >= 3 && i === 0;
          const last = i === tiles.length - 1 && extra > 0;
          const span = big ? "col-span-2 row-span-2" : tiles.length === 3 ? "col-span-2" : tiles.length === 4 && i === 3 ? "col-span-2" : "";
          return (
            <li key={p.src + i} className={span}>
              <button
                type="button"
                onClick={() => show(i)}
                className="group relative block size-full overflow-hidden rounded-card bg-shell focus-visible:outline-2 focus-visible:outline-offset-2"
                aria-label={last ? `Open gallery, ${n} photos` : `Open photo ${i + 1} of ${n}: ${p.alt}`}
              >
                <Image
                  src={photo(p.src, big ? 1600 : 900)} unoptimized={isCommons(p.src)}
                  alt={p.alt}
                  fill
                  sizes={big ? "(min-width:1024px) 50vw, 60vw" : "(min-width:1024px) 25vw, 40vw"}
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                {p.caption && !last && (
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-4 pt-8 pb-3 text-left text-[13px] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    {p.caption}
                  </span>
                )}
                {last && <span className="absolute inset-0 grid place-items-center bg-ink/55 text-[20px] font-semibold text-white">+{extra} more</span>}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Full-screen viewer */}
      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        aria-label={current ? `Photo ${open! + 1} of ${n}` : "Photo viewer"}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-white backdrop:bg-ink/80 open:animate-in open:fade-in"
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current === null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          touch.current = null;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }}
      >
        {current && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <p className="font-mono text-[13px] text-white/70 tabular-nums">
                {open! + 1} / {n}
              </p>
              <button type="button" onClick={() => dialog.current?.close()} className="grid size-11 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white" aria-label="Close photos">
                <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="relative min-h-0 flex-1">
              <Image key={current.src} src={photo(current.src, 2400)} unoptimized={isCommons(current.src)} alt={current.alt} fill sizes="100vw" className="animate-in fade-in object-contain duration-300" priority />
              {n > 1 && (
                <>
                  <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute top-1/2 left-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-2xl backdrop-blur hover:bg-black/60 sm:left-6">
                    ←
                  </button>
                  <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute top-1/2 right-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-2xl backdrop-blur hover:bg-black/60 sm:right-6">
                    →
                  </button>
                </>
              )}
            </div>
            <p className="min-h-14 px-4 py-4 text-center text-[15px] text-white/85 sm:px-6">{current.caption || current.alt}</p>
          </div>
        )}
      </dialog>
    </section>
  );
}
