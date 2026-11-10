import Image from "next/image";
import { photo, type Dish } from "@/lib/data";

/** A dish to know: photo, kind, name (with Dhivehi), what it is, and where to try it. */
export default function DishCard({ dish }: { dish: Dish }) {
  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-shell">
        <Image
          src={photo(dish.image, 800)}
          alt={dish.name}
          fill
          sizes="(min-width:1024px) 25vw, (min-width:600px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="rounded-control bg-white/95 px-2.5 py-1 text-[11px] leading-4 font-semibold tracking-[0.06em] text-ink uppercase">{dish.kind}</span>
          {dish.vegetarian && <span className="rounded-control bg-flag-green px-2.5 py-1 text-[11px] leading-4 font-semibold text-white">Vegetarian</span>}
        </div>
      </div>
      <div className="mt-3.5 flex items-baseline gap-2.5">
        <h3 className="text-[21px] leading-tight font-semibold tracking-[-0.02em]">{dish.name}</h3>
        {dish.local && (
          <span lang="dv" dir="rtl" className="font-thaana text-[15px] text-driftwood">
            {dish.local}
          </span>
        )}
      </div>
      <p className="mt-1.5 text-[15px] leading-[1.5] text-pretty text-driftwood">{dish.text}</p>
      {dish.whereToTry && (
        <p className="mt-2.5 text-[13px] leading-snug">
          <span className="font-semibold text-red">Try it:</span> {dish.whereToTry}
        </p>
      )}
    </article>
  );
}
