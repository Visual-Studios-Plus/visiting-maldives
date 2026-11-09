import "server-only";
import { randomUUID } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

/*
 * Photo uploads to Neon Object Storage (bucket "site-photos", public read; declared in neon.ts).
 * Credentials, endpoint and region come from the AWS_* variables Neon pulls into .env.local
 * (and that must be set in Vercel for the live site). Writes happen only here, on the server.
 * Each upload gets a new key, so files can be cached forever and never go stale.
 */

export const PHOTO_BUCKET = "site-photos";
export const MAX_PHOTO_BYTES = 4 * 1024 * 1024; // after in-browser resizing; stays under Vercel's request limit

const endpoint = process.env.AWS_ENDPOINT_URL_S3?.replace(/\/+$/, "");
const s3 = endpoint && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? new S3Client({ forcePathStyle: true }) : null;

export const storageReady = () => Boolean(s3);

/** Public URL prefix for uploaded photos, e.g. https://…neon.tech/site-photos/ */
export const photoUrlPrefix = () => (endpoint ? `${endpoint}/${PHOTO_BUCKET}/` : null);

/** Identifies the image type from the file's first bytes (never trusts the name or the browser's type). */
function sniff(bytes: Uint8Array): { ext: string; type: string } | null {
  const b = (i: number) => bytes[i];
  if (b(0) === 0xff && b(1) === 0xd8 && b(2) === 0xff) return { ext: "jpg", type: "image/jpeg" };
  if (b(0) === 0x89 && b(1) === 0x50 && b(2) === 0x4e && b(3) === 0x47) return { ext: "png", type: "image/png" };
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return { ext: "webp", type: "image/webp" };
  if (ascii(4, 8) === "ftyp" && /avif|avis/.test(ascii(8, 12))) return { ext: "avif", type: "image/avif" };
  return null; // SVG and everything else are refused: SVG can carry scripts
}

/** Checks and stores one photo. Returns its public URL. Throws a readable message on failure. */
export async function storePhoto(file: File, folder: string): Promise<string> {
  if (!s3 || !endpoint) throw new Error("Photo storage isn't connected. Add the Neon Object Storage variables (AWS_*) and redeploy.");
  if (file.size === 0) throw new Error("That file is empty.");
  if (file.size > MAX_PHOTO_BYTES) throw new Error("That photo is too large. Try a smaller one (under 4 MB after resizing).");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = sniff(bytes);
  if (!kind) throw new Error("Only JPEG, PNG, WebP or AVIF photos can be uploaded.");

  const safeFolder = folder.replace(/[^a-z0-9-]/g, "") || "misc";
  const key = `${safeFolder}/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${kind.ext}`;
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: PHOTO_BUCKET,
        Key: key,
        Body: bytes,
        ContentType: kind.type,
        CacheControl: "public, max-age=31536000, immutable", // new key per upload, so safe to cache forever
      }),
    );
  } catch (err) {
    console.error("[storage] upload failed", err); // details stay in the server log, not the browser
    throw new Error("Upload failed. Please try again in a moment.");
  }
  return `${endpoint}/${PHOTO_BUCKET}/${key}`;
}
