"use client";
import { useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

const plain = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * A search box for a dashboard list: hides rows (elements with `data-search`) inside `children`
 * whose text doesn't contain every word typed. The list itself stays server-rendered.
 */
export default function ListSearch({ label, total, children }: { label: string; total: number; children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(total);
  const box = useRef<HTMLDivElement>(null);

  // filter as the user types: hide non-matching rows and count the rest
  const search = (q: string) => {
    setQuery(q);
    const words = plain(q).split(/\s+/).filter(Boolean);
    let n = 0;
    box.current?.querySelectorAll<HTMLElement>("[data-search]").forEach((row) => {
      const hit = words.every((w) => plain(row.dataset.search ?? "").includes(w));
      row.hidden = !hit;
      if (hit) n++;
    });
    setShown(n);
  };

  return (
    <div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => search(e.target.value)}
            placeholder={`Search ${label.toLowerCase()}…`}
            aria-label={`Search ${label.toLowerCase()}`}
            className="pr-9 pl-9"
          />
          {query && (
            <button type="button" onClick={() => search("")} aria-label="Clear search" className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center rounded text-muted-foreground hover:text-foreground">
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {query ? `${shown} of ${total}` : `${total} in total`}
        </p>
      </div>
      <div ref={box}>{children}</div>
      {query && shown === 0 && <p className="mt-4 text-sm text-muted-foreground">Nothing matches &ldquo;{query}&rdquo;.</p>}
    </div>
  );
}
