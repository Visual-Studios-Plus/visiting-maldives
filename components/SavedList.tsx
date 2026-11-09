"use client";
import Link from "next/link";
import type { Guide } from "@/lib/data";
import { useSaved } from "@/lib/saved";
import GuideCard from "./GuideCard";

export default function SavedList({ guides }: { guides: Guide[] }) {
  const { list } = useSaved();
  const saved = guides.filter((g) => list.includes(g.slug));
  if (!saved.length)
    return (
      <div className="mt-10 rounded-card bg-shell p-8">
        <p className="max-w-md">Tap the bookmark on any guide to keep it here. Saved guides stay on this device.</p>
        <Link href="/things-to-do" className="mt-6 inline-flex rounded-control bg-red px-5 py-3 font-semibold text-white hover:bg-red-deep">
          Browse guides
        </Link>
      </div>
    );
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {saved.map((g) => (
        <GuideCard key={g.slug} guide={g} />
      ))}
    </div>
  );
}
