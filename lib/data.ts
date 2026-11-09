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

export const guides: Guide[] = [
  {
    slug: "manta-season-hanifaru-bay",
    title: "Manta season at Hanifaru Bay",
    short: "Manta season",
    summary: "When and how to see manta rays at Hanifaru Bay.",
    category: "Marine life",
    atoll: "Baa Atoll",
    season: "Jun–Nov",
    read: 6,
    image: P.diver,
    body: [
      { heading: "When to go", text: "Manta season in Baa Atoll runs from June to November, peaking in August. Plankton blooms during the southwest monsoon draw feeding mantas into the bay, sometimes in groups of a hundred or more." },
      { heading: "How to get there", text: "Fly by seaplane from Velana International (MLE) to Baa Atoll in about 35 minutes, or take a domestic flight to Dharavandhoo and a short speedboat ride. Guesthouses on Dharavandhoo run daily snorkel trips in season." },
      { heading: "Rules in the bay", text: "Hanifaru Bay is a protected area. Snorkelling only, no scuba, with a licensed ranger-approved guide. Visits are capped and time-limited, so book a morning slot ahead." },
    ],
    facts: [
      { label: "Best months", value: "Jun–Nov, peak Aug" },
      { label: "Transfer", value: "MLE → Baa · 35 min" },
      { label: "Access", value: "Snorkel only" },
    ],
  },
  {
    slug: "male-on-foot",
    title: "Malé on foot: a heritage walk",
    short: "Malé on foot",
    summary: "A heritage walk past mosques and palaces.",
    category: "Heritage",
    atoll: "Malé",
    season: "All year",
    read: 5,
    image: P.hukuru,
    body: [
      { heading: "Start at the harbour", text: "Begin at the fish market on Boduthakurufaanu Magu in the late afternoon, when the tuna boats come in. Cross to the local market for dried fish, betel and chilli." },
      { heading: "Old Friday Mosque", text: "Hukuru Miskiy dates from 1658 and is built from carved coral stone. Dress modestly. Visitors may need permission to go inside, so ask at the gate." },
      { heading: "Sultan Park and the Republic Square", text: "Finish in the shade of Sultan Park, then walk to the Republic Square as the city lights up. The whole loop is about 3 km." },
    ],
    facts: [
      { label: "Distance", value: "About 3 km" },
      { label: "Time", value: "2–3 hours" },
      { label: "Dress", value: "Shoulders and knees covered" },
    ],
  },
  {
    slug: "local-islands-by-ferry",
    title: "Local islands by public ferry",
    short: "Local islands by ferry",
    summary: "Routes, timetables and where to stay.",
    category: "Islands",
    atoll: "Kaafu",
    season: "All year",
    read: 7,
    image: P.felidhoo,
    body: [
      { heading: "Why go local", text: "Stay on a local island, travel by public ferry and meet the people who live there. Guesthouses on Maafushi, Thulusdhoo and Gulhi cost a fraction of a resort." },
      { heading: "The ferry network", text: "Public ferries leave from Malé's Villingili terminal. Fares are a few dollars, but most routes skip Fridays, so check the current timetable before you plan." },
      { heading: "Local customs", text: "Local islands are Muslim communities. Use the marked bikini beach, cover up in the village and expect no alcohol on the island." },
    ],
    facts: [
      { label: "Fare", value: "From MVR 30" },
      { label: "Departs", value: "Villingili ferry terminal" },
      { label: "Note", value: "Few Friday sailings" },
    ],
  },
  {
    slug: "best-sandbanks",
    title: "The best sandbanks near Malé",
    short: "Best sandbanks",
    summary: "Five sandbanks within an hour of Malé.",
    category: "Islands",
    atoll: "North Malé",
    season: "Dec–Apr",
    read: 4,
    image: P.sandbank,
    body: [
      { heading: "What a sandbank is", text: "A strip of bare coral sand that rises from the lagoon at low tide. No shade, no facilities, just reef on every side." },
      { heading: "Getting there", text: "Half-day trips leave from Maafushi, Thulusdhoo and Hulhumalé by speedboat. Go at low tide in the dry season for the calmest water." },
      { heading: "Bring", text: "Reef-safe sunscreen, a hat, at least a litre of water each, and take everything back with you." },
    ],
    facts: [
      { label: "Best time", value: "Low tide, Dec–Apr" },
      { label: "Trip", value: "Half day" },
      { label: "Shade", value: "None, bring a hat" },
    ],
  },
  {
    slug: "whale-sharks-south-ari",
    title: "Whale sharks in South Ari",
    short: "Whale sharks",
    summary: "Snorkelling with whale sharks off Maamigili, all year.",
    category: "Marine life",
    atoll: "South Ari",
    season: "All year",
    read: 6,
    image: P.reef,
    body: [
      { heading: "A year-round population", text: "Juvenile whale sharks feed along the outer reef of South Ari Atoll all year. Sightings are most reliable between August and November." },
      { heading: "How to watch", text: "Keep 3 m from the shark and 4 m from the tail. No touching, no flash, and no more than ten swimmers in the water at once." },
      { heading: "Getting there", text: "Domestic flight from Velana to Maamigili, about 25 minutes, then a guesthouse or resort boat." },
    ],
    facts: [
      { label: "Best months", value: "Aug–Nov" },
      { label: "Transfer", value: "MLE → VAM · 25 min" },
      { label: "Distance", value: "3 m from the shark" },
    ],
  },
  {
    slug: "mas-huni-breakfast",
    title: "Mas huni: the Maldivian breakfast",
    short: "Mas huni",
    summary: "Tuna, coconut and chilli, and where to eat it in Malé.",
    category: "Food",
    atoll: "Malé",
    season: "All year",
    read: 3,
    image: P.restaurant,
    body: [
      { heading: "What it is", text: "Shredded smoked tuna mixed with grated coconut, onion, lime and chilli, eaten with warm roshi flatbread and sweet black tea." },
      { heading: "Where to try it", text: "Any hotaa (local café) in Malé serves it from early morning. Order at the counter and expect to pay around MVR 60." },
      { heading: "Short eats", text: "In the afternoon, hotaa counters fill with hedhikaa: fried fish cakes, gulha dumplings and bajiya pastries." },
    ],
    facts: [
      { label: "Price", value: "About MVR 60" },
      { label: "When", value: "Breakfast" },
      { label: "Where", value: "Malé hotaa cafés" },
    ],
  },
  {
    slug: "surf-season-thulusdhoo",
    title: "Surf season on Thulusdhoo",
    short: "Surf season",
    summary: "Cokes and Chickens, the North Malé breaks.",
    category: "Adventure",
    atoll: "North Malé",
    season: "Mar–Oct",
    read: 5,
    image: P.wave,
    body: [
      { heading: "The breaks", text: "Cokes is a fast right-hander off Thulusdhoo; Chickens is a long left nearby. Both work best in the southwest swell." },
      { heading: "When", text: "March to October, with the most consistent swell from May to September." },
      { heading: "Where to stay", text: "Surf guesthouses on Thulusdhoo are a 30-minute speedboat from the airport." },
    ],
    facts: [
      { label: "Season", value: "Mar–Oct" },
      { label: "Transfer", value: "Speedboat · 30 min" },
      { label: "Level", value: "Intermediate+" },
    ],
  },
  {
    slug: "seaplane-transfers",
    title: "How seaplane transfers work",
    short: "Seaplane transfers",
    summary: "Daylight only, luggage limits and what to book.",
    category: "Adventure",
    atoll: "Velana",
    season: "All year",
    read: 4,
    image: P.seaplane,
    body: [
      { heading: "Daylight only", text: "Seaplanes only fly in daylight. Landing after dark? Book a night in Hulhumalé first." },
      { heading: "Luggage", text: "Most operators allow 20 kg checked and 5 kg hand luggage per person, with excess charged by the kilo." },
      { heading: "Booking", text: "Your resort books the seaplane. Send them your flight number as soon as you have it." },
    ],
    facts: [
      { label: "Hours", value: "Daylight only" },
      { label: "Luggage", value: "20 kg + 5 kg" },
      { label: "Booked by", value: "Your resort" },
    ],
  },
];

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

export const atolls: Atoll[] = [
  { slug: "male", name: "Malé & Kaafu", dhivehi: "މާލެ", region: "Central", tagline: "The capital and its lagoons", intro: "Kaafu wraps around Malé and the airport. Local islands, surf breaks and sandbanks are all under an hour away.", bestFor: ["First visits", "Local islands", "Surf"], transfer: "Speedboat · 15–60 min", image: P.maleAerial },
  { slug: "baa", name: "Baa Atoll", dhivehi: "ބ", region: "North", tagline: "A UNESCO biosphere reserve", intro: "Home to Hanifaru Bay and its manta aggregations. The whole atoll is a UNESCO Biosphere Reserve.", bestFor: ["Mantas", "Snorkelling", "Couples"], transfer: "Seaplane · 35 min", image: P.baaAerial },
  { slug: "ari", name: "Ari Atoll", dhivehi: "އަރި", region: "Central", tagline: "Whale sharks, all year", intro: "North and South Ari hold some of the best diving in the country, with whale sharks along the southern reef.", bestFor: ["Diving", "Whale sharks", "Resorts"], transfer: "Seaplane · 25 min", image: P.reef },
  { slug: "raa", name: "Raa Atoll", dhivehi: "ރ", region: "North", tagline: "Quiet reefs, few boats", intro: "Long, lightly visited reefs and new resorts, with the shipbuilding island of Alifushi.", bestFor: ["Quiet stays", "Reefs"], transfer: "Seaplane · 45 min", image: P.villas },
  { slug: "vaavu", name: "Vaavu Atoll", dhivehi: "ވ", region: "Central", tagline: "Shark channels and night dives", intro: "A small atoll with famous channel dives and nurse sharks at Alimatha.", bestFor: ["Diving", "Local islands"], transfer: "Speedboat · 75 min", image: P.dhoniHuvahenhoo },
  { slug: "addu", name: "Addu City", dhivehi: "އައްޑޫ", region: "South", tagline: "South of the equator", intro: "The southernmost atoll, linked by causeway, with cycling, wetlands and green turtles.", bestFor: ["Cycling", "Turtles", "History"], transfer: "Flight · 70 min", image: P.addu },
];

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

const R = (author: string, from: string, date: string, rating: number, text: string): Review => ({ author, from, date, rating, text });

export const stays: Stay[] = [
  {
    slug: "overwater-villas-baa", name: "Overwater villas", type: "Resort", atoll: "Baa Atoll", price: "From USD 900", note: "One island, one resort. Seaplane transfer.", image: P.villas, rating: 4.8,
    about: "Villas on stilts over a shallow lagoon, a short boat ride from Hanifaru Bay. Steps lead straight from your deck into the water, and the house reef starts a few metres out.",
    amenities: ["Private deck with lagoon access", "House reef", "Spa", "Dive centre", "All-inclusive option", "Kids' club"],
    facts: [{ label: "Transfer", value: "Seaplane · 35 min" }, { label: "Check-in", value: "14:00" }, { label: "Best for", value: "Couples, mantas" }],
    reviews: [
      R("Sample guest", "United Kingdom", "Oct 2026", 5, "Snorkelled with mantas on the second morning. The staff knew exactly when the bay was busy and when to go."),
      R("Sample guest", "Germany", "Aug 2026", 5, "Quiet, well run, and the house reef is better than most dive sites we've paid for."),
      R("Sample guest", "India", "Jun 2026", 4, "Beautiful villa. Food prices on the half-board plan add up quickly, so look at all-inclusive."),
    ],
  },
  {
    slug: "lagoon-villas-south-ari", name: "Lagoon villas", type: "Resort", atoll: "South Ari", price: "From USD 650", note: "Close to the whale-shark reef.", image: P.villaDeck, rating: 4.5,
    about: "Low beach and lagoon villas on the southern rim of Ari, close to the whale-shark area at Maamigili. Excursions run most days of the year.",
    amenities: ["Beach and lagoon villas", "Whale-shark excursions", "Two pools", "Dive centre", "Water sports"],
    facts: [{ label: "Transfer", value: "Seaplane · 25 min" }, { label: "Check-in", value: "14:00" }, { label: "Best for", value: "Whale sharks, families" }],
    reviews: [
      R("Sample guest", "Australia", "Sep 2026", 5, "Saw a whale shark on the first trip out. Guides were careful about distance and numbers in the water."),
      R("Sample guest", "Italy", "Jul 2026", 4, "Lovely lagoon, slightly dated bathrooms. Great value for Ari."),
    ],
  },
  {
    slug: "beach-guesthouse-kaafu", name: "Beach guesthouse", type: "Guesthouse", atoll: "Kaafu", price: "From USD 70", note: "Local island, public ferry, bikini beach.", image: P.felidhoo, rating: 4.3,
    about: "A family-run guesthouse on a local island, two minutes from the marked bikini beach. Breakfast is Maldivian, and the owners arrange snorkel trips and sandbank picnics.",
    amenities: ["Breakfast included", "Air conditioning", "Bikini beach nearby", "Snorkel trips", "Wi-Fi"],
    facts: [{ label: "Transfer", value: "Public ferry or speedboat" }, { label: "Check-in", value: "12:00" }, { label: "Best for", value: "Budget, local life" }],
    reviews: [
      R("Sample guest", "France", "Oct 2026", 5, "The family treated us like guests in their home. Sandbank trip was the highlight."),
      R("Sample guest", "Poland", "May 2026", 4, "Simple rooms, spotless. Remember there's no alcohol on local islands."),
      R("Sample guest", "Japan", "Mar 2026", 4, "Easy ferry connection, and the bikini beach is quiet on weekdays."),
    ],
  },
  {
    slug: "surf-guesthouse-north-male", name: "Surf guesthouse", type: "Guesthouse", atoll: "North Malé", price: "From USD 90", note: "Five minutes by boat to Cokes.", image: P.wave, rating: 4.4,
    about: "A surf-focused guesthouse on Thulusdhoo with daily boats to Cokes and Chickens. Boards, coaching and surf-forecast briefings every evening.",
    amenities: ["Daily surf boats", "Board rental", "Coaching", "Breakfast and dinner", "Rooftop lounge"],
    facts: [{ label: "Transfer", value: "Speedboat · 30 min" }, { label: "Check-in", value: "12:00" }, { label: "Season", value: "March to October" }],
    reviews: [
      R("Sample guest", "Brazil", "Jul 2026", 5, "Uncrowded mornings at Cokes and a crew that actually reads the swell."),
      R("Sample guest", "USA", "Jun 2026", 4, "Great waves, basic rooms. Exactly what a surf trip should be."),
    ],
  },
  {
    slug: "dive-liveaboard", name: "Dive liveaboard", type: "Liveaboard", atoll: "Central atolls", price: "From USD 1,400 / week", note: "Seven nights, three dives a day.", image: P.reef, partner: true, rating: 4.6,
    about: "A week on a dive boat moving between Ari, Vaavu and South Malé, following the currents and the best conditions. Includes night dives and a dedicated dive dhoni.",
    amenities: ["Three dives a day", "Nitrox", "Dive dhoni", "All meals", "Air-conditioned cabins"],
    facts: [{ label: "Duration", value: "7 nights" }, { label: "Departs", value: "Malé, Saturdays" }, { label: "Level", value: "Advanced recommended" }],
    reviews: [
      R("Sample guest", "Netherlands", "Apr 2026", 5, "Hammerheads at dawn in Rasdhoo and mantas at night. Briefings were excellent."),
      R("Sample guest", "Spain", "Feb 2026", 4, "Intense schedule, cabins are small, but the diving is world class."),
    ],
  },
  {
    slug: "pool-villas-raa", name: "Pool villas", type: "Resort", atoll: "Raa Atoll", price: "From USD 750", note: "Quiet reef, few boats.", image: P.resortPool, rating: 4.7,
    about: "Beach villas with private pools on a lightly visited reef in Raa. Few other resorts nearby, so dive and snorkel sites stay quiet.",
    amenities: ["Private pool", "Beach villa", "House reef", "Spa", "Sunset bar"],
    facts: [{ label: "Transfer", value: "Seaplane · 45 min" }, { label: "Check-in", value: "15:00" }, { label: "Best for", value: "Quiet stays" }],
    reviews: [
      R("Sample guest", "Switzerland", "Sep 2026", 5, "We had the reef to ourselves most days. Pool villa was worth it."),
      R("Sample guest", "UAE", "Jan 2026", 4, "Long seaplane ride but very peaceful once you arrive."),
    ],
  },
];

export const getStay = (slug: string) => stays.find((s) => s.slug === slug);

export type Eat = { name: string; kind: string; area: string; price: string; dish: string; image: string };

export const eats: Eat[] = [
  { name: "Harbour hotaa", kind: "Local café", area: "Malé", price: "MVR 60", dish: "Mas huni and roshi", image: P.maleSea },
  { name: "Fish market grill", kind: "Seafood", area: "Malé", price: "MVR 180", dish: "Grilled reef fish", image: P.dhoni },
  { name: "Sunset deck", kind: "Resort dining", area: "Baa Atoll", price: "USD 90", dish: "Tasting menu", image: P.sunsetVillas },
  { name: "Hulhumalé beachfront", kind: "Casual", area: "Hulhumalé", price: "MVR 250", dish: "Garudhiya fish soup", image: P.beach },
];

export type Event = { month: string; title: string; text: string; where: string };

export const events: Event[] = [
  { month: "Jan–Apr", title: "Dry season", text: "Northeast monsoon. Calm seas, clear water, the busiest months.", where: "Countrywide" },
  { month: "Jun–Nov", title: "Manta season", text: "Mantas feed in Hanifaru Bay, peaking in August.", where: "Baa Atoll" },
  { month: "26 Jul", title: "Independence Day", text: "Parades and fireworks in Malé's Republic Square.", where: "Malé" },
  { month: "Mar–Oct", title: "Surf season", text: "Southwest swell lights up the North Malé breaks.", where: "North Malé" },
  { month: "Ramadan", title: "Holy month", text: "Cafés on local islands close by day. Resorts run as usual.", where: "Local islands" },
  { month: "Nov", title: "Turtle nesting", text: "Green turtles nest on quiet southern beaches.", where: "Addu City" },
];

export type Essential = { label: string; big: string; text: string; href?: string };

export const essentials: Essential[] = [
  { label: "Time zone", big: "UTC+5", text: "One zone all year. Some resorts set their own island time." },
  { label: "Money", big: "MVR", text: "Rufiyaa. 1 USD = 15.42 MVR, as of Nov 2026." },
  { label: "Power", big: "230 V", text: "50 Hz, Type G and D plugs." },
  { label: "Arrival", big: "MLE", text: "Velana International. Free 30-day tourist visa on arrival." },
  { label: "Transfers", big: "3 ways", text: "Speedboat, seaplane (daylight only) or domestic flight.", href: "/guides/seaplane-transfers" },
  { label: "SIM cards", big: "4G", text: "Dhiraagu and Ooredoo desks in arrivals. Bring your passport." },
];

export const navItems = [
  { href: "/things-to-do", label: "Explore" },
  { href: "/atolls", label: "Atolls" },
  { href: "/stay", label: "Stay" },
  { href: "/eat-drink", label: "Eat & drink" },
  { href: "/whats-on", label: "What's on" },
];

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);
export const getAtoll = (slug: string) => atolls.find((a) => a.slug === slug);
