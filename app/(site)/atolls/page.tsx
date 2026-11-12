import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import AtollFilter from "@/components/AtollFilter";
import { P } from "@/lib/data";
import { getAtolls } from "@/lib/content/store";

export const metadata: Metadata = { title: "Islands & atolls" };

export default async function Atolls() {
  // the administrative atolls only; single-island entries live under their atoll
  const atolls = (await getAtolls()).filter((a) => !a.parent);
  return (
    <>
      <PageHero
        image={P.baaAerial}
        title="26 atolls,"
        accent="one country."
        intro="From Haa Alif in the far north to Addu south of the equator, here are the 20 administrative atolls and their islands. Pick one by what you want to do and how far you want to travel."
      />
      <section className="container-vm py-12 lg:py-24">
        <AtollFilter atolls={atolls} />
      </section>
    </>
  );
}
