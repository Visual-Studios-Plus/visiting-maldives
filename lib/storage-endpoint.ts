/*
 * Reads AWS_ENDPOINT_URL_S3 (Neon Object Storage endpoint) forgivingly: trims spaces and line
 * breaks, strips surrounding quotes (as copied from .env.local), and adds a missing https://.
 * Returns the endpoint without a trailing slash, or null if it is unset or still not a valid URL.
 * Used by next.config.ts, so it must not import anything that only works inside Next.js.
 */
export function storageEndpoint(raw: string | undefined = process.env.AWS_ENDPOINT_URL_S3): string | null {
  let v = (raw ?? "").trim().replace(/^["']+|["']+$/g, "").trim();
  if (!v) return null;
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  try {
    const u = new URL(v);
    if (u.protocol !== "https:" && u.hostname !== "localhost") return null;
    return `${u.origin}${u.pathname.replace(/\/+$/, "")}`;
  } catch {
    return null;
  }
}
