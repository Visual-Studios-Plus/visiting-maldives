/** Star rating out of 5 with partial fill (e.g. 4.5 shows four and a half stars). */
const STAR = "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z";

export default function Stars({ value, size = 16, className = "" }: { value: number; size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} role="img" aria-label={`Rated ${value} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i)) * 100;
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <svg viewBox="0 0 24 24" width={size} height={size} className="absolute inset-0 text-black/15" aria-hidden>
              <path fill="currentColor" d={STAR} />
            </svg>
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
              <svg viewBox="0 0 24 24" width={size} height={size} className="text-[#f5a623]" aria-hidden>
                <path fill="currentColor" d={STAR} />
              </svg>
            </span>
          </span>
        );
      })}
    </span>
  );
}
