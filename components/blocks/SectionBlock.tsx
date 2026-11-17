import ResortCarousel from "@/components/ResortCarousel";
import IslandCarousel from "@/components/IslandCarousel";
import PhotoGallery from "@/components/PhotoGallery";
import { photo, type CustomSection } from "@/lib/data";
import type { SectionContent } from "@/lib/sections";
import SectionShell from "@/components/blocks/SectionShell";
import TextBlock from "@/components/blocks/TextBlock";
import ImageTextBlock from "@/components/blocks/ImageTextBlock";
import ButtonBlock from "@/components/blocks/ButtonBlock";
import LinkListBlock from "@/components/blocks/LinkListBlock";
import { CardGrid, IslandGrid } from "@/components/blocks/CardGrid";

/** Draws one dashboard-built section: its frame plus the block chosen for it. */
export default function SectionBlock({
  section: s,
  content,
  variant,
}: {
  section: CustomSection;
  /** the cards of a Carousel or Card grid, already worked out for this page */
  content?: SectionContent;
  variant: "column" | "wide";
}) {
  const wide = variant === "wide";
  const items = s.items ?? [];
  // the button goes in the heading for card blocks, under the text for the others
  const headButton = s.block === "Carousel" || s.block === "Card grid";
  let inner: React.ReactNode = null;

  switch (s.block) {
    case "Text":
      inner = (
        <>
          <TextBlock body={s.body} />
          <ButtonBlock label={s.buttonLabel} link={s.buttonLink} className="mt-6" />
        </>
      );
      break;
    case "Image and text":
      inner = <ImageTextBlock image={s.image} alt={s.title} body={s.body} side={s.imageSide} buttonLabel={s.buttonLabel} buttonLink={s.buttonLink} />;
      break;
    case "Photo gallery": {
      const photos = items.filter((i) => i.image).map((i) => ({ src: photo(i.image!, 1600), alt: i.title, caption: i.text }));
      inner = photos.length ? <PhotoGallery photos={photos} title={s.title} /> : null;
      break;
    }
    case "Link list":
      inner = (
        <>
          <LinkListBlock items={items} />
          <ButtonBlock label={s.buttonLabel} link={s.buttonLink} className="mt-6" />
        </>
      );
      break;
    case "Button":
      inner = <ButtonBlock label={s.buttonLabel} link={s.buttonLink} />;
      break;
    case "Carousel":
      if (!content) break;
      if (content.kind === "islands") inner = content.islands.length ? <IslandCarousel islands={content.islands} label={s.title} /> : null;
      else inner = content.cards.length ? <ResortCarousel resorts={content.cards} inColumn /> : null;
      break;
    case "Card grid":
      if (!content) break;
      if (content.kind === "islands") inner = content.islands.length ? <IslandGrid islands={content.islands} wide={wide} /> : null;
      else inner = content.cards.length ? <CardGrid cards={content.cards} wide={wide} /> : null;
      break;
  }

  // an empty carousel or grid (nothing listed here yet) leaves no empty heading behind
  if (!inner) return null;
  return (
    <SectionShell
      variant={variant}
      eyebrow={s.eyebrow}
      title={s.title}
      intro={s.intro}
      href={headButton ? s.buttonLink : undefined}
      cta={headButton ? s.buttonLabel : undefined}
    >
      {inner}
    </SectionShell>
  );
}
