import Image from "next/image";
import Link from "next/link";
import { isCommons } from "@/lib/data";
import CardStats, { type CardStatsData } from "@/components/CardStats";

/** The data a photo card shows (places to stay, restaurants, salons, resorts, guides, hand-picked items). */
export type ResortCard = {
  island: string;
  resort: string;
  image: string;
  href: string;
  /** false: a resort island whose resort we have not named yet */
  named?: boolean;
  /** small line above the title (defaults to the island) */
  label?: string;
  /** button text (defaults to "View resort") */
  cta?: string;
  /** places to stay: rooms, beds and berths, shown above the button */
  stats?: CardStatsData;
};

/**
 * A tall photo card with a small label, a title and a call to action over a dark fade. Used by
 * the card carousels, card grids and dashboard-built sections, so they all look the same.
 */
export default function PhotoCard({ card: r, sizes = "(min-width:1024px) 330px, (min-width:640px) 300px, 260px" }: { card: ResortCard; sizes?: string }) {
  return (
    <Link
      href={r.href}
      className="group relative block aspect-[4/5] overflow-hidden rounded-card bg-ink text-white transition-[translate] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1.5 motion-reduce:hover:translate-y-0"
    >
      {r.image ? (
        <Image
          src={r.image}
          unoptimized={isCommons(r.image)}
          alt={`${r.resort}, ${r.island}`}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/45 via-45% to-ink/5" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="font-mono text-[12px] tracking-wide text-white/85 uppercase">{r.label ?? (r.named === false ? "Resort island" : r.island)}</p>
        <h3 className="mt-1 line-clamp-2 text-[21px] leading-[25px] font-semibold tracking-tight">{r.resort}</h3>
        {r.stats ? <CardStats data={r.stats} dark className="mt-2.5" /> : null}
        <span className="mt-3 inline-flex items-center gap-2 text-[14px] font-medium text-white/90">
          {r.cta ?? (r.named === false ? "View island" : "View resort")}
          <span aria-hidden data-arrow className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
