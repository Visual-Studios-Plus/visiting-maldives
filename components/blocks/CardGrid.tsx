import PhotoCard, { type ResortCard } from "@/components/PhotoCard";
import IslandCard, { type IslandCardData } from "@/components/IslandCard";

/** Photo cards or island cards in a grid: two columns inside a page column, three across the page. */
export function CardGrid({ cards, wide }: { cards: ResortCard[]; wide?: boolean }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${wide ? "lg:grid-cols-3" : ""}`}>
      {cards.map((c, i) => (
        <PhotoCard key={`${c.href}-${i}`} card={c} sizes={wide ? "(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw" : "(min-width:640px) 40vw, 90vw"} />
      ))}
    </div>
  );
}

export function IslandGrid({ islands, wide }: { islands: IslandCardData[]; wide?: boolean }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${wide ? "lg:grid-cols-3" : ""}`}>
      {islands.map((c) => (
        <IslandCard key={c.href} island={c} />
      ))}
    </div>
  );
}
