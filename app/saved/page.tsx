import type { Metadata } from "next";
import SavedList from "@/components/SavedList";

export const metadata: Metadata = { title: "Saved guides" };

export default function Saved() {
  return (
    <section className="container-vm min-h-[calc(70svh/var(--z))] pt-32 pb-24">
      <span className="eyebrow inline-block rounded-control bg-shell px-2.5 py-1 text-red">Your trip</span>
      <h1 className="mt-4 text-[44px] leading-none font-semibold tracking-[-0.03em] sm:text-[64px]">
        Saved <span className="accent">guides</span>
      </h1>
      <SavedList />
    </section>
  );
}
