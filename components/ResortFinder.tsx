"use client";
import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { isCommons } from "@/lib/data";

export type ResortItem = {
  /** resort name, or the island name when the resort isn't named yet */
  resort: string;
  island: string;
  named: boolean;
  /** a hotel on an inhabited island rather than a resort island */
  half?: boolean;
  /** the label on the card, e.g. "Resort", "Resort island", "Guesthouse" */
  label: string;
  /** whether the "Resorts only" filter keeps this entry */
  isResort?: boolean;
  atollSlug: string;
  atollName: string;
  region: "North" | "Central" | "South";
  href: string;
  image: string;
};

const REGIONS = ["All", "North", "Central", "South"] as const;
const PAGE = 24;

const plain = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Every resort island as photo cards, with search, region chips and an atoll filter. */
export default function ResortFinder({ resorts, atolls }: { resorts: ResortItem[]; atolls: { slug: string; name: string }[] }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("All");
  const [atoll, setAtoll] = useState("all");
  const [resortsOnly, setResortsOnly] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const q = plain(useDeferredValue(query).trim());

  const list = useMemo(
    () =>
      resorts.filter(
        (r) =>
          (region === "All" || r.region === region) &&
          (atoll === "all" || r.atollSlug === atoll) &&
          (!resortsOnly || r.isResort) &&
          (!q || plain(`${r.resort} ${r.island} ${r.atollName}`).includes(q)),
      ),
    [resorts, region, atoll, resortsOnly, q],
  );

  // reset paging whenever the filters change
  const reset = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setShown(PAGE);
  };

  const visibleAtolls = atolls.filter((a) => region === "All" || resorts.some((r) => r.atollSlug === a.slug && r.region === region));

  return (
    <div>
      <div className="sticky top-[68px] z-30 -mx-4 border-b border-line bg-white px-4 py-4 sm:-mx-8 sm:px-8 lg:-mx-14 lg:px-14">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search resorts</span>
            <input
              type="search"
              value={query}
              onChange={(e) => reset(setQuery)(e.target.value)}
              placeholder="Search a resort, island or atoll"
              className="min-h-11 w-full rounded-control border border-line bg-white px-4 text-[15px] outline-none focus:border-ink"
            />
          </label>
          <label className="lg:w-64">
            <span className="sr-only">Atoll</span>
            <select
              value={atoll}
              onChange={(e) => reset(setAtoll)(e.target.value)}
              className="min-h-11 w-full rounded-control border border-line bg-white px-3 text-[15px] outline-none focus:border-ink"
            >
              <option value="all">All atolls</option>
              {visibleAtolls.map((a) => (
                <option key={a.slug} value={a.slug}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="no-scrollbar mt-3 flex items-center gap-2 overflow-x-auto">
          {REGIONS.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={region === r}
              onClick={() => {
                reset(setRegion)(r);
                setAtoll("all");
              }}
              className={`inline-flex min-h-10 shrink-0 items-center rounded-control px-4 text-[14px] font-medium transition-colors ${region === r ? "bg-ink text-white" : "bg-shell text-ink hover:bg-line"}`}
            >
              {r === "All" ? "All regions" : r}
            </button>
          ))}
          <label className="ml-auto inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-2 pl-2 text-[14px]">
            <input type="checkbox" checked={resortsOnly} onChange={(e) => reset(setResortsOnly)(e.target.checked)} className="size-4 accent-[#D21034]" />
            Resorts only
          </label>
        </div>
      </div>

      <p className="mt-6 font-mono text-[13px] text-driftwood" aria-live="polite">
        {list.length} {list.length === 1 ? "place to stay" : "places to stay"}
        {atoll !== "all" ? ` in ${atolls.find((a) => a.slug === atoll)?.name}` : region !== "All" ? ` in the ${region.toLowerCase()}` : ""}
      </p>

      {list.length ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.slice(0, shown).map((r) => (
            <Link key={`${r.atollSlug}-${r.island}`} href={r.href} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-shell">
                <Image
                  src={r.image}
                  unoptimized={isCommons(r.image)}
                  alt={r.named ? `${r.resort}, ${r.island}` : `${r.island}, a resort island`}
                  fill
                  sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <span className="absolute top-3 left-3 rounded-control bg-white px-2.5 py-1 text-[12px] font-medium">{r.label}</span>
              </div>
              <h3 className="mt-3 line-clamp-2 text-[18px] leading-6 font-semibold group-hover:underline">{r.resort}</h3>
              <p className="mt-1 text-[14px] text-driftwood">
                {r.named ? `${r.island} · ` : ""}
                {r.atollName}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-card bg-shell p-8 text-center">
          <p className="font-semibold">No resorts match.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setRegion("All");
              setAtoll("all");
              setResortsOnly(false);
              setShown(PAGE);
            }}
            className="mt-3 text-[15px] font-medium text-red hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {list.length > shown ? (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE)}
            className="inline-flex min-h-11 items-center rounded-control border border-line px-5 text-[15px] font-medium transition-colors hover:border-red hover:bg-red hover:text-white"
          >
            Show more ({list.length - shown} left)
          </button>
        </div>
      ) : null}
    </div>
  );
}
