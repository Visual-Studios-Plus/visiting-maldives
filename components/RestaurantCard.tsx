import Image from "next/image";
import Link from "next/link";
import Stars from "@/components/Stars";
import { eatSlug, photo, type Eat } from "@/lib/data";

/*
 * A place to eat, with what to order there.
 * Photo with the kind of place and typical price → area, name, one-line about →
 * the signature dish highlighted → "What to order" recommendations with a short reason each.
 * The whole card opens the place's page (reviews, map). Press feedback comes from the global
 * "a.group" card styles.
 */
export default function RestaurantCard({ eat }: { eat: Eat }) {
  const more = (eat.recommends ?? []).filter(
    (r) => r.dish.toLowerCase() !== eat.dish.toLowerCase(),
  );
  return (
    <Link
      href={`/eat-drink/${eatSlug(eat)}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white text-ink shadow-[0_18px_40px_-28px_rgba(20,18,26,0.45)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1 hover:shadow-[0_26px_50px_-28px_rgba(20,18,26,0.55)] motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-shell">
        <Image
          src={photo(eat.image, 900)}
          alt={`${eat.name}, ${eat.area}`}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:600px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <span className="rounded-control bg-ink/75 px-2.5 py-1 text-[11px] leading-4 font-semibold tracking-[0.08em] text-white uppercase">
            {eat.kind}
          </span>
          <span className="rounded-control bg-white/95 px-2.5 py-1 text-[12px] leading-4 font-semibold text-ink tabular-nums">
            ≈ {eat.price} <span className="font-normal text-driftwood">pp</span>
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.06em] text-driftwood uppercase">
          <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
            <path
              d="M8 14.5s5-4.3 5-8.2A5 5 0 0 0 3 6.3c0 3.9 5 8.2 5 8.2Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <circle cx="8" cy="6.3" r="1.7" fill="currentColor" />
          </svg>
          {eat.area}
        </p>
        <h3 className="mt-1.5 text-[22px] leading-[1.15] font-semibold tracking-[-0.02em] text-balance">
          {eat.name}
        </h3>
        {eat.rating ? (
          <p className="mt-1.5 flex items-center gap-2 text-[13px] text-driftwood">
            <Stars value={eat.rating} size={14} />
            <span className="font-semibold text-ink tabular-nums">
              {eat.rating.toFixed(1)}
            </span>
            {eat.reviews?.length ? (
              <span>· {eat.reviews.length} reviews</span>
            ) : null}
          </p>
        ) : null}
        {eat.about && (
          <p className="mt-1.5 text-[14px] leading-[1.45] text-pretty text-driftwood">
            {eat.about}
          </p>
        )}

        {/* the one thing to order */}
        <div className="mt-4 flex items-center gap-3 rounded-control bg-red/[0.07] px-3.5 py-2.5">
          <span className="text-[11px] font-semibold tracking-[0.08em] text-red uppercase">
            Order this
          </span>
          <span className="min-w-0 text-[15px] font-semibold">{eat.dish}</span>
        </div>

        {more.length > 0 && (
          <div className="mt-4">
            <p className="text-[12px] font-semibold tracking-[0.06em] text-driftwood uppercase">
              Also good here
            </p>
            <ul className="mt-2 grid gap-2">
              {more.map((r) => (
                <li
                  key={r.dish}
                  className="flex gap-2.5 text-[14px] leading-[1.4]"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="mt-[3px] size-3.5 shrink-0 text-red"
                    aria-hidden
                  >
                    <path
                      d="M3 8.5 6.5 12 13 4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    <span className="font-semibold">{r.dish}</span>
                    <span className="text-driftwood"> · {r.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* spacer: footers line up across a row, with room above on short cards */}
        <div aria-hidden className="min-h-5 flex-1" />
        <div className="flex items-center justify-between gap-3 border-t border-line pt-3.5 text-[13px]">
          <span className="flex items-center gap-1.5 text-driftwood">
            {eat.hours && (
              <>
                <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
                  <circle
                    cx="8"
                    cy="8"
                    r="6.25"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M8 4.75V8l2.25 1.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
                {eat.hours}
              </>
            )}
          </span>
          <span className="shrink-0 font-semibold text-red">
            Reviews &amp; map{" "}
            <span aria-hidden data-arrow className="inline-block">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
