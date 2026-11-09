import { storageEndpoint } from "../storage-endpoint.ts";
import type { CollectionDef, Field, ScalarField } from "./schema";

/*
 * Server-side cleaning and validation of one dashboard entry against its collection's fields.
 * Only fields the schema knows about are kept, values are coerced to the right type, and any
 * problems come back keyed by field (e.g. "body.2.heading") so the form can show them inline.
 */

export type Errors = Record<string, string>;
type Item = Record<string, unknown>;

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Photos: an Unsplash photo ID, or a file in /public. Nothing else, so an entry can never point
// the site at another host (e.g. "//evil.example/x.jpg").
const UNSPLASH_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{5,80}$/;
const LOCAL_FILE = /^\/(?!\/)[A-Za-z0-9._\-/]+\.(?:jpe?g|png|webp|avif|gif|svg)$/i;
// Links: a page on this site, or an https address. Blocks javascript:, data: and the like.
const SITE_PATH = /^\/(?!\/)[A-Za-z0-9._~\-/?#=&%]*$/;
const MAX_TEXT = 5000;

/** Photos uploaded to this site's Neon bucket: https://<storage host>/site-photos/<key> only. */
function isOwnUpload(s: string): boolean {
  const endpoint = storageEndpoint();
  if (!endpoint) return false;
  const prefix = `${endpoint}/site-photos/`;
  return s.startsWith(prefix) && /^[A-Za-z0-9/_.-]+$/.test(s.slice(prefix.length)) && !s.includes("..");
}

function isSafeLink(s: string): boolean {
  if (SITE_PATH.test(s)) return true;
  try {
    return new URL(s).protocol === "https:";
  } catch {
    return false;
  }
}

function cleanScalar(f: ScalarField, raw: unknown, path: string, errors: Errors): unknown {
  switch (f.type) {
    case "checkbox":
      return raw === true || raw === "true" || raw === "on";
    case "number": {
      const empty = raw === "" || raw === null || raw === undefined;
      if (empty) {
        if (f.required) errors[path] = `${f.label} is required.`;
        return undefined;
      }
      const n = Number(raw);
      if (!Number.isFinite(n)) errors[path] = `${f.label} must be a number.`;
      else if (f.min !== undefined && n < f.min) errors[path] = `${f.label} must be at least ${f.min}.`;
      else if (f.max !== undefined && n > f.max) errors[path] = `${f.label} must be at most ${f.max}.`;
      return n;
    }
    case "tags": {
      const list = Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split(",") : [];
      return list.map((t) => String(t).trim()).filter(Boolean).slice(0, 30);
    }
    default: {
      const s = typeof raw === "string" ? raw.trim() : raw == null ? "" : String(raw).trim();
      if (!s) {
        if (f.required) errors[path] = `${f.label} is required.`;
        return f.required ? s : undefined;
      }
      if (s.length > MAX_TEXT) errors[path] = `${f.label} is too long (max ${MAX_TEXT} characters).`;
      if (f.type === "select" && !f.options.includes(s)) errors[path] = `Choose one of: ${f.options.join(", ")}.`;
      if (f.type === "image" && !(UNSPLASH_ID.test(s) || (LOCAL_FILE.test(s) && !s.includes("..")) || isOwnUpload(s))) errors[path] = "Upload a photo, or use an Unsplash photo ID or a path to an image in /public such as /photos/name.jpg.";
      if (f.type === "link" && !isSafeLink(s)) errors[path] = "Use a page on this site (starting with /) or a full https:// address.";
      return s;
    }
  }
}

function cleanField(f: Field, raw: unknown, path: string, errors: Errors): unknown {
  if (f.type !== "group") return cleanScalar(f, raw, path, errors);
  const rows = Array.isArray(raw) ? raw : [];
  return rows.slice(0, 100).map((row, i) => {
    const out: Item = {};
    for (const sub of f.fields) {
      const v = cleanScalar(sub, (row as Item | null)?.[sub.name], `${path}.${i}.${sub.name}`, errors);
      if (v !== undefined) out[sub.name] = v;
    }
    return out;
  });
}

/**
 * Cleans `input` against `def`. `others` are the collection's other entries, used to keep the
 * page address unique.
 */
export function validateItem(def: CollectionDef, input: unknown, others: Item[]): { item: Item; errors: Errors } {
  const errors: Errors = {};
  const src = (input && typeof input === "object" ? input : {}) as Item;
  const item: Item = {};
  for (const f of def.fields) {
    const v = cleanField(f, src[f.name], f.name, errors);
    if (v !== undefined) item[f.name] = v;
  }
  if (def.slugField) {
    const slug = String(item[def.slugField] ?? "");
    if (slug && !SLUG.test(slug)) errors[def.slugField] = "Use lower-case letters, numbers and single hyphens only.";
    else if (slug && others.some((o) => o[def.slugField!] === slug)) errors[def.slugField] = "Another entry already uses this page address.";
  }
  return { item, errors };
}

/** A blank entry with sensible defaults, for "Add new". */
export function emptyItem(def: CollectionDef): Item {
  const item: Item = {};
  for (const f of def.fields) {
    if (f.type === "group" || f.type === "tags") item[f.name] = [];
    else if (f.type === "checkbox") item[f.name] = false;
    else if (f.type === "select") item[f.name] = f.options[0];
    else if (f.type === "number") item[f.name] = f.min ?? 0;
    else item[f.name] = "";
  }
  return item;
}
