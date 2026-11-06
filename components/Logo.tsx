// Atoll mark: only the white parts of the icon (reef ring + island) — guide p.16.
// White over photos, red on the white navbar.
export function Mark({ className = "size-9", tone = "red" }: { className?: string; tone?: "red" | "white" }) {
  const fg = tone === "red" ? "#D21034" : "#FFFFFF";
  return (
    <svg viewBox="8 8 32 32" className={`transition-colors ${className}`} aria-hidden="true">
      <circle cx="24" cy="24" r="12.5" fill="none" stroke={fg} strokeWidth="5.5" strokeLinecap="round" strokeDasharray="62 16.54" transform="rotate(-7 24 24)" />
      <circle cx="27.4" cy="20.6" r="3" fill={fg} />
    </svg>
  );
}

export function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark className="size-8 shrink-0" tone={light ? "white" : "red"} />
      <span className={`leading-[1.05] transition-colors ${light ? "text-white" : "text-ink"}`}>
        <span className="block text-[13px] font-bold tracking-[0.22em]">VISITING</span>
        <span className="block text-[13px] font-normal tracking-[0.38em]">MALDIVES</span>
      </span>
    </span>
  );
}
