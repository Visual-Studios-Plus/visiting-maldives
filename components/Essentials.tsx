import Link from "next/link";
import { CHECKED } from "@/lib/data";
import { getEssentials } from "@/lib/content/store";

// Essentials card (brand guide p.34): numbered label, big figure in ink, short fact,
// green "checked" stamp, optional guide link. Red is kept for the link only.
export default async function Essentials({ limit }: { limit?: number }) {
  const essentials = await getEssentials();
  const list = limit ? essentials.slice(0, limit) : essentials;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((e, i) => (
        <article
          key={e.label}
          id={e.label === "Transfers" ? undefined : e.label.toLowerCase().split(" ")[0]}
          data-reveal
          className="group relative flex min-h-[280px] flex-col overflow-hidden rounded-card bg-shell p-6 transition-colors hover:bg-[#F1ECEC]"
        >
          <span className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-red transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-y-100 motion-reduce:transition-none" />
          <div className="flex items-center justify-between">
            <p className="eyebrow text-driftwood">{e.label}</p>
            <span className="font-mono text-[12px] text-driftwood">{String(i + 1).padStart(2, "0")}</span>
          </div>
          <p className="mt-6 text-[56px] leading-none font-semibold tracking-[-0.04em] text-ink">{e.big}</p>
          <p className="mt-4 flex-1 leading-snug text-ink/80">{e.text}</p>
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4">
            <span className="flex items-center gap-2 font-mono text-[12px] text-driftwood">
              <span className="size-2 rounded-full bg-flag-green" aria-hidden />
              {CHECKED}
            </span>
            {e.href && (
              <Link href={e.href} className="text-[15px] font-semibold text-red hover:text-red-deep">
                Read guide <span aria-hidden data-arrow className="inline-block">→</span>
              </Link>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
