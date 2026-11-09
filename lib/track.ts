/** Sends one metric to /api/metrics from the browser. Fire-and-forget; never throws. */
export function track(type: "guide" | "stay" | "atoll", slug: string, event: "view" | "save" | "unsave") {
  try {
    const body = JSON.stringify({ type, slug, event });
    if (navigator.sendBeacon?.("/api/metrics", new Blob([body], { type: "application/json" }))) return;
    fetch("/api/metrics", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
  } catch {
    // metrics must never break the page
  }
}
