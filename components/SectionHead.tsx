import Link from "next/link";
import type { ReactNode } from "react";

/** One title layout for every section: centred eyebrow pill, title, then any actions centred below. */
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
    <div data-reveal className="flex flex-col items-center text-center">
      <span className={`eyebrow inline-block rounded-control px-2.5 py-1 ${dark ? "bg-white/10 text-white" : "bg-shell text-red"}`}>{eyebrow}</span>
      <h2 className="mt-4 max-w-4xl text-[36px] leading-[1.03] font-semibold tracking-[-0.03em] text-balance sm:text-[48px] lg:text-[60px]">
        {title} {accent && <span className="accent">{accent}</span>}
      </h2>
      {(children || href) && (
        <div className="mt-6 flex items-center gap-3">
          {children}
          {href && (
            <Link
              href={href}
              className={`inline-flex shrink-0 items-center gap-2 rounded-control border px-4 py-2.5 text-[15px] font-medium transition-colors ${
                dark ? "border-white/30 hover:border-red hover:bg-red" : "border-line hover:border-red hover:bg-red hover:text-white"
              }`}
            >
              {cta} <span aria-hidden data-arrow className="inline-block">→</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
