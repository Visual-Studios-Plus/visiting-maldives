import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import AtollFilter, { type AtollCounts } from "@/components/AtollFilter";
import { eatInAtoll, P, salonInAtoll, stayInAtoll } from "@/lib/data";
import { getAtolls, getEats, getIslands, getSalons, getStays } from "@/lib/content/store";
import { inhabitedNames } from "@/lib/islands";
import { allResortRecords } from "@/lib/resorts";

export const metadata: Metadata = { title: "Islands & atolls" };

export default async function Atolls() {
  // the administrative atolls only; single-island entries live under their atoll
  const [all, stays, eats, salons, entries] = await Promise.all([getAtolls(), getStays(), getEats(), getSalons(), getIslands()]);
  const atolls = all.filter((a) => !a.parent);
  const resortRecords = allResortRecords(atolls);

  // what each atoll has, for the numbers on its card
  const counts: Record<string, AtollCounts> = Object.fromEntries(
    atolls.map((a) => {
      const here = stays.filter((s) => stayInAtoll(s, a));
      const resortStays = here.filter((s) => s.type === "Resort" || s.type === "Resort island").length;
      return [
        a.slug,
        {
          // resort stays once they're published at /stay; the atoll's resort list until then
          resorts: Math.max(resortStays, resortRecords.filter((r) => r.atollSlug === a.slug && !r.half).length),
          stays: here.length - resortStays,
          restaurants: eats.filter((e) => eatInAtoll(e, a)).length,
          salons: salons.filter((s) => salonInAtoll(s, a)).length,
          inhabited: inhabitedNames(a, entries).length,
        },
      ];
    }),
  );

  return (
    <>
      <PageHero
        image={P.baaAerial}
        title="Atolls"
        accent="to visit."
        intro="All 20 atolls, from Haa Alif in the north to Addu in the south, with what each is best for and how to get there."
      />
      <section className="container-vm py-12 lg:py-24">
        <AtollFilter atolls={atolls} counts={counts} />
      </section>
    </>
  );
}
