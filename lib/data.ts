// Content for visitingmaldives.com. Facts follow the brand guide's content audit (p.07):
// figures marked "verify" there must be confirmed with official sources before launch.

export const CHECKED = "Checked 3 Nov 2026";

// Local photos (real Maldivian places, Wikimedia Commons, see /credits) start with "/".
// Photos uploaded in the dashboard are full https URLs (Neon Object Storage) and pass through.
export const photo = (id: string, w = 1600) =>
  id.startsWith("/") || id.startsWith("https://") ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

/** One photo in a gallery (guides, atolls, places to stay). */
export type GalleryPhoto = { src: string; alt: string; caption?: string };

export const P = {
  aerial: "1514282401047-d79a71a590e8",
  sunsetVillas: "1573843981267-be1999ff37cd",
  lagoonPath: "1540202404-a2f29016b523",
  seaplane: "1512100356356-de1b84283e18",
  villaDeck: "1544550581-5f7ceaf7f992",
  villas: "1590523277543-a94d2e4eb00b",
  villaRoom: "1602002418082-a4443e081dd1",
  sandbank: "1578922746465-3a80a228f223",
  jetty: "1505881502353-a1986add3762",
  diver: "1544551763-46a013bb70d5",
  resortPool: "1571896349842-33c89424de2d",
  sunDeck: "1582719508461-905c673771fd",
  restaurant: "1544148103-0773bf10d330",
  coral: "1546026423-cc4642628d2b",
  reef: "1583212292454-1fe6229603b7",
  beach: "1520942702018-0862200e6873",
  wave: "1559827260-dc66d52bef19",
  shallows: "1504681869696-d977211a5f4c",
  maleAerial: "/photos/male-aerial.jpg",
  maleSea: "/photos/male-street.jpg",
  hukuru: "/photos/hukuru-miskiy.jpg",
  sultanPark: "/photos/sultan-park.jpg",
  felidhoo: "/photos/felidhoo.jpg",
  baaAerial: "/photos/baa-islands.jpg",
  addu: "/photos/addu.jpg",
  dhoni: "/photos/dhoni.jpg",
  dhoniHuvahenhoo: "/photos/dhoni-huvahenhoo.jpg",
  atollFromAbove: "/photos/atoll-from-above.jpg",
  sandbankDrone: "/photos/sandbank-drone.jpg",
  sandbankSunset: "/photos/sandbank-sunset.jpg", // Unsplash 1639994281271
  birdsEye: "1564966866111-cde2c82da4ed", // Unsplash: a sandbank from straight above, one person on it
  // Food (Unsplash, checked by eye)
  fishCurry: "1761314036779-84078bec535c", // fish curry in a pot, rice and lime beside it
  fishCurryVeg: "1761314036698-a7a6e8514905", // fish curry with vegetables and rice
  tunaCatch: "1766998112558-c8632e66cc49", // a pile of fresh-caught tuna
  fishUnloading: "1766998112397-94199ae7eb10", // fishermen unloading fish at a market
  fishMarket: "1746964245994-b1d15d7df515", // fresh reef fish laid out at a market
  samosas: "1601050690597-df0568f70950", // golden fried pastries on a wooden tray
  shortEats: "1772457677641-394bbc0c20f6", // a plate of fried snacks and dates
  teaAndShortEats: "1732519970445-8f2d6998961f", // fried pastries with a glass of milk tea
  flatbread: "1640625314547-aee9a7696589", // a pile of charred flatbread
  grilledFish: "1729951545638-391548c98fb9", // fish grilling over smoke
  coconut: "1761576881090-a3253f7e53dc", // young coconut with a straw, sea behind
  floatingBreakfast: "1586861635167-e5223aadc9fe", // breakfast trays floating in a pool by the sea
  restaurantNight: "1746139414290-d981c8c8cb7d", // people eating in a lit-up restaurant
} as const;

export type Category = "Marine life" | "Heritage" | "Islands" | "Food" | "Adventure";

export type Guide = {
  slug: string;
  title: string;
  short: string;
  summary: string;
  category: Category;
  atoll: string;
  season: string;
  read: number;
  image: string;
  body: { heading: string; text: string }[];
  facts: { label: string; value: string }[];
  gallery?: GalleryPhoto[];
};

export const categories: Category[] = ["Marine life", "Heritage", "Islands", "Food", "Adventure"];

/** A resort island (one island, one resort) in an atoll. */
export type ResortIsland = { island: string; resort: string };

/** An atoll's islands, grouped by how they're used. Names are English (Latin) transliterations. */
export type Islands = {
  inhabited: string[];
  uninhabited: string[];
  /** One island, one resort. */
  resorts: ResortIsland[];
  /** Islands that are part local community, part resort/hotel. */
  halfResort?: ResortIsland[];
  /** Islands leased or planned for resorts, per the government register (resort names not listed) */
  resortIslands?: string[];
};

export type Atoll = {
  slug: string;
  name: string;
  dhivehi: string;
  region: "North" | "Central" | "South";
  tagline: string;
  intro: string;
  bestFor: string[];
  transfer: string;
  image: string;
  gallery?: GalleryPhoto[];
  islands?: Islands;
  /** longer write-up, shown as numbered sections (used by single-island entries) */
  body?: { heading: string; text: string }[];
  /** key facts, shown "at a glance" */
  facts?: { label: string; value: string }[];
  /** set on a single-island entry: the slug of the atoll it belongs to (kept off the atolls list) */
  parent?: string;
};

/** Other names a stay's free-text `atoll` may use for an atoll (besides the atoll's own name). */
const ATOLL_ALIASES: Record<string, string[]> = {
  male: ["kaafu", "male", "north male", "south male"],
  "alif-alif": ["alif alif", "north ari", "rasdhoo"],
  "alif-dhaal": ["alif dhaal", "south ari"],
  fuvahmulah: ["fuvahmulah", "gnaviyani"],
  addu: ["addu", "seenu"],
  faafu: ["faafu", "north nilandhe"],
  dhaalu: ["dhaalu", "south nilandhe"],
};
const plain = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z ]+/g, " ").replace(/\s+/g, " ").trim();

/** Whether a place to stay is in this atoll (exact `atollSlug` when set, else its `atoll` text). */
export const stayInAtoll = (stay: Pick<Stay, "atoll" | "atollSlug">, atoll: Pick<Atoll, "slug" | "name">) => {
  if (stay.atollSlug) return stay.atollSlug === atoll.slug;
  const names = ATOLL_ALIASES[atoll.slug] ?? [plain(atoll.name).replace(/ atoll$/, "")];
  // each comma-separated part must *start* with the name, so "Haa Dhaalu" never counts as "Dhaalu"
  const parts = stay.atoll.split(",").map((p) => `${plain(p)} `);
  return parts.some((p) => names.some((n) => p.startsWith(`${n} `)));
};

/** Commons photos load straight from Wikimedia in the browser: its servers rate-limit our image optimizer. */
export const isCommons = (src: string) => src.includes("wikimedia.org/");

export type Review = { author: string; from: string; date: string; rating: number; text: string };
/** Everything published under /stay: resorts, resort islands, hotels, guesthouses and liveaboards. */
export type StayType = "Resort" | "Resort island" | "Hotel" | "Guesthouse" | "Liveaboard";

export type Stay = {
  slug: string; name: string; type: StayType; atoll: string; price: string; note: string; image: string; partner?: boolean;
  /** the atoll's page address, so an atoll can be picked in the dashboard and matched exactly */
  atollSlug?: string;
  /** the island, for resort entries (one island, one resort) */
  island?: string;
  /** Our editorial score out of 5; unrated entries leave it out */
  rating?: number;
  about: string;
  amenities: string[];
  facts: { label: string; value: string }[];
  /** PLACEHOLDER sample reviews: replace with real, verified guest reviews before launch */
  reviews: Review[];
  gallery?: GalleryPhoto[];
};

export type Eat = {
  /** page address, /eat-drink/<slug> (older entries without one fall back to the name) */
  slug?: string;
  name: string;
  kind: string;
  area: string;
  price: string;
  /** the one dish to order (shown first) */
  dish: string;
  image: string;
  about?: string;
  hours?: string;
  /** "What to order": dishes worth trying here, each with a short reason */
  recommends?: { dish: string; note: string }[];
  /** our score out of 5 */
  rating?: number;
  address?: string;
  /** map position (WGS84) */
  lat?: number;
  lng?: number;
  reviews?: Review[];
};

/** Page address for a place to eat: its slug, or one made from its name for older entries. */
export const eatSlug = (e: Pick<Eat, "slug" | "name">) =>
  e.slug || e.name.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export type DishKind = "Breakfast" | "Mains" | "Short eats" | "Sweets" | "Drinks";
export const DISH_KINDS: DishKind[] = ["Breakfast", "Mains", "Short eats", "Sweets", "Drinks"];

/** A dish to know: shown in "What to eat" on the Eat & drink page. */
export type Dish = {
  name: string;
  /** name in Dhivehi script (optional) */
  local?: string;
  kind: DishKind;
  text: string;
  whereToTry?: string;
  image: string;
  vegetarian?: boolean;
};

export type Event = { month: string; title: string; text: string; where: string };

export type Essential = { label: string; big: string; text: string; href?: string };

export const navItems = [
  { href: "/things-to-do", label: "Explore" },
  { href: "/atolls", label: "Atolls" },
  { href: "/stay", label: "Stay" },
  { href: "/eat-drink", label: "Eat & drink" },
  { href: "/whats-on", label: "What's on" },
];

