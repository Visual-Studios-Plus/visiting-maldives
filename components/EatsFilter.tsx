"use client";
import { useState } from "react";
import type { Eat } from "@/lib/data";
import RestaurantCard from "./RestaurantCard";

/** Restaurant cards with a row of chips to filter by kind of place (only kinds that exist). */
export default function EatsFilter({ eats }: { eats: Eat[] }) {
  const kinds = [...new Set(eats.map((e) => e.kind))];
  const [kind, setKind] = useState<string>("All");
  const list = kind === "All" ? eats : eats.filter((e) => e.kind === kind);

  return (
    <>
      {kinds.length > 1 && (
        <div role="group" aria-label="Filter places by kind" className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {["All", ...kinds].map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={kind === k}
              onClick={() => setKind(k)}
              className={`inline-flex min-h-11 shrink-0 items-center rounded-control px-4 text-[14px] font-medium transition-colors ${kind === k ? "bg-ink text-white" : "bg-shell text-ink hover:bg-line"}`}
            >
              {k === "All" ? "All places" : k}
            </button>
          ))}
        </div>
      )}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((e) => (
          <RestaurantCard key={e.name} eat={e} />
        ))}
      </div>
    </>
  );
}
