"use client";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useSaved } from "@/lib/saved";
import { track } from "@/lib/track";

export default function SaveButton({ slug, className = "" }: { slug: string; className?: string }) {
  const { has, toggle } = useSaved();
  const ref = useRef<HTMLButtonElement>(null);
  const saved = has(slug);
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved guides" : "Save guide"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
        track("guide", slug, saved ? "unsave" : "save"); // counted for the dashboard; nothing personal sent
        gsap.fromTo(ref.current, { scale: 0.75 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
      }}
      className={`grid size-11 place-items-center rounded-control bg-white/90 text-ink transition-colors hover:bg-white ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill={saved ? "#D21034" : "none"} stroke={saved ? "#D21034" : "currentColor"} strokeWidth="2">
        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
