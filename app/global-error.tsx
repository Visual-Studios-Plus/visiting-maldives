"use client";

/**
 * Last resort when even the root layout fails: a plain page with a retry, instead of a blank one.
 * It replaces the root layout, so it brings its own <html>, <body> and styles.
 */
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en-GB">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "system-ui, sans-serif", background: "#fff", color: "#14171a" }}>
        <div role="alert" style={{ maxWidth: 420, padding: 24, textAlign: "center" }}>
          <p style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Something went wrong</p>
          <p style={{ marginTop: 8, color: "#5f6b73" }}>The page couldn&rsquo;t load. Please try again in a few seconds.</p>
          <button
            type="button"
            onClick={() => retry()}
            style={{ marginTop: 20, padding: "10px 20px", border: 0, borderRadius: 8, background: "#d21034", color: "#fff", fontWeight: 600, cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
