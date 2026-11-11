import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import GuideCard from "@/components/GuideCard";
import ViewTracker from "@/components/ViewTracker";
import PhotoGallery from "@/components/PhotoGallery";
import { slugParams, getAtoll, getAtolls, getGuides } from "@/lib/content/store";

// Every page is prerendered from generateStaticParams, so a blocking route is fine here
export const instant = false;

export async function generateStaticParams() {
  return slugParams(await getAtolls());
}

export async function generateMetadata({ params }: PageProps<"/atolls/[slug]">): Promise<Metadata> {
  const a = await getAtoll((await params).slug);
  return { title: a?.name ?? "Atoll" };
}

export default async function AtollPage({ params }: PageProps<"/atolls/[slug]">) {
  const atoll = await getAtoll((await params).slug);
  if (!atoll) notFound();
  const key = atoll.name.split(" ")[0].replace("&", "").trim();
  const guides = await getGuides();
  const related = guides.filter((g) => g.atoll.includes(key) || (atoll.slug === "male" && /Malé|Kaafu|Velana/.test(g.atoll)));
  const list = related.length ? related : guides.slice(0, 3);

  return (
    <>
      <ViewTracker type="atoll" slug={atoll.slug} />
      <PageHero image={atoll.image} eyebrow={`${atoll.region} Maldives`} title={atoll.name} intro={atoll.intro} />
      <Reveal as="section" className="container-vm grid gap-4 py-12 sm:grid-cols-3 lg:py-16">
        {[
          ["Getting there", `MLE → ${atoll.transfer}`],
          ["Best for", atoll.bestFor.join(" · ")],
          ["In Dhivehi", atoll.dhivehi],
        ].map(([k, v]) => (
          <div key={k} data-reveal className="rounded-card bg-shell p-6">
            <p className="eyebrow text-driftwood">{k}</p>
            <p className={`mt-2 text-[22px] leading-7 font-semibold ${k === "In Dhivehi" ? "font-thaana" : ""}`}>{v}</p>
          </div>
        ))}
      </Reveal>
      {atoll.islands ? (
        <Reveal as="section" className="container-vm pb-12 lg:pb-16">
          <SectionHead eyebrow="Islands" title="Islands of" accent={atoll.name} />
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {atoll.islands.resorts.length ? (
              <div className="rounded-card bg-shell p-6 lg:col-span-2">
                <p className="eyebrow text-driftwood">Resorts · one island, one resort</p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {atoll.islands.resorts.map((r) => (
                    <li key={r.island}>
                      <p className="text-[17px] font-semibold">{r.island}</p>
                      <p className="text-sm text-driftwood">{r.resort}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {atoll.islands.halfResort?.length ? (
              <div className="rounded-card bg-shell p-6 lg:col-span-2">
                <p className="eyebrow text-driftwood">Half resort, half local island</p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {atoll.islands.halfResort.map((r) => (
                    <li key={r.island}>
                      <p className="text-[17px] font-semibold">{r.island}</p>
                      <p className="text-sm text-driftwood">{r.resort}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="rounded-card bg-shell p-6">
              <p className="eyebrow text-driftwood">
                Inhabited · {atoll.islands.inhabited.length}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {atoll.islands.inhabited.map((name) => (
                  <li key={name} className="rounded-full bg-white px-3 py-1 text-sm font-medium">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-card bg-shell p-6">
              <p className="eyebrow text-driftwood">
                Uninhabited · {atoll.islands.uninhabited.length}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {atoll.islands.uninhabited.map((name) => (
                  <li key={name} className="rounded-full bg-white px-3 py-1 text-sm text-driftwood">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      ) : null}
      {atoll.gallery?.length ? (
        <div className="container-vm -mt-4 pb-12 lg:pb-20">
          <PhotoGallery photos={atoll.gallery} title={`${atoll.name} in photos`} />
        </div>
      ) : null}
      <Reveal as="section" className="container-vm pb-12 lg:pb-24">
        <SectionHead eyebrow="Guides" title={`In and around`} accent={atoll.name} href="/things-to-do" cta="All guides" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((g) => (
            <div key={g.slug} data-reveal>
              <GuideCard guide={g} />
            </div>
          ))}
        </div>
      </Reveal>
    </>
  );
}
