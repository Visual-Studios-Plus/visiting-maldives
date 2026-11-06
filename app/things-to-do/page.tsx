import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import GuideFilter from "@/components/GuideFilter";
import { P } from "@/lib/data";

export const metadata: Metadata = { title: "Things to do" };

export default function ThingsToDo() {
  return (
    <>
      <PageHero
        image={P.coral}
        eyebrow="Things to do"
        title="Reefs, streets"
        accent="and sandbanks."
        intro="Every guide shows the best season, the atoll and how long it takes to read, before you click."
      />
      <section className="container-vm py-12 lg:py-24">
        <Suspense fallback={<div className="h-96" />}>
          <GuideFilter />
        </Suspense>
      </section>
    </>
  );
}
