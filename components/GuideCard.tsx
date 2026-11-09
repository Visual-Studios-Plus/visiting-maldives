import Image from "next/image";
import Link from "next/link";
import { photo, type Guide } from "@/lib/data";

/*
 * Guide card: the photo fills the whole card.
 * Reading order: category + read time (top) → title → summary → where/when + "Read guide" (bottom).
 * - The title leads: largest, tight tracking, balanced line breaks, two lines max.
 * - One footer row: quiet where/when on the left, a clear pill button on the right that turns
 *   red on hover and flashes red on press (global `a.group:active span.bg-white` style).
 * - A soft fade only along the bottom keeps white text readable; the rest of the photo stays clear.
 * Fixed aspect ratio, so every card is the same size in grids and the carousel.
 */
export default function GuideCard({ guide, tall = false, sizes = "(min-width:1024px) 33vw, (min-width:600px) 50vw, 100vw" }: { guide: Guide; tall?: boolean; sizes?: string }) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className={`group relative block overflow-hidden rounded-card bg-ink text-white shadow-[0_18px_40px_-22px_rgba(20,18,26,0.5)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1 hover:shadow-[0_28px_56px_-22px_rgba(20,18,26,0.6)] motion-reduce:hover:translate-y-0 ${tall ? "aspect-[3/4]" : "aspect-[4/5]"}`}
    >
      <Image
        src={photo(guide.image, 900)}
        alt={guide.title}
        fill
        sizes={sizes}
        draggable={false}
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />

      {/* fade only behind the text at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-[64%] bg-gradient-to-t from-ink/95 via-ink/50 to-transparent" />

      {/* Top: category and read time */}
      <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
        <span className="rounded-control bg-ink/70 px-2.5 py-1 text-[11px] leading-4 font-semibold tracking-[0.08em] text-white uppercase">{guide.category}</span>
        <span className="inline-flex items-center gap-1 rounded-control bg-white/95 px-2 py-1 text-[12px] leading-4 font-semibold text-ink tabular-nums">
          <svg viewBox="0 0 16 16" className="size-3" aria-hidden>
            <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 4.75V8l2.25 1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {guide.read} min
        </span>
      </div>

      {/* Bottom: title, summary, footer */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <h3 className="line-clamp-2 text-[21px] leading-[1.15] font-semibold tracking-[-0.02em] text-balance sm:text-[23px] lg:text-[25px]">{guide.short}</h3>
        <p className="mt-2 line-clamp-2 text-[14px] leading-[1.45] text-pretty text-white/80 sm:text-[15px]">{guide.summary}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          {/* two short lines, so it fits beside the button on a phone without being cut off */}
          <p className="min-w-0 font-mono text-[11px] leading-4 tracking-[0.06em] text-white/70 uppercase">
            <span className="block truncate">{guide.atoll}</span>
            <span className="block truncate text-white/55">{guide.season}</span>
          </p>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-control bg-white px-3.5 py-2 text-[13px] leading-4 font-semibold text-ink transition-colors duration-200 group-hover:bg-red group-hover:text-white">
            Read guide
            <span aria-hidden data-arrow className="inline-block">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
