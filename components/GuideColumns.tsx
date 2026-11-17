import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

export type GlanceRow = { label: string; value: string };

/** The dark "At a glance" card of key facts. */
export function GlanceCard({ rows, title = "At a glance", thaana = [] }: { rows: GlanceRow[]; title?: string; thaana?: string[] }) {
  return (
    <aside data-reveal className="h-max rounded-card bg-ink p-6 text-white">
      <p className="eyebrow text-white/60">{title}</p>
      <dl className="mt-4 divide-y divide-white/10">
        {rows.map((f) => (
          <div key={f.label} className="flex justify-between gap-4 py-3">
            <dt className="text-white/60">{f.label}</dt>
            <dd className={`text-right text-[14px] ${thaana.includes(f.label) ? "font-thaana text-[18px]" : "font-mono"}`}>{f.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

/**
 * The guide layout used on atoll and island pages: the main write-up on the left, and a 340px
 * column on the right with the "At a glance" card and anything stacked under it (e.g. a map).
 * On phones the right column follows the main content.
 */
export default function GuideColumns({
  children,
  glance = [],
  glanceTitle,
  side,
  className = "py-10 lg:py-14",
}: {
  children: ReactNode;
  glance?: GlanceRow[];
  glanceTitle?: string;
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
        <div className="grid h-max gap-6">
          {glance.length ? <GlanceCard rows={glance} title={glanceTitle} /> : null}
          {side}
        </div>
      ) : null}
    </Reveal>
  );
}
