import Image from "next/image";
import Link from "next/link";
import { photo, type Guide } from "@/lib/data";

// Guide card, brand guide p.24: full photo, title + read-time pill, summary,
// season and atoll chips, full-width white "Read guide" button.
export default function GuideCard({ guide, tall = false, sizes = "(min-width:1024px) 33vw, (min-width:600px) 50vw, 100vw" }: { guide: Guide; tall?: boolean; sizes?: string }) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className={`group relative block overflow-hidden rounded-card bg-ink text-white transition-[translate,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_32px_56px_-20px_rgba(20,18,26,0.55)] shadow-[0_24px_48px_-20px_rgba(20,18,26,0.45)] ${tall ? "aspect-[3/4]" : "aspect-[4/5]"}`}
    >
      <Image
        src={photo(guide.image, 900)}
        alt={guide.title}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 via-45% to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[22px] leading-[26px] font-semibold">{guide.short}</h3>
          <span className="shrink-0 rounded-control bg-white px-2.5 py-1 text-[12px] leading-4 font-semibold text-ink">{guide.read} min</span>
        </div>
        <p className="mt-1.5 text-[15px] leading-[21px] text-white/85">{guide.summary}</p>
        <div className="mt-3 flex gap-1.5">
          <span className="rounded-control bg-white/25 px-2.5 py-1 text-[12px] leading-4 font-medium">{guide.season}</span>
          <span className="rounded-control bg-white/25 px-2.5 py-1 text-[12px] leading-4 font-medium">{guide.atoll}</span>
        </div>
        <span className="mt-4 block rounded-control bg-white py-3 text-center text-[15px] font-semibold text-ink transition-colors group-hover:bg-red group-hover:text-white">
          Read guide <span aria-hidden data-arrow className="inline-block">→</span>
        </span>
      </div>
    </Link>
  );
}
