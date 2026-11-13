import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import GuideFilter from "@/components/GuideFilter";
import { P } from "@/lib/data";
import { getGuides } from "@/lib/content/store";

export const metadata: Metadata = { title: "Things to do" };

export default async function ThingsToDo() {
  const guides = await getGuides();
  return (
    <>
      <PageHero
        image={P.coral}
        eyebrow="Things to do"
        title="Things to"
        accent="see and do."
        intro="Reefs, mantas, heritage walks and local islands, each with the best season and the atoll to go to."
      />
      <section className="container-vm py-12 lg:py-24">
        <Suspense fallback={<div className="h-96" />}>
          <GuideFilter guides={guides} />
        </Suspense>
      </section>
    </>
  );
}
