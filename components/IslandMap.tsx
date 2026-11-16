import Link from "next/link";

/*
 * A small map of an island built from OpenStreetMap tiles in an SVG: no map library, no API key,
 * no cookies. It zooms to fit the island and the places on it, numbers each place, and lists them
 * underneath. OpenStreetMap is credited on the map as its licence requires.
 */

export type MapPlace = { lat: number; lng: number; name: string; kind: "Stay" | "Eat" | "Salon"; href: string };

const W = 800;
const H = 460;
const TILE = 256;
const COLOR: Record<MapPlace["kind"], string> = { Stay: "#14121A", Eat: "#D21034", Salon: "#C98A12" };
const LABEL: Record<MapPlace["kind"], string> = { Stay: "Places to stay", Eat: "Places to eat", Salon: "Salons & spas" };

const px = (lat: number, lng: number, z: number) => {
  const n = TILE * 2 ** z;
  const r = (lat * Math.PI) / 180;
  return { x: ((lng + 180) / 360) * n, y: ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n };
};

export default function IslandMap({
  name,
  center,
  places,
  unplaced = [],
}: {
  name: string;
  center: [number, number];
  places: MapPlace[];
  /** places on the island that don't have a map position yet */
  unplaced?: { name: string; href: string }[];
}) {
  const points = [{ lat: center[0], lng: center[1] }, ...places];
  // the closest zoom (16 down to 11) that fits every point with some margin; 15 for the island alone
  let z = places.length ? 16 : 15;
  for (; places.length && z > 11; z--) {
    const p = points.map((q) => px(q.lat, q.lng, z));
    const w = Math.max(...p.map((q) => q.x)) - Math.min(...p.map((q) => q.x));
    const h = Math.max(...p.map((q) => q.y)) - Math.min(...p.map((q) => q.y));
    if (w <= W - 140 && h <= H - 140) break;
  }
  const all = points.map((q) => px(q.lat, q.lng, z));
  const cx = places.length ? (Math.max(...all.map((q) => q.x)) + Math.min(...all.map((q) => q.x))) / 2 : all[0].x;
  const cy = places.length ? (Math.max(...all.map((q) => q.y)) + Math.min(...all.map((q) => q.y))) / 2 : all[0].y;
  const left = cx - W / 2;
  const top = cy - H / 2;

  const tiles: { x: number; y: number }[] = [];
  for (let tx = Math.floor(left / TILE); tx <= Math.floor((left + W) / TILE); tx++)
    for (let ty = Math.floor(top / TILE); ty <= Math.floor((top + H) / TILE); ty++) tiles.push({ x: tx, y: ty });

  const kinds = (Object.keys(COLOR) as MapPlace["kind"][]).filter((k) => places.some((p) => p.kind === k));
  const gmaps = `https://www.google.com/maps/search/?api=1&query=${center[0]},${center[1]}`;
  const osm = `https://www.openstreetmap.org/?mlat=${center[0]}&mlon=${center[1]}#map=${z}/${center[0]}/${center[1]}`;

  return (
    <div>
      <div className="overflow-hidden rounded-card border border-line bg-[#aad3df]">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Map of ${name}${places.length ? ` with ${places.length} places marked` : ""}`} className="block h-auto w-full">
          {tiles.map((t) => (
            <image
              key={`${t.x}-${t.y}`}
              href={`https://tile.openstreetmap.org/${z}/${t.x}/${t.y}.png`}
              x={t.x * TILE - left}
              y={t.y * TILE - top}
              width={TILE}
              height={TILE}
              preserveAspectRatio="none"
            />
          ))}
          {places.length === 0 ? (
            <g transform={`translate(${all[0].x - left} ${all[0].y - top})`}>
              <circle r="9" fill="#D21034" stroke="#fff" strokeWidth="3" />
              <text y="-16" textAnchor="middle" className="fill-[#14121A] text-[15px] font-semibold" style={{ paintOrder: "stroke", stroke: "#fff", strokeWidth: 4 }}>
                {name}
              </text>
            </g>
          ) : (
            places.map((p, i) => {
              const q = all[i + 1];
              return (
                <a key={`${p.href}-${i}`} href={p.href} aria-label={`${i + 1}. ${p.name}`}>
                  <g transform={`translate(${q.x - left} ${q.y - top})`}>
                    <title>{p.name}</title>
                    <circle r="13" fill={COLOR[p.kind]} stroke="#fff" strokeWidth="3" />
                    <text y="5" textAnchor="middle" className="fill-white text-[13px] font-bold">
                      {i + 1}
                    </text>
                  </g>
                </a>
              );
            })
          )}
          <text x={W - 8} y={H - 8} textAnchor="end" className="fill-[#14121A] text-[11px]" style={{ paintOrder: "stroke", stroke: "#fff", strokeWidth: 3 }}>
            © OpenStreetMap contributors
          </text>
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[14px]">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {kinds.map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5 text-driftwood">
              <span aria-hidden className="size-3 rounded-full" style={{ background: COLOR[k] }} />
              {LABEL[k]}
            </span>
          ))}
        </div>
        <p className="flex gap-4">
          <a href={gmaps} target="_blank" rel="noopener noreferrer" className="font-medium text-red hover:underline">
            Open in Google Maps ↗
          </a>
          <a href={osm} target="_blank" rel="noopener noreferrer" className="text-driftwood hover:text-ink hover:underline">
            OpenStreetMap ↗
          </a>
        </p>
      </div>

      {places.length ? (
        <ol className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {places.map((p, i) => (
            <li key={`${p.href}-${i}`} className="flex items-center gap-2.5 text-[15px]">
              <span className="grid size-6 shrink-0 place-items-center rounded-full text-[12px] font-bold text-white" style={{ background: COLOR[p.kind] }}>
                {i + 1}
              </span>
              <Link href={p.href} className="hover:text-red hover:underline">
                {p.name}
              </Link>
            </li>
          ))}
        </ol>
      ) : null}
      {unplaced.length ? (
        <p className="mt-3 text-[13px] text-driftwood">
          Not on the map yet:{" "}
          {unplaced.map((u, i) => (
            <span key={u.href}>
              {i ? ", " : ""}
              <Link href={u.href} className="underline hover:text-ink">
                {u.name}
              </Link>
            </span>
          ))}
          . Add a map position in the dashboard to place them.
        </p>
      ) : null}
    </div>
  );
}
