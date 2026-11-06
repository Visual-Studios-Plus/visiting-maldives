import Link from "next/link";
import { CHECKED, essentials } from "@/lib/data";

export default function Essentials({ limit }: { limit?: number }) {
  const list = limit ? essentials.slice(0, limit) : essentials;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((e) => (
        <article
          key={e.label}
          id={e.label.toLowerCase().split(" ")[0]}
          data-reveal
          className="group flex flex-col rounded-card border border-line bg-white p-6 transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(20,18,26,0.35)]"
        >
          <p className="eyebrow text-driftwood">{e.label}</p>
          <p className="mt-3 text-[48px] leading-none font-semibold tracking-[-0.04em] text-red">{e.big}</p>
          <p className="mt-4 flex-1 text-ink">{e.text}</p>
          <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
            <span className="font-mono text-[12px] text-driftwood">{CHECKED}</span>
            <Link href="/plan-your-trip" className="text-[15px] font-semibold text-ink group-hover:text-red">
              Read guide →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
