"use client";
import Link from "next/link";
import { useState } from "react";

/** `href`: the island's own page, when it has one */
type IslandItem = { name: string; detail?: string; href?: string };

/**
 * Atoll island lists: show a short preview first, then let people expand the rest.
 * Lists short enough to read at a glance are shown whole, without a toggle.
 */
export default function IslandList({
  items,
  variant = "rows",
  muted = false,
  limit,
}: {
  items: IslandItem[];
  variant?: "rows" | "chips";
  muted?: boolean;
  limit?: number;
}) {
  const preview = limit ?? (variant === "chips" ? 8 : 6);
  // +1 or +2 hidden items would look like a teaser with no payoff, so show those whole
  const collapsible = items.length > preview + 2;
  const [open, setOpen] = useState(false);
  const visible = collapsible && !open ? items.slice(0, preview) : items;

  const toggle = (
    <button
      type="button"
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
      className={
        variant === "chips"
          ? "inline-flex min-h-8 items-center rounded-full border border-line bg-white px-3 py-1 text-sm font-medium transition-colors hover:border-red hover:text-red"
          : "inline-flex min-h-11 items-center gap-2 text-sm font-medium text-red transition-colors hover:underline"
      }
    >
      {open ? "Show less" : `See all ${items.length}`}
      <span aria-hidden className={`inline-block transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
        ↓
      </span>
    </button>
  );

  if (variant === "chips") {
    return (
      <ul className="mt-4 flex flex-wrap gap-2">
        {visible.map((item) => (
          <li key={item.name}>
            {item.href ? (
              <Link
                href={item.href}
                className={`block rounded-full bg-white px-3 py-1 text-sm transition-colors hover:bg-red hover:text-white ${muted ? "text-driftwood" : "font-medium"}`}
              >
                {item.name}
              </Link>
            ) : (
              <span className={`block rounded-full bg-white px-3 py-1 text-sm ${muted ? "text-driftwood" : "font-medium"}`}>{item.name}</span>
            )}
          </li>
        ))}
        {collapsible ? <li>{toggle}</li> : null}
      </ul>
    );
  }

  return (
    <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((item) => (
        <li key={item.name}>
          <p className="text-[17px] font-semibold">{item.name}</p>
          {item.detail ? <p className="text-sm text-driftwood">{item.detail}</p> : null}
        </li>
      ))}
      {collapsible ? (
        <li className="sm:col-span-2 lg:col-span-3">{toggle}</li>
      ) : null}
    </ul>
  );
}
