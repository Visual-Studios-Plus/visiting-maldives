/** The Visiting Maldives ring mark, in brand red. */
export default function BrandMark({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="8 8 32 32" className={className} aria-hidden>
      <circle cx="24" cy="24" r="12.5" fill="none" stroke="var(--color-red)" strokeWidth="5.5" strokeLinecap="round" strokeDasharray="62 16.54" transform="rotate(-7 24 24)" />
      <circle cx="27.4" cy="20.6" r="3" fill="var(--color-red)" />
    </svg>
  );
}
