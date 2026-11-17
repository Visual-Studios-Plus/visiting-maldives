import IslandMap, { type MapPlace } from "@/components/IslandMap";

/** "Where things are on …": the island map with its heading, for the guide layout's right column. */
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
      <p className="eyebrow text-driftwood">Map</p>
      <h2 className="mt-1 text-[22px] leading-7 font-semibold tracking-tight">Where things are on {name}</h2>
      <div className="mt-4">
        <IslandMap name={name} center={center} places={places} unplaced={unplaced} />
      </div>
    </div>
  );
}
