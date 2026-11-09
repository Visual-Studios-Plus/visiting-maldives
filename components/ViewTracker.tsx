"use client";
import { useEffect } from "react";
import { track } from "@/lib/track";

/** Counts one view of this page per browser session (no cookies, nothing personal sent). */
export default function ViewTracker({ type, slug }: { type: "guide" | "stay" | "atoll"; slug: string }) {
  useEffect(() => {
    const key = `vm-viewed:${type}:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // storage blocked (private mode): still count, at worst twice
    }
    track(type, slug, "view");
  }, [type, slug]);
  return null;
}
