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
        title="Atolls"
        accent="to visit."
        intro="All 20 atolls, from Haa Alif in the north to Addu in the south, with what each is best for and how to get there."
      />
      <section className="container-vm py-12 lg:py-24">
        <AtollFilter atolls={atolls} />
      </section>
    </>
  );
}
