import { P, type Eat, type Salon, type Stay } from "../../lib/data.ts";

/*
 * SAMPLE listings on real local islands, so island and atoll pages show what the carousels look
 * like. Names are generic descriptions, not real businesses; there are no ratings or reviews.
 * REPLACE with real, checked businesses (or delete) in the dashboard before launch.
 */

type Where = { island: string; atoll: string; atollSlug: string; transfer: string };

const KAAFU = { atoll: "Malé & Kaafu", atollSlug: "male", transfer: "Speedboat or public ferry from Malé" };
const where = {
  maafushi: { island: "Maafushi", ...KAAFU },
  thulusdhoo: { island: "Thulusdhoo", ...KAAFU },
  dhiffushi: { island: "Dhiffushi", ...KAAFU },
  guraidhoo: { island: "Guraidhoo", ...KAAFU },
  hulhumale: { island: "Hulhumalé", ...KAAFU, transfer: "Taxi or bus from the airport" },
  male: { island: "Malé", ...KAAFU, transfer: "Ferry or bridge from the airport" },
  dharavandhoo: { island: "Dharavandhoo", atoll: "Baa Atoll", atollSlug: "baa", transfer: "Domestic flight to Dharavandhoo" },
  rasdhoo: { island: "Rasdhoo", atoll: "Alif Alif Atoll", atollSlug: "alif-alif", transfer: "Speedboat or public ferry" },
  ukulhas: { island: "Ukulhas", atoll: "Alif Alif Atoll", atollSlug: "alif-alif", transfer: "Speedboat from Malé" },
  thoddoo: { island: "Thoddoo", atoll: "Alif Alif Atoll", atollSlug: "alif-alif", transfer: "Speedboat from Malé" },
  dhigurah: { island: "Dhigurah", atoll: "Alif Dhaal Atoll", atollSlug: "alif-dhaal", transfer: "Speedboat from Malé" },
  fulidhoo: { island: "Fulidhoo", atoll: "Vaavu Atoll", atollSlug: "vaavu", transfer: "Speedboat or public ferry" },
  dhidhdhoo: { island: "Dhidhdhoo", atoll: "Haa Alif Atoll", atollSlug: "haa-alif", transfer: "Flight to Hanimaadhoo + boat" },
  utheemu: { island: "Utheemu", atoll: "Haa Alif Atoll", atollSlug: "haa-alif", transfer: "Flight to Hanimaadhoo + boat" },
  hanimaadhoo: { island: "Hanimaadhoo", atoll: "Haa Dhaalu Atoll", atollSlug: "haa-dhaalu", transfer: "Flight to Hanimaadhoo" },
  gan: { island: "Gan", atoll: "Laamu Atoll", atollSlug: "laamu", transfer: "Flight to Kadhdhoo + road" },
  fuvahmulah: { island: "Fuvahmulah", atoll: "Fuvahmulah", atollSlug: "fuvahmulah", transfer: "Flight to Fuvahmulah" },
  hithadhoo: { island: "Hithadhoo", atoll: "Addu City", atollSlug: "addu", transfer: "Flight to Gan" },
} satisfies Record<string, Where>;

const slug = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const stay = (w: Where, kind: "Guesthouse" | "Hotel", name: string, price: string, about: string, image: string, extra: string[] = []): Stay => ({
  slug: `${slug(name)}-${slug(w.island)}`,
  name: `${w.island} ${name}`,
  type: kind,
  atoll: w.atoll,
  atollSlug: w.atollSlug,
  island: w.island,
  price,
  note: `${kind} on ${w.island}, ${w.atoll}.`,
  about,
  image,
  gallery: [],
  amenities: ["Air conditioning", "Wi-Fi", ...extra],
  facts: [
    { label: "Island", value: w.island },
    { label: "Transfer", value: w.transfer },
  ],
  reviews: [],
});

export const sampleStays: Stay[] = [
  stay(where.maafushi, "Guesthouse", "beach guesthouse", "From USD 70", "A family-run guesthouse a short walk from the bikini beach, with Maldivian breakfast and snorkel trips.", P.villaRoom, ["Breakfast included", "Snorkel trips"]),
  stay(where.maafushi, "Hotel", "city hotel", "From USD 95", "A small hotel by the harbour, handy for ferries and excursions.", P.sunDeck, ["Roof terrace"]),
  stay(where.thulusdhoo, "Guesthouse", "surf guesthouse", "From USD 90", "Rooms a short walk from the surf break, with boat trips to the waves.", P.wave, ["Surf trips", "Board storage"]),
  stay(where.dhiffushi, "Guesthouse", "island guesthouse", "From USD 75", "A quiet guesthouse with a garden, near the long sandbank beach.", P.beach, ["Breakfast included"]),
  stay(where.guraidhoo, "Guesthouse", "lagoon guesthouse", "From USD 70", "A simple guesthouse near the lagoon, with sandbank and snorkel trips.", P.shallows, ["Snorkel trips"]),
  stay(where.hulhumale, "Hotel", "beach hotel", "From USD 110", "A beachfront hotel close to the airport, good for a first or last night.", P.resortPool, ["Airport transfer"]),
  stay(where.dharavandhoo, "Guesthouse", "manta guesthouse", "From USD 85", "A guesthouse close to Hanifaru Bay, with manta trips in season.", P.villas, ["Manta trips (Jun–Nov)"]),
  stay(where.rasdhoo, "Guesthouse", "dive guesthouse", "From USD 80", "A guesthouse with a dive centre next door and reef trips most days.", P.diver, ["Dive centre nearby"]),
  stay(where.ukulhas, "Guesthouse", "beach guesthouse", "From USD 85", "Near Ukulhas's long bikini beach, with snorkel and sandbank trips.", P.sandbank, ["Snorkel trips"]),
  stay(where.thoddoo, "Guesthouse", "garden guesthouse", "From USD 75", "A guesthouse on a farming island known for its watermelons and papayas.", P.lagoonPath, ["Breakfast included"]),
  stay(where.dhigurah, "Guesthouse", "whale shark guesthouse", "From USD 90", "A guesthouse on South Ari's reef, with whale shark trips.", P.coral, ["Whale shark trips"]),
  stay(where.fulidhoo, "Guesthouse", "harbour guesthouse", "From USD 75", "A small guesthouse on a tiny island, with night snorkel trips.", P.jetty, ["Snorkel trips"]),
  stay(where.dhidhdhoo, "Guesthouse", "capital guesthouse", "From USD 65", "A simple guesthouse in the atoll capital, close to shops and the harbour.", P.dhoni),
  stay(where.utheemu, "Guesthouse", "heritage guesthouse", "From USD 65", "A guesthouse a short walk from Utheemu Ganduvaru, the national hero's palace.", P.aerial),
  stay(where.hanimaadhoo, "Guesthouse", "airport guesthouse", "From USD 70", "A guesthouse near Hanimaadhoo's airport, handy for boats onward to Haa Alif.", P.jetty),
  stay(where.gan, "Guesthouse", "island guesthouse", "From USD 70", "A guesthouse on Gan, one of the larger islands on Laamu's eastern rim.", P.beach),
  stay(where.fuvahmulah, "Guesthouse", "dive guesthouse", "From USD 90", "A guesthouse for divers, close to the harbour where tiger sharks gather.", P.reef, ["Dive trips"]),
  stay(where.hithadhoo, "Hotel", "city hotel", "From USD 90", "A hotel in Addu's main town, with bikes for the causeway.", P.atollFromAbove, ["Bike hire"]),
];

const eat = (w: Where, name: string, kind: string, price: string, dish: string, about: string, image: string): Eat => ({
  slug: `${slug(name)}-${slug(w.island)}`,
  name: `${w.island} ${name}`,
  kind,
  area: `${w.island}, ${w.atoll}`,
  price,
  dish,
  about,
  image,
});

export const sampleEats: Eat[] = [
  eat(where.maafushi, "harbour café", "Local café", "MVR 60", "Mas huni and roshi", "Tea and short eats by the harbour, busiest at breakfast.", P.teaAndShortEats),
  eat(where.maafushi, "beach grill", "Seafood", "MVR 250", "Grilled reef fish", "The day's catch grilled on the beach in the evening.", P.grilledFish),
  eat(where.thulusdhoo, "surf café", "Café", "MVR 120", "Fresh juice and wraps", "Juices and light meals between surf sessions.", P.coconut),
  eat(where.dhiffushi, "island hotaa", "Local café", "MVR 50", "Hedhikaa (short eats)", "A local teashop with short eats all afternoon.", P.shortEats),
  eat(where.guraidhoo, "lagoon restaurant", "Seafood", "MVR 200", "Fish curry", "Maldivian curries and fresh fish by the lagoon.", P.fishCurry),
  eat(where.hulhumale, "beachfront café", "Casual", "MVR 150", "Tuna sandwich", "Casual meals on the beachfront promenade.", P.restaurant),
  eat(where.dharavandhoo, "island kitchen", "Local café", "MVR 70", "Garudhiya", "Home-style Maldivian food: fish broth, rice and lime.", P.fishCurryVeg),
  eat(where.rasdhoo, "harbour grill", "Seafood", "MVR 220", "Grilled tuna", "Grilled fish near the harbour after a day's diving.", P.grilledFish),
  eat(where.ukulhas, "beach café", "Café", "MVR 120", "Coconut and lime juice", "Juices and light meals near the bikini beach.", P.coconut),
  eat(where.thoddoo, "farm café", "Café", "MVR 80", "Fresh watermelon", "Fruit from the island's farms, fresh and simple.", P.floatingBreakfast),
  eat(where.dhigurah, "island kitchen", "Local café", "MVR 70", "Mas riha (fish curry)", "Maldivian curries for whale shark trip days.", P.fishCurry),
  eat(where.fulidhoo, "jetty café", "Local café", "MVR 60", "Sai and short eats", "Tea and short eats by the jetty.", P.teaAndShortEats),
  eat(where.dhidhdhoo, "harbour hotaa", "Local café", "MVR 50", "Mas huni and roshi", "A teashop in the atoll capital, open from early morning.", P.flatbread),
  eat(where.hanimaadhoo, "airport café", "Café", "MVR 90", "Fish curry and rice", "Quick meals near the airport.", P.fishCurryVeg),
  eat(where.fuvahmulah, "harbour grill", "Seafood", "MVR 200", "Grilled reef fish", "Fresh fish near the harbour.", P.fishMarket),
  eat(where.hithadhoo, "town restaurant", "Casual", "MVR 150", "Tuna curry", "Maldivian and Asian dishes in Addu's main town.", P.restaurantNight),
  eat(where.male, "fish market café", "Seafood", "MVR 180", "Tuna steak", "Near the fish market, with the morning's catch.", P.tunaCatch),
];

const salon = (w: Where, name: string, kind: string, about: string, image: string, services: string[] = []): Salon => ({
  slug: `${slug(name)}-${slug(w.island)}`,
  name: `${w.island} ${name}`,
  services,
  address: `${w.island}, ${w.atoll}`,
  kind,
  area: "",
  atoll: w.atoll,
  atollSlug: w.atollSlug,
  island: w.island,
  about,
  image,
});

export const sampleSalons: Salon[] = [
  salon(where.maafushi, "island spa", "Spa", "Coconut-oil massages and body scrubs.", P.villaRoom, ["Massage", "Body scrub"]),
  salon(where.hulhumale, "hair salon", "Hair salon", "Cuts, colour and braiding.", P.sunDeck, ["Haircut", "Colour", "Braiding"]),
  salon(where.male, "barber", "Barber", "Quick cuts and shaves near the harbour.", P.maleSea, ["Haircut", "Shave"]),
  salon(where.rasdhoo, "beach spa", "Spa", "Massages after a day's diving.", P.shallows, ["Massage"]),
  salon(where.ukulhas, "island spa", "Spa", "Massages and treatments near the beach.", P.beach),
  salon(where.hithadhoo, "beauty salon", "Beauty salon", "Hair, nails and henna.", P.resortPool, ["Hair", "Nails", "Henna"]),
  salon(where.fuvahmulah, "island spa", "Spa", "Massages and scrubs.", P.lagoonPath),
  salon(where.dhidhdhoo, "hair salon", "Hair salon", "Cuts and styling in the atoll capital.", P.dhoni),
];
