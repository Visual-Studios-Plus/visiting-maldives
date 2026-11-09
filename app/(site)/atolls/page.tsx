import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import AtollFilter from "@/components/AtollFilter";
import { P } from "@/lib/data";
import { getAtolls } from "@/lib/content/store";

export const metadata: Metadata = { title: "Islands & atolls" };

export default async function Atolls() {
  const atolls = await getAtolls();
  return (
    <>
      <PageHero
        image={P.baaAerial}
        title="26 atolls,"
        accent="one country."
        intro="From the capital's lagoons to Addu south of the equator. Pick an atoll by what you want to do and how far you want to travel."
      />
      <section className="container-vm py-12 lg:py-24">
        <AtollFilter atolls={atolls} />
      </section>
    </>
  );
}
