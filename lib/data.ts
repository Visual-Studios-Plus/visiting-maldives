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
};

export type Review = { author: string; from: string; date: string; rating: number; text: string };
export type Stay = {
  slug: string; name: string; type: "Resort" | "Guesthouse" | "Liveaboard"; atoll: string; price: string; note: string; image: string; partner?: boolean;
  /** Our editorial score out of 5 */
  rating: number;
  about: string;
  amenities: string[];
  facts: { label: string; value: string }[];
  /** PLACEHOLDER sample reviews: replace with real, verified guest reviews before launch */
  reviews: Review[];
  gallery?: GalleryPhoto[];
};

export type Eat = { name: string; kind: string; area: string; price: string; dish: string; image: string };

export type Event = { month: string; title: string; text: string; where: string };

export type Essential = { label: string; big: string; text: string; href?: string };

export const navItems = [
  { href: "/things-to-do", label: "Explore" },
  { href: "/atolls", label: "Atolls" },
  { href: "/stay", label: "Stay" },
  { href: "/eat-drink", label: "Eat & drink" },
  { href: "/whats-on", label: "What's on" },
];

