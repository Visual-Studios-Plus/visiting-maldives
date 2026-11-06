"use client";
import Link from "next/link";
import { useState } from "react";
import { guides, type Category } from "@/lib/data";
import GuideCard from "./GuideCard";

// Phone layout of "Most-read guides" (brand guide p.35).
const chips: (Category | "All")[] = ["All", "Marine life", "Heritage", "Food"];

export default function MobileGuides() {
  const [active, setActive] = useState<Category | "All">("All");
  const list = guides.filter((g) => active === "All" || g.category === active).slice(0, 4);
  return (
    <div className="container-vm sm:hidden">
      <span className="eyebrow inline-block rounded-control bg-shell px-2.5 py-1 text-red">Travel guides</span>
      <h2 className="mt-3 text-[32px] leading-[1.05] font-semibold tracking-[-0.03em]">
        Most-read <span className="accent">guides</span>
      </h2>
      <div className="no-scrollbar sticky top-[68px] z-30 -mx-4 mt-5 flex gap-2 overflow-x-auto border-b border-line bg-white px-4 py-3">
        {chips.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
            className={`inline-flex min-h-11 shrink-0 items-center rounded-control px-3.5 text-[14px] font-medium ${active === c ? "bg-ink text-white" : "bg-shell text-ink"}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-6 space-y-5">
        {list.map((g) => (
          <GuideCard key={g.slug} guide={g} sizes="100vw" />
        ))}
      </div>
      <Link href="/things-to-do" className="mt-8 block rounded-control border border-line py-3 text-center font-medium transition-colors hover:border-red hover:bg-red hover:text-white">
        View all guides
      </Link>
    </div>
  );
}
