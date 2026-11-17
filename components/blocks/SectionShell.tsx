import Link from "next/link";
import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";

/**
 * The frame round every dashboard-built section: eyebrow, title, intro and an optional button.
 * "column" sits inside a page's left column (left-aligned, smaller); "wide" spans the page.
 */
export default function SectionShell({
  variant,
  eyebrow,
  title,
  intro,
  href,
  cta,
  children,
}: {
  variant: "column" | "wide";
  eyebrow?: string;
  title: string;
  intro?: string;
  href?: string;
  cta?: string;
  children: ReactNode;
}) {
  if (variant === "column")
    return (
      <Reveal as="section" className="mt-12">
        <div data-reveal className="flex flex-wrap items-end justify-between gap-3">
          <div>
            {eyebrow ? <p className="eyebrow text-red">{eyebrow}</p> : null}
            <h2 className="mt-1 text-[26px] leading-8 font-semibold tracking-tight lg:text-[28px]">{title}</h2>
          </div>
          {href ? (
            <Link href={href} className="text-[15px] font-medium hover:text-red">
              {cta || "View all"} →
            </Link>
          ) : null}
        </div>
        {intro ? <p className="mt-3 max-w-2xl text-[17px] leading-[28px] text-driftwood">{intro}</p> : null}
        <div className="mt-5">{children}</div>
      </Reveal>
    );
  return (
    <Reveal as="section" className="container-vm pb-12 lg:pb-20">
      <SectionHead eyebrow={eyebrow || "Explore"} title={title} href={href} cta={cta} />
      {intro ? <p data-reveal className="mx-auto mt-4 max-w-2xl text-center text-[17px] leading-[28px] text-driftwood">{intro}</p> : null}
      <div className="mt-10">{children}</div>
    </Reveal>
  );
}
