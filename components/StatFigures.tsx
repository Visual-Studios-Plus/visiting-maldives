import type { LucideIcon } from "lucide-react";

export type StatFigure = { n: number; label: string; Icon: LucideIcon };

/**
 * A row of figures, each a column with its icon and number on top and the label underneath,
 * divided by thin lines. Used on the atoll cards and a place to stay's page. Zeros are left out.
 */
export default function StatFigures({ stats, className = "" }: { stats: StatFigure[]; className?: string }) {
  const shown = stats.filter((s) => s.n > 0);
  if (!shown.length) return null;
  return (
    <dl className={`flex divide-x divide-white/25 ${className}`}>
      {shown.map((s) => (
        <div key={s.label} className="flex flex-col items-center px-4 text-center first:pl-0 last:pr-0">
          <dd className="flex items-center gap-1.5 text-[18px] leading-6 font-semibold text-white tabular-nums">
            <s.Icon aria-hidden className="size-[18px] shrink-0" strokeWidth={1.75} />
            {s.n}
          </dd>
          <dt className="mt-0.5 text-[12px] leading-4 text-white/75 first-letter:uppercase">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}
