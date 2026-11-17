import Link from "next/link";

/** One call-to-action button; draws nothing without a label and a link. */
export default function ButtonBlock({ label, link, className = "" }: { label?: string; link?: string; className?: string }) {
  if (!label || !link) return null;
  return (
    <div className={className}>
      <Link href={link} className="inline-flex min-h-11 items-center gap-2 rounded-control bg-ink px-5 font-semibold text-white hover:bg-red">
        {label} <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
