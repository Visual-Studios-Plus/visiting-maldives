import type { CustomSection } from "@/lib/data";
import { getAtolls, getEats, getGuides, getIslands, getSalons, getSections, getStays } from "@/server/content/store";
import { sectionContent, sectionsFor, type SectionData, type SectionPage } from "@/lib/sections";
import SectionBlock from "@/components/blocks/SectionBlock";

const needsData = (s: CustomSection) => s.block === "Carousel" || s.block === "Card grid";

/**
 * The sections built in the dashboard (Page sections) for one page and position. Draws nothing
 * when there are none, so it can sit on any page beside the sections the page already has.
 */
export default async function CustomSections({
  page,
  position,
  variant,
}: {
  page: SectionPage;
  position?: CustomSection["position"];
  variant: "column" | "wide";
}) {
  const list = sectionsFor(await getSections(), page, position);
  if (!list.length) return null;

  let data: SectionData | undefined;
  if (list.some(needsData)) {
    const [atolls, entries, stays, eats, salons, guides] = await Promise.all([getAtolls(), getIslands(), getStays(), getEats(), getSalons(), getGuides()]);
    data = { atolls, entries, stays, eats, salons, guides };
  }

  return (
    <>
      {list.map((s, i) => (
        <SectionBlock key={`${s.title}-${i}`} section={s} variant={variant} content={data && needsData(s) ? sectionContent(s, page, data) : undefined} />
      ))}
    </>
  );
}
