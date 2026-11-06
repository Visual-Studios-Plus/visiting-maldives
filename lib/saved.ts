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
  const list: string[] = JSON.parse(raw);
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
