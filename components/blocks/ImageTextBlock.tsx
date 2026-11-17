import Image from "next/image";
import { isCommons, photo } from "@/lib/data";
import TextBlock from "@/components/blocks/TextBlock";
import ButtonBlock from "@/components/blocks/ButtonBlock";

/** A photo beside text, the photo on the left or right; stacked on phones. */
export default function ImageTextBlock({
  image,
  alt,
  body,
  side = "Left",
  buttonLabel,
  buttonLink,
}: {
  image?: string;
  alt: string;
  body?: string;
  side?: string;
  buttonLabel?: string;
  buttonLink?: string;
}) {
  const src = image ? photo(image, 1200) : "";
  return (
    <div className="grid items-center gap-6 md:grid-cols-2 md:gap-10">
      {src ? (
        <div className={`relative aspect-[4/3] overflow-hidden rounded-card bg-shell ${side === "Right" ? "md:order-2" : ""}`}>
          <Image src={src} unoptimized={isCommons(src)} alt={alt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
        </div>
      ) : null}
      <div>
        <TextBlock body={body} />
        <ButtonBlock label={buttonLabel} link={buttonLink} className="mt-6" />
      </div>
    </div>
  );
}
