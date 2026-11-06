import Link from "next/link";
import type { ReactNode } from "react";

export default function SectionHead({
  eyebrow,
  title,
  accent,
  href,
  cta = "View all",
  dark = false,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  href?: string;
  cta?: string;
  dark?: boolean;
  children?: ReactNode;
}) {
  return (
    <div data-reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className={`eyebrow inline-block rounded-control px-2.5 py-1 ${dark ? "bg-white/10 text-white" : "bg-shell text-red"}`}>{eyebrow}</span>
        <h2 className="mt-4 max-w-2xl text-[36px] leading-[1.03] font-semibold tracking-[-0.03em] sm:text-[48px] lg:text-[60px]">
          {title} {accent && <span className="accent">{accent}</span>}
        </h2>
      </div>
      <div className="flex items-center gap-3">
        {children}
        {href && (
          <Link
            href={href}
            className={`inline-flex shrink-0 items-center gap-2 rounded-control border px-4 py-2.5 text-[15px] font-medium transition-colors ${
              dark ? "border-white/30 hover:bg-white hover:text-ink" : "border-line hover:border-ink"
            }`}
          >
            {cta} <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
