import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import CustomSections from "@/components/blocks/CustomSections";
import { photo, P } from "@/lib/data";
import { sectionPageSlug } from "@/lib/sections";
import { getSections, slugParams } from "@/lib/content/store";

/*
 * A page made only of sections built in the dashboard (Page sections → "Its own page").
 * All sections with the same page address make up one page, in their order.
 */

// Every page is prerendered from generateStaticParams, so a blocking route is fine here
export const instant = false;

async function pageSections(slug: string) {
  return (await getSections()).filter((s) => s.published && s.placement === "Its own page" && sectionPageSlug(s.pageSlug ?? "") === slug);
}

export async function generateStaticParams() {
  const slugs = new Set(
    (await getSections()).filter((s) => s.published && s.placement === "Its own page" && s.pageSlug).map((s) => sectionPageSlug(s.pageSlug!)),
  );
  return slugParams([...slugs].filter(Boolean).map((slug) => ({ slug })));
}

export async function generateMetadata({ params }: PageProps<"/p/[slug]">): Promise<Metadata> {
  const list = await pageSections((await params).slug);
  const head = list.find((s) => s.pageTitle) ?? list[0];
  return head ? { title: head.pageTitle || head.title, description: head.intro } : {};
}

export default async function CustomPage({ params }: PageProps<"/p/[slug]">) {
  const { slug } = await params;
  const list = await pageSections(slug);
  if (!list.length) notFound();
  const head = list.find((s) => s.pageTitle) ?? list[0];
  const cover = list.find((s) => s.image)?.image;

  return (
    <>
      <PageHero image={cover ? photo(cover, 2000) : photo(P.aerial, 2000)} eyebrow={head.eyebrow} title={head.pageTitle || head.title} intro={head.intro} />
      <div className="pt-12 lg:pt-20">
        <CustomSections page={{ kind: "custom", slug }} variant="wide" />
      </div>
    </>
  );
}
