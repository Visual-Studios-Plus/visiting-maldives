import Image from "next/image";
import Link from "next/link";
import { photo, type Guide } from "@/lib/data";

// Phone guide card, brand guide p.35: photo on top with a season tag,
// red category · atoll eyebrow, bold title, read time and checked date.
export default function GuideListCard({ guide }: { guide: Guide }) {
  return (
    <Link href={`/guides/${guide.slug}`} className="group block">
      <div className="relative aspect-[16/10] overflow-hidden rounded-card">
        <Image src={photo(guide.image, 800)} alt={guide.title} fill sizes="100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute top-3 right-3 rounded-control bg-white px-2.5 py-1 text-[12px] leading-4 font-semibold text-ink">{guide.season}</span>
      </div>
      <p className="eyebrow mt-3 text-red">
        {guide.category} · {guide.atoll}
      </p>
      <h3 className="mt-1 text-[20px] leading-6 font-semibold">{guide.title}</h3>
      <p className="mt-1 font-mono text-[12px] text-driftwood">{guide.read} min read · Checked Nov 2026</p>
    </Link>
  );
}
