"use client";
import { useSyncExternalStore } from "react";

const KEY = "vm-saved-guides";
const listeners = new Set<() => void>();
let cache: string | null = null;

function read(): string {
  try {
    cache = localStorage.getItem(KEY) ?? "[]";
  } catch {
    cache = cache ?? "[]";
  }
  return cache;
}

/** localStorage is user-writable: treat its contents as untrusted and never let them throw. */
function parse(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter((s): s is string => typeof s === "string" && s.length > 0 && s.length <= 120))].slice(0, 500);
  } catch {
    return [];
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

export function useSaved() {
  const raw = useSyncExternalStore(subscribe, read, () => "[]");
  const list = parse(raw);
  const toggle = (slug: string) => {
    const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      cache = JSON.stringify(next);
    }
    listeners.forEach((l) => l());
  };
  return { list, toggle, has: (slug: string) => list.includes(slug) };
}
