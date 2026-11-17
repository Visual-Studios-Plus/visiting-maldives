import IslandMap, { type MapPlace } from "@/components/IslandMap";

/** The island map with a small heading, sized to sit under "At a glance" in one screen. */
export default function MapPanel({
  name,
  center,
  places,
  unplaced,
}: {
  name: string;
  center: [number, number];
  places: MapPlace[];
  unplaced?: { name: string; href: string }[];
}) {
  return (
    <div data-reveal>
      <p className="eyebrow text-driftwood">Map of {name}</p>
      <div className="mt-2">
        <IslandMap name={name} center={center} places={places} unplaced={unplaced} compact />
      </div>
    </div>
  );
}
