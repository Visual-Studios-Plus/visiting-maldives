import { P, photo, type Atoll, type Vessel } from "../../lib/data.ts";
import { VESSEL_ROWS } from "./vessels.data.ts";

/*
 * The Ministry of Tourism's licensed liveaboard list (vessels.data.ts) as vessel entries, shown
 * on each atoll's page as cards. A vessel whose operator or owner address names a non-Malé atoll
 * is shown on that atoll; the rest cruise across the Maldives and are shown on every atoll page.
 */

/** Placeholder cover photos until real vessel photos are uploaded in the dashboard. */
const PHOTOS = [P.dhoni, P.wave, P.diver, P.reef, P.sandbank, P.sunsetVillas];

export function vessels(atolls: Atoll[]): Vessel[] {
  const bySlug = new Map(atolls.filter((a) => !a.parent).map((a) => [a.slug, a]));
  return VESSEL_ROWS.map((v, i) => {
    const atoll = v.atollSlug ? bySlug.get(v.atollSlug) : undefined;
    return {
      name: v.name,
      ...(v.registration ? { registration: v.registration } : {}),
      ...(v.licence ? { licence: v.licence } : {}),
      ...(v.cabins ? { cabins: v.cabins } : {}),
      ...(v.beds ? { beds: v.beds } : {}),
      ...(v.phone ? { phone: v.phone } : {}),
      ...(v.fax ? { fax: v.fax } : {}),
      ...(v.email ? { email: v.email } : {}),
      ...(v.operator ? { operator: v.operator } : {}),
      ...(atoll ? { atoll: atoll.name, atollSlug: atoll.slug } : {}),
      image: photo(PHOTOS[i % PHOTOS.length], 1400),
      note: v.note,
      licensed: true,
    };
  });
}
