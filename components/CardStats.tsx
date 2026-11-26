import { Anchor, BedDouble, DoorOpen } from "lucide-react";

export type CardStatsData = {
  rooms?: number;
  beds?: number;
  berths?: number;
  /** a liveaboard: its rooms are cabins */
  cabins?: boolean;
};

/**
 * A place to stay's size on a card: rooms (or cabins), beds and yacht berths, each with its icon.
 * `dark`: over a photo; `light`: on a white card. Draws nothing without figures.
 */
export default function CardStats({ data, dark = false, className = "" }: { data: CardStatsData; dark?: boolean; className?: string }) {
  const figures = [
    { n: data.rooms, label: data.cabins ? "cabins" : data.rooms === 1 ? "room" : "rooms", Icon: DoorOpen },
    { n: data.beds, label: data.beds === 1 ? "bed" : "beds", Icon: BedDouble },
    { n: data.berths, label: "berths", Icon: Anchor },
  ].filter((f): f is typeof f & { n: number } => typeof f.n === "number" && f.n > 0);
  if (!figures.length) return null;
  return (
    <dl className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] leading-5 ${dark ? "text-white/85" : "text-driftwood"} ${className}`}>
      {figures.map((f) => (
        <div key={f.label} className="flex items-center gap-1">
          <f.Icon aria-hidden className={`size-[15px] shrink-0 ${dark ? "text-white/75" : "text-ink/60"}`} strokeWidth={1.75} />
          <dd className={`font-semibold tabular-nums ${dark ? "text-white" : "text-ink"}`}>{f.n}</dd>
          <dt>{f.label}</dt>
        </div>
      ))}
    </dl>
  );
}
