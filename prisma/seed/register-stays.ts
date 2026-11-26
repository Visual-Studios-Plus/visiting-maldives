import { photo, P, type Atoll, type Stay, type StayType } from "../../lib/data.ts";
import { islandSlug, resortImage } from "../../lib/resorts.ts";
import { REGISTER_PLACES, type RegisterKind, type RegisterPlace } from "./register-stays.data.ts";

/*
 * The Ministry of Tourism register (register-stays.data.ts) as places to stay: every licensed
 * resort, hotel, guesthouse, homestay, yacht marina and liveaboard vessel. Like the other seed
 * stays they become ordinary entries in the `stays` collection, edited in the dashboard.
 *
 * Resorts already listed (one per resort island, from the atoll lists) are matched by island and
 * given the register's details instead of being added twice.
 */

const plain = (s: string) => s.normalize("NFKD").replace(/[^a-z0-9]/gi, "").toLowerCase();

/**
 * Island names match however they are spelled: the island register and the tourism register
 * transliterate Dhivehi differently ("Gaakoshibi" / "Gaakoshibee", "Kandholhudoo" / "Kandholhudhoo").
 */
const loose = (s: string) =>
  plain(s).replace(/ee/g, "i").replace(/oo/g, "u").replace(/h/g, "").replace(/(.)\1+/g, "$1");

/** The islands a register entry names: some resorts span two ("Thilamaafushi and Bodufinolhu"). */
const islandsOf = (island: string) => island.split(/\s+and\s+|\s*[,&/]\s*/i).filter(Boolean);

/** Placeholder cover photos by kind, until real photos are uploaded in the dashboard. */
const PHOTOS: Record<RegisterKind, string[]> = {
  Resort: [],
  Hotel: [P.maleAerial, P.maleSea, P.sunDeck],
  Guesthouse: [P.beach, P.shallows, P.lagoonPath, P.felidhoo, P.dhoni, P.sandbank],
  Homestay: [P.felidhoo, P.beach, P.shallows, P.lagoonPath],
  Marina: [P.jetty, P.wave],
  Liveaboard: [P.dhoni, P.wave, P.diver, P.reef],
};

const KIND_TYPE: Record<RegisterKind, StayType> = {
  Resort: "Resort",
  Hotel: "Hotel",
  Guesthouse: "Guesthouse",
  Homestay: "Homestay",
  Marina: "Marina",
  Liveaboard: "Liveaboard",
};

const NOUN: Record<RegisterKind, string> = {
  Resort: "resort",
  Hotel: "hotel",
  Guesthouse: "guesthouse",
  Homestay: "homestay",
  Marina: "yacht marina",
  Liveaboard: "liveaboard",
};

/** The register's details as facts on the stay page. */
function registerFacts(r: RegisterPlace, atoll?: Atoll): Stay["facts"] {
  const f: Stay["facts"] = [];
  if (atoll && r.kind !== "Liveaboard") f.push({ label: "Transfer", value: atoll.transfer });
  if (r.state === "Not Operating") f.push({ label: "Status", value: "Not operating (government register)" });
  return f;
}

function about(r: RegisterPlace, atoll?: Atoll): string {
  const size = [r.rooms && `${r.rooms} ${r.kind === "Liveaboard" ? "cabins" : "rooms"}`, r.beds && `${r.beds} beds`, r.berths && `${r.berths} yacht berths`]
    .filter(Boolean)
    .join(", ");
  const where = r.kind === "Liveaboard" ? "cruising the atolls" : [r.island && `on ${r.island}`, atoll && `in ${atoll.name}`].filter(Boolean).join(" ");
  return `${r.name} is a ${NOUN[r.kind]} ${where}${size ? `, with ${size}` : ""}. It is licensed by the Ministry of Tourism. Contact it directly for rates and availability.`;
}

/** The register's size and contact details as stay fields (the page shows them in their own sections). */
function registerFields(r: RegisterPlace): Partial<Stay> {
  return {
    licensed: true,
    ...(r.rooms ? { rooms: r.rooms } : {}),
    ...(r.beds ? { beds: r.beds } : {}),
    ...(r.berths ? { berths: r.berths } : {}),
    ...(r.phone ? { phone: r.phone } : {}),
    ...(r.email ? { email: r.email } : {}),
    ...(r.website ? { website: r.website } : {}),
  };
}

/** Every register entry as a stay, plus the register's details merged into resorts already in `existing`. */
export function registerStays(atolls: Atoll[], existing: Stay[]): Stay[] {
  const bySlug = new Map(atolls.filter((a) => !a.parent).map((a) => [a.slug, a]));
  const used = new Set(existing.map((s) => s.slug));
  const merged = existing.map((s) => ({ ...s }));
  const resortByIsland = new Map(
    merged.filter((s) => (s.type === "Resort" || s.type === "Resort island" || s.type === "Hotel") && s.island).map((s) => [`${s.atollSlug}|${loose(s.island!)}`, s]),
  );
  const added: Stay[] = [];
  const count: Record<string, number> = {};

  for (const r of REGISTER_PLACES) {
    const atoll = r.atollSlug ? bySlug.get(r.atollSlug) : undefined;

    // a resort island we already list: name it and add the register's details
    if (r.kind === "Resort") {
      const hit = [...islandsOf(r.island), r.island].map((i) => resortByIsland.get(`${r.atollSlug}|${loose(i)}`)).find(Boolean);
      if (hit) {
        if (hit.type === "Resort island") {
          hit.type = "Resort";
          hit.name = r.name;
          hit.note = `${r.name} on ${hit.island}, ${hit.atoll}.`;
          hit.about = about(r, atoll);
        }
        const have = new Set(hit.facts.map((f) => f.label));
        hit.facts = [...hit.facts, ...registerFacts(r, atoll).filter((f) => !have.has(f.label))];
        // keep anything already filled in, add what the register knows
        Object.assign(hit, { ...registerFields(r), ...Object.fromEntries(Object.entries(hit).filter(([, v]) => v !== undefined && v !== "")) });
        continue;
      }
    }

    const i = (count[r.kind] = (count[r.kind] ?? 0) + 1) - 1;
    const base = islandSlug(r.name) || `${r.kind.toLowerCase()}-${i + 1}`;
    let slug = base;
    for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;
    used.add(slug);
    const pool = PHOTOS[r.kind];

    added.push({
      slug,
      name: r.name,
      type: KIND_TYPE[r.kind],
      atoll: atoll?.name ?? (r.kind === "Liveaboard" ? "Across the Maldives" : ""),
      ...(atoll ? { atollSlug: atoll.slug } : {}),
      ...(r.island ? { island: r.island } : {}),
      price: "Rates on request",
      note: r.kind === "Liveaboard" ? `Liveaboard${r.rooms ? ` with ${r.rooms} cabins` : ""}.` : `${NOUN[r.kind][0].toUpperCase() + NOUN[r.kind].slice(1)}${r.island ? ` on ${r.island}` : ""}${atoll ? `, ${atoll.name}` : ""}.`,
      about: about(r, atoll),
      image: pool.length ? photo(pool[i % pool.length], 1600) : resortImage(i, 1600),
      gallery: [],
      amenities: [],
      facts: registerFacts(r, atoll),
      ...registerFields(r),
      reviews: [],
    });
  }
  return [...merged, ...added];
}
