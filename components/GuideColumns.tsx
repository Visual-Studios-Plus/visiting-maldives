import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

export type GlanceRow = { label: string; value: string };

/** The dark "At a glance" card of key facts, compact so it fits beside a map in one screen. */
export function GlanceCard({ rows, title = "At a glance" }: { rows: GlanceRow[]; title?: string }) {
  return (
    <aside data-reveal className="h-max rounded-card bg-ink px-5 py-4 text-white">
      <p className="eyebrow text-white/60">{title}</p>
      <dl className="mt-2 divide-y divide-white/10">
        {rows.map((f) => (
          <div key={f.label} className="flex items-baseline justify-between gap-4 py-1.5">
            <dt className="shrink-0 text-[14px] whitespace-nowrap text-white/60">{f.label}</dt>
            <dd className="min-w-0 text-right font-mono text-[13px] leading-5">{f.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

/**
 * The island page layout: the write-up on the left, and on the right a 340px column (the width of
 * the "At a glance" card) with the card and anything stacked under it, such as the map. On wide
 * screens that column stays in view while the left side scrolls; on phones the columns stack.
 */
export default function GuideColumns({
  children,
  glance = [],
  side,
  className = "py-10 lg:py-14",
}: {
  children: ReactNode;
  glance?: GlanceRow[];
  /** shown under the card, in the same column */
  side?: ReactNode;
  /** vertical spacing of the section */
  className?: string;
}) {
  const hasSide = glance.length > 0 || Boolean(side);
  return (
    <Reveal as="section" className={`container-vm grid items-start gap-10 ${hasSide ? "lg:grid-cols-[minmax(0,1fr)_340px]" : ""} ${className}`}>
      <div className="min-w-0">{children}</div>
      {hasSide ? (
        // fixed beside the write-up; capped at the screen height so it never runs under the navbar
        <div className="grid min-w-0 gap-3 lg:sticky lg:top-24 lg:max-h-[calc(100svh-7rem)] lg:overflow-y-auto lg:overscroll-contain">
          {glance.length ? <GlanceCard rows={glance} /> : null}
          {side}
        </div>
      ) : null}
    </Reveal>
  );
}
