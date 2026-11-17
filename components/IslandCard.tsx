import Image from "next/image";
import Link from "next/link";
import { BedDouble, Scissors, Star, UtensilsCrossed } from "lucide-react";
import { isCommons, photo } from "@/lib/data";

export type IslandCardData = {
  name: string;
  href: string;
  /** short line under the name (tagline, or the atoll) */
  subtitle: string;
  /** top-left pill, e.g. "Local island" */
  badge: string;
  /** a star in the badge (islands with a full write-up) */
  starred?: boolean;
  /** the atoll, shown in the footer */
  atoll: string;
  image: string;
  alt: string;
  stays: number;
  eats: number;
  salons: number;
};

/**
 * A local island as a tall photo card: badge on top; name, subtitle and how many places to stay,
 * eat and salons are listed over a dark fade; then a ruled footer naming the atoll.
 */
export default function IslandCard({ island: c, sizes = "(min-width:1024px) 30vw, (min-width:640px) 45vw, 85vw" }: { island: IslandCardData; sizes?: string }) {
  const stats = [
    { Icon: BedDouble, label: "Stay", n: c.stays },
    { Icon: UtensilsCrossed, label: "Eat", n: c.eats },
    { Icon: Scissors, label: "Salons", n: c.salons },
  ];
  return (
    <Link
      href={c.href}
      className="group relative block aspect-[4/5] overflow-hidden rounded-[24px] bg-ink text-white transition-[translate] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1 motion-reduce:hover:translate-y-0"
    >
      <Image
        src={photo(c.image, 900)}
        unoptimized={isCommons(c.image)}
        alt={c.alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      {/* dark fade so the text always reads, whatever the photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 via-35% to-transparent to-70%" />

      <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-ink shadow-sm">
        {c.starred ? <Star aria-hidden className="size-3.5 fill-[#F5B83D] text-[#F5B83D]" /> : null}
        {c.badge}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="text-[26px] leading-8 font-semibold tracking-tight">{c.name}</h3>
        <div className="mt-2 flex items-end justify-between gap-3">
          <p className="line-clamp-2 min-w-0 flex-1 text-[14px] leading-5 text-white/70">{c.subtitle}</p>
          <dl className="flex shrink-0">
            {stats.map(({ Icon, label, n }, i) => (
              <div key={label} title={`${n} ${label.toLowerCase()} listed`} className={`flex flex-col items-center px-2.5 ${i ? "border-l border-white/20" : ""}`}>
                <dd className="flex items-center gap-1 text-[15px] leading-5 font-semibold tabular-nums">
                  <Icon aria-hidden className="size-4 text-white/80" />
                  {n}
                </dd>
                <dt className="mt-0.5 text-[12px] text-white/75">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
        <p className="mt-4 border-t border-white/20 pt-3 text-[13px] text-white/60">
          In <span aria-hidden>•</span> <span className="font-medium text-white underline decoration-white/50 underline-offset-4">{c.atoll}</span>
        </p>
      </div>
    </Link>
  );
}
