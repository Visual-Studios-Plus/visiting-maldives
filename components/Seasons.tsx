const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// Dec–Apr dry (best), May & Nov shoulder, Jun–Oct wet
const level = [3, 3, 3, 3, 2, 1, 1, 1, 1, 1, 2, 3];

export default function Seasons({ dark = false }: { dark?: boolean }) {
  return (
    <div>
      <div className="flex h-24 items-end gap-1.5">
        {level.map((l, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <div
              data-season-bar
              className={`w-full origin-bottom rounded-[3px] ${l === 3 ? "bg-red" : l === 2 ? "bg-red/45" : dark ? "bg-white/20" : "bg-driftwood/20"}`}
              style={{ height: `${l * 26}px` }}
            />
            <span className={`font-mono text-[10px] sm:text-[11px] ${dark ? "text-white/60" : "text-driftwood"}`}>{months[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
