export const MAX_WAIT = 2500; // never keep people on the loader longer than this, even on a slow network

/**
 * Resolves when what people see first is in: the images on the first screen, the web fonts and
 * the window load event. Images further down keep their normal lazy loading (so a phone doesn't
 * download every photo on the page before showing anything). Capped at MAX_WAIT so a slow or
 * broken image can never trap people on the loading screen.
 */
export function assetsReady(maxWait = MAX_WAIT) {
  const fold = window.innerHeight * 1.1;
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("img")).filter((img) => {
    const r = img.getBoundingClientRect();
    return r.width > 0 && r.top < fold && r.bottom > 0;
  });
  const each = imgs.map((img) =>
    img.complete
      ? Promise.resolve()
      : new Promise<void>((done) => {
          // load/error events, not decode(): decode() waits for a rendered frame and can hang
          img.addEventListener("load", () => done(), { once: true });
          img.addEventListener("error", () => done(), { once: true }); // a broken image still counts as settled
        }),
  );
  const fonts = document.fonts?.ready.then(() => undefined) ?? Promise.resolve();
  return Promise.race([
    Promise.all([...each, fonts]).then(() => undefined),
    new Promise<void>((done) => window.setTimeout(done, maxWait)),
  ]);
}
