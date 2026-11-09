export const MAX_WAIT = 12000; // never keep people on the loader longer than this, even on a slow network

/**
 * Resolves when the page's assets are in: every image (including ones further down that would
 * normally lazy-load on scroll), the web fonts and the window load event. Capped at MAX_WAIT so a
 * single slow or broken image can never trap people on the loading screen.
 */
export function assetsReady(maxWait = MAX_WAIT) {
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
  // start the lazy ones now, so scrolling never meets an empty photo
  imgs.forEach((img) => {
    if (img.loading === "lazy") img.loading = "eager";
  });
  const each = imgs.map((img) =>
    img.complete
      ? Promise.resolve()
      : new Promise<void>((done) => {
          img.addEventListener("load", () => done(), { once: true });
          img.addEventListener("error", () => done(), { once: true }); // a broken image still counts as settled
        }),
  );
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

