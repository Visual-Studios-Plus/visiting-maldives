import { notFound, redirect } from "next/navigation";
import { stayInAtoll } from "@/lib/data";
import { getAtolls, getStays } from "@/lib/content/store";
import { islandSlug } from "@/lib/resorts";

/*
 * Old resort addresses (/atolls/<atoll>/resorts/<island>) sent visitors to atoll-owned pages.
 * Every place to stay, resorts included, now lives at /stay/<slug>: send old links there.
 */
export const instant = false;

export default async function OldResortPage({ params }: { params: Promise<{ slug: string; island: string }> }) {
  const { slug, island } = await params;
  const atoll = (await getAtolls()).find((a) => a.slug === slug);
  const stay = atoll && (await getStays()).find((s) => s.island && islandSlug(s.island) === island && stayInAtoll(s, atoll));
  if (!stay) notFound();
  redirect(`/stay/${stay.slug}`);
}
