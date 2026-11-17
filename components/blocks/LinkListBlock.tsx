import Link from "next/link";
import type { SectionItem } from "@/components/blocks/types";

/** A list of links, each with an optional short line under it. */
export default function LinkListBlock({ items }: { items: SectionItem[] }) {
  if (!items.length) return null;
  return (
    <ul className="divide-y divide-line rounded-card border border-line">
      {items.map((it, i) => {
        const inner = (
          <>
            <span className="font-semibold group-hover:text-red">{it.title}</span>
            {it.text ? <span className="mt-0.5 block text-[15px] text-driftwood">{it.text}</span> : null}
          </>
        );
        return (
          <li key={i}>
            {it.link ? (
              <Link href={it.link} className="group flex min-h-14 items-center justify-between gap-4 px-5 py-3">
                <span>{inner}</span>
                <span aria-hidden className="text-driftwood group-hover:text-red">→</span>
              </Link>
            ) : (
              <div className="px-5 py-3">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
