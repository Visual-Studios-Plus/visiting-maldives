export const MAX_WAIT = 12000; // never keep people on the loader longer than this, even on a slow network

/**
 * Resolves when the page's assets are in: every image (including ones further down that would
 * normally lazy-load on scroll), the web fonts and the window load event. Capped at MAX_WAIT so a
 * single slow or broken image can never trap people on the loading screen.
 */
export function assetsReady(maxWait = MAX_WAIT) {
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
  // Fetch the lazy ones now, so scrolling never meets an empty photo. A detached copy with the
  // same srcset/sizes picks the same file and fills the cache; the page's own <img> is left
  // untouched, because changing its attributes before React hydrates it is a hydration mismatch.
  const each = imgs.map((img) => {
    if (img.complete) return Promise.resolve();
    const probe = new Image();
    if (img.sizes) probe.sizes = img.sizes;
    if (img.srcset) probe.srcset = img.srcset;
    // load/error events, not decode(): decode() waits for a rendered frame and can hang
    return new Promise<void>((done) => {
      probe.onload = () => done();
      probe.onerror = () => done(); // a broken image still counts as settled
      probe.src = img.currentSrc || img.src;
    });
  });
  const page =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((done) => window.addEventListener("load", () => done(), { once: true }));
  const fonts = document.fonts?.ready.then(() => undefined) ?? Promise.resolve();
  return Promise.race([
    Promise.all([...each, page, fonts]).then(() => undefined),
    new Promise<void>((done) => window.setTimeout(done, maxWait)),
  ]);
}

