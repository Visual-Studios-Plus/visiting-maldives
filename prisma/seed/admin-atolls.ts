import { P, type Atoll, type Islands, type ResortIsland } from "../../lib/data.ts";
import { REGISTER } from "./atoll-islands.ts";

/*
 * The administrative atolls not curated by hand in content.ts, plus Ari split into its two
 * administrative atolls. Island lists come from the government register (atoll-islands.ts);
 * descriptions from each atoll's English Wikipedia article (checked 12 Nov 2026). Photos are
 * Wikimedia Commons, credited on /credits.
 */

/** North to south, the official order of the 20 administrative atolls. */
export const ATOLL_ORDER = [
  "haa-alif",
  "haa-dhaalu",
  "shaviyani",
  "noonu",
  "raa",
  "baa",
  "lhaviyani",
  "male",
  "alif-alif",
  "alif-dhaal",
  "vaavu",
  "meemu",
  "faafu",
  "dhaalu",
  "thaa",
  "laamu",
  "gaafu-alif",
  "gaafu-dhaalu",
  "fuvahmulah",
  "addu",
];

/** Atolls in official order; anything not in the list (e.g. single-island entries) keeps its place after them. */
export const sortAtolls = (list: Atoll[]) => {
  const rank = (a: Atoll) => {
    const i = ATOLL_ORDER.indexOf(a.slug);
    return i === -1 ? ATOLL_ORDER.length : i;
  };
  return list.map((a, i) => ({ a, i })).sort((x, y) => rank(x.a) - rank(y.a) || x.i - y.i).map((x) => x.a);
};

const C = "https://upload.wikimedia.org/wikipedia/commons";
const T = "https://thumb.wikimedia.org/wikipedia/commons/thumb";

const IMG = {
  hanimaadhooBeach: `${C}/c/c7/Hanimaadhoo_-_beach_01.jpg`,
  milandhooBeach: `${C}/d/d5/MILANDHOO_BEACH_-_panoramio.jpg`,
  bileiyfahi: `${T}/8/83/20170203-_MG_3313.jpg/1920px-20170203-_MG_3313.jpg`,
  kudafari: `${T}/5/5f/Kudafari.jpg/1920px-Kudafari.jpg`,
  kudafariFoam: `${T}/5/54/Ocean_foam_on_a_sand_beach_%28Unsplash%29.jpg/1920px-Ocean_foam_on_a_sand_beach_%28Unsplash%29.jpg`,
  lhaviyaniAerial: `${T}/a/a5/Malediven_Atoll_Lhaviyani_%2828831935475%29.jpg/1920px-Malediven_Atoll_Lhaviyani_%2828831935475%29.jpg`,
  komandoo: `${T}/8/8d/Komandoo_%28Lhaviyani_Atoll%29.jpg/1920px-Komandoo_%28Lhaviyani_Atoll%29.jpg`,
  madhiriguraidhooJetty: `${T}/1/1f/Mandatory_jetty_shot%2C_Madhiriguraidhoo%2C_Lhaviyani_Atoll%2C_Maldives_%2811742406995%29.jpg/1920px-Mandatory_jetty_shot%2C_Madhiriguraidhoo%2C_Lhaviyani_Atoll%2C_Maldives_%2811742406995%29.jpg`,
  ariPasses: `${C}/a/a3/Ari_Atoll_passes.jpg`,
  bathalaa: `${T}/c/c9/Atoll._%28Unsplash%29.jpg/1920px-Atoll._%28Unsplash%29.jpg`,
  sunIsland: `${T}/4/47/Sun_Island_Resort%2C_Alif_Dhaal_Atoll%2C_Maldives_%28Unsplash%29.jpg/1920px-Sun_Island_Resort%2C_Alif_Dhaal_Atoll%2C_Maldives_%28Unsplash%29.jpg`,
  alifDhaal1: `${T}/d/d7/Alifu_Dhaalu_Atoll%2C_Maldives_-_panoramio.jpg/1920px-Alifu_Dhaalu_Atoll%2C_Maldives_-_panoramio.jpg`,
  alifDhaal2: `${T}/4/44/Alifu_Dhaalu_Atoll%2C_Maldives_-_panoramio_%281%29.jpg/1920px-Alifu_Dhaalu_Atoll%2C_Maldives_-_panoramio_%281%29.jpg`,
  meemuAerial: `${T}/a/ad/Meemu-maldives-munhoven.JPG/1920px-Meemu-maldives-munhoven.JPG`,
  meemuReef: `${C}/4/4e/Meemu_Atoll_Reef_%2832157145524%29.jpg`,
  dhaaluIsland: `${T}/1/1a/An_island_in_the_beautiful_atoll_of_Dhaalu_%28Unsplash%29.jpg/1920px-An_island_in_the_beautiful_atoll_of_Dhaalu_%28Unsplash%29.jpg`,
  dhaaluHome: `${T}/3/31/My_Home._%28Unsplash%29.jpg/1920px-My_Home._%28Unsplash%29.jpg`,
  meedhooFarms: `${T}/1/16/Dhaalu_Meedhoo_farms.jpg/1920px-Dhaalu_Meedhoo_farms.jpg`,
  thaaGuraidhoo: `${T}/b/b3/Thaa_Guraidhoo.jpg/1920px-Thaa_Guraidhoo.jpg`,
  laamuNorthEast: `${C}/e/ee/North_east_hadhunmathi_maldives.JPG`,
  laamuOlhuveli: `${T}/7/70/Olhuveli_Island._Hithadhoo-Laamu_Atoll._Maldives_-_panoramio.jpg/1920px-Olhuveli_Island._Hithadhoo-Laamu_Atoll._Maldives_-_panoramio.jpg`,
  hadahaa1: `${T}/2/2b/ALILA_VILLAS_HADAHAA_%2C_MALDIVES_1_-_panoramio.jpg/1920px-ALILA_VILLAS_HADAHAA_%2C_MALDIVES_1_-_panoramio.jpg`,
  hadahaa2: `${T}/b/bc/ALILA_VILLAS_HADAHAA_%2C_MALDIVES_2_-_panoramio.jpg/1920px-ALILA_VILLAS_HADAHAA_%2C_MALDIVES_2_-_panoramio.jpg`,
  thinadhoo: `${C}/d/d9/GdhThinadhoo.jpg`,
  gdhIsland: `${T}/4/42/UNHABITED_ISLAND_ON_THE_WAY_KAADEHDHOO_AIRPORT_5_-_panoramio.jpg/1920px-UNHABITED_ISLAND_ON_THE_WAY_KAADEHDHOO_AIRPORT_5_-_panoramio.jpg`,
  fuvahmulahSunset: `${T}/9/94/The_Sunset_Point_in_Fuvahmulah_Harbour_-_panoramio.jpg/1920px-The_Sunset_Point_in_Fuvahmulah_Harbour_-_panoramio.jpg`,
  fuvahmulahHarbour: `${T}/3/3c/Fuvahmulah_Shark_Harbour_Surf_Area_and_the_Royal_Restaurant_in_Fuvahmulah_Maldives.jpg/1920px-Fuvahmulah_Shark_Harbour_Surf_Area_and_the_Royal_Restaurant_in_Fuvahmulah_Maldives.jpg`,
  thoondu: `${T}/5/5d/Fuvahmulah_Thoondu.jpg/1920px-Fuvahmulah_Thoondu.jpg`,
};

/** Island lists for an atoll from the register: protected islands count as uninhabited. */
const registerIslands = (slug: string, named: ResortIsland[] = []): Islands => {
  const r = REGISTER[slug];
  const namedIslands = new Set(named.map((n) => n.island));
  return {
    inhabited: r.inhabited,
    uninhabited: [...r.uninhabited, ...r.protected].sort((a, b) => a.localeCompare(b)),
    resorts: named,
    resortIslands: [...r.resorts, ...r.proposedResorts].filter((i) => !namedIslands.has(i)).sort((a, b) => a.localeCompare(b)),
  };
};

export const newAtolls: Atoll[] = [
  {
    slug: "haa-dhaalu",
    name: "Haa Dhaalu Atoll",
    dhivehi: "ހދ",
    region: "North",
    tagline: "The north's busiest hub",
    intro:
      "South Thiladhunmathi, with Kulhudhuffushi as its capital and Hanimaadhoo's international airport as the gateway to the far north. It also takes in Makunudhoo, a small atoll with a large reef.",
    bestFor: ["Local islands", "Gateway to the north"],
    transfer: "Flight to Hanimaadhoo",
    image: IMG.hanimaadhooBeach,
    gallery: [{ src: IMG.hanimaadhooBeach, alt: "A white-sand beach on Hanimaadhoo" }],
    islands: {
      ...registerIslands("haa-dhaalu", [{ island: "Hondaafushi", resort: "Hondaafushi Island Resort" }]),
      // a hotel on an inhabited island, next to Hanimaadhoo International Airport
      halfResort: [{ island: "Hanimaadhoo", resort: "The Barefoot Eco Hotel" }],
    },
  },
  {
    slug: "shaviyani",
    name: "Shaviyani Atoll",
    dhivehi: "ށ",
    region: "North",
    tagline: "Quiet northern Miladhunmadulu",
    intro:
      "The northern half of Miladhunmadulu Atoll, with Funadhoo as its capital. It sees few visitors, with long beaches and small fishing communities.",
    bestFor: ["Quiet stays", "Local islands"],
    transfer: "Domestic flight + speedboat",
    image: IMG.milandhooBeach,
    gallery: [
      { src: IMG.milandhooBeach, alt: "The beach on Milandhoo" },
      { src: IMG.bileiyfahi, alt: "A tree on the shore of Bileiyfahi" },
    ],
    islands: registerIslands("shaviyani"),
  },
  {
    slug: "noonu",
    name: "Noonu Atoll",
    dhivehi: "ނ",
    region: "North",
    tagline: "Resorts and reefs in southern Miladhunmadulu",
    intro:
      "The southern half of Miladhunmadulu Atoll, with Manadhoo as its capital and about 12,500 people (2022 census). Its resort islands sit among quiet local ones.",
    bestFor: ["Resorts", "Reefs"],
    transfer: "Seaplane or domestic flight",
    image: IMG.kudafari,
    gallery: [
      { src: IMG.kudafari, alt: "Kudafari island from the air" },
      { src: IMG.kudafariFoam, alt: "Sea foam on a sandy beach at Kudafari" },
    ],
    islands: registerIslands("noonu"),
  },
  {
    slug: "lhaviyani",
    name: "Lhaviyani Atoll",
    dhivehi: "ޅ",
    region: "North",
    tagline: "Faadhippolhu: few islands, many reefs",
    intro:
      "Known to Maldivians as Faadhippolhu. Naifaru is the capital, only a handful of islands are inhabited, and Felivaru has the country's only fish cannery.",
    bestFor: ["Diving", "Resorts"],
    transfer: "Seaplane",
    image: IMG.lhaviyaniAerial,
    gallery: [
      { src: IMG.lhaviyaniAerial, alt: "Reefs and islands of Lhaviyani Atoll from the air" },
      { src: IMG.komandoo, alt: "Komandoo in Lhaviyani Atoll" },
      { src: IMG.madhiriguraidhooJetty, alt: "A jetty on Madhiriguraidhoo" },
    ],
    body: [
      {
        heading: "History",
        text: "Maafilaafushi was once the seat of a breakaway northern kingdom in the early 1600s, and was resettled in the 1980s to ease crowding in Malé.",
      },
    ],
    islands: registerIslands("lhaviyani"),
  },
  {
    slug: "meemu",
    name: "Meemu Atoll",
    dhivehi: "މ",
    region: "Central",
    tagline: "Mulaku: a quiet central atoll",
    intro:
      "Mulaku Atoll, south of Vaavu. Kolhufushi has a mosque of historic value, and the 1573 wreck of the Kalhuohfummi lies off the reef of Kolhuvaariyaafushi.",
    bestFor: ["Diving", "Quiet stays"],
    transfer: "Seaplane or speedboat",
    image: IMG.meemuAerial,
    gallery: [
      { src: IMG.meemuAerial, alt: "Meemu Atoll from the air" },
      { src: IMG.meemuReef, alt: "A reef in Meemu Atoll's lagoon" },
    ],
    islands: registerIslands("meemu"),
  },
  {
    slug: "faafu",
    name: "Faafu Atoll",
    dhivehi: "ފ",
    region: "Central",
    tagline: "Northern Nilandhe, small and calm",
    intro:
      "The northern Nilandhe Atoll, smaller than its sister Dhaalu across a 6 km channel. Some islands, like Himithi, were once inhabited before their people moved to larger islands.",
    bestFor: ["Quiet stays", "Reefs"],
    transfer: "Seaplane",
    image: P.sandbank,
    gallery: [{ src: P.sandbank, alt: "A sandbank in the Maldives (not Faafu itself)" }],
    islands: registerIslands("faafu"),
  },
  {
    slug: "dhaalu",
    name: "Dhaalu Atoll",
    dhivehi: "ދ",
    region: "Central",
    tagline: "Jewellers' islands of southern Nilandhe",
    intro:
      "Southern Nilandhe Atoll, 23 km wide and 38 km long, with Kudahuvadhoo as its capital. Hulhudheli and Rinbudhoo are known for generations of skilled jewellers.",
    bestFor: ["Crafts", "Local islands"],
    transfer: "Flight to Kudahuvadhoo",
    image: IMG.dhaaluIsland,
    gallery: [
      { src: IMG.dhaaluIsland, alt: "An island in Dhaalu Atoll from the air" },
      { src: IMG.dhaaluHome, alt: "A local island in Dhaalu Atoll" },
      { src: IMG.meedhooFarms, alt: "Farms on Meedhoo, Dhaalu Atoll" },
    ],
    body: [
      {
        heading: "Walk the reef",
        text: "On Gemendhoo's reef a line of uninhabited islands runs from Bulhalafushi to Naibukaloabodufushi; at low tide you can walk the route.",
      },
    ],
    islands: registerIslands("dhaalu"),
  },
  {
    slug: "thaa",
    name: "Thaa Atoll",
    dhivehi: "ތ",
    region: "Central",
    tagline: "Kolhumadulu, a fishing atoll",
    intro:
      "Kolhumadulu, a rich fishing ground with thirteen inhabited islands. Kinbidhoo has the ruins of a large Buddhist stupa from before the Maldives became Muslim.",
    bestFor: ["Fishing life", "History"],
    transfer: "Flight to Thimarafushi",
    image: IMG.thaaGuraidhoo,
    gallery: [{ src: IMG.thaaGuraidhoo, alt: "Guraidhoo in Thaa Atoll from the air" }],
    islands: registerIslands("thaa"),
  },
  {
    slug: "laamu",
    name: "Laamu Atoll",
    dhivehi: "ލ",
    region: "Central",
    tagline: "Haddhunmathi's long eastern islands",
    intro:
      "Haddhunmathi, a classic ring-shaped atoll with Fonadhoo as its capital. Large islands line its eastern rim, and it marks the southern edge of the central Maldives.",
    bestFor: ["Local islands", "Surf"],
    transfer: "Flight to Kadhdhoo",
    image: IMG.laamuNorthEast,
    gallery: [
      { src: IMG.laamuNorthEast, alt: "The north-east rim of Laamu Atoll" },
      { src: IMG.laamuOlhuveli, alt: "Olhuveli island in Laamu Atoll" },
    ],
    islands: registerIslands("laamu"),
  },
  {
    slug: "gaafu-alif",
    name: "Gaafu Alif Atoll",
    dhivehi: "ގއ",
    region: "South",
    tagline: "North Huvadhu, one of the world's largest atolls",
    intro:
      "The northern part of Huvadhu, one of the largest atolls in the world, split off in 1962. Villingili is the capital, and deep channels bring big fish close to the reef.",
    bestFor: ["Diving", "Remote resorts"],
    transfer: "Flight to Kooddoo",
    image: IMG.hadahaa1,
    gallery: [
      { src: IMG.hadahaa1, alt: "Overwater villas in Gaafu Alif Atoll" },
      { src: IMG.hadahaa2, alt: "A beach in Gaafu Alif Atoll" },
    ],
    islands: registerIslands("gaafu-alif"),
  },
  {
    slug: "gaafu-dhaalu",
    name: "Gaafu Dhaalu Atoll",
    dhivehi: "ގދ",
    region: "South",
    tagline: "South Huvadhu, 150-plus islands",
    intro:
      "The south-western part of Huvadhu, about 340 km south of Malé. Thinadhoo is the capital, and more than 150 islands lie scattered across its reef.",
    bestFor: ["Remote islands", "Diving"],
    transfer: "Flight to Kaadedhdhoo",
    image: IMG.thinadhoo,
    gallery: [
      { src: IMG.thinadhoo, alt: "Thinadhoo, capital of Gaafu Dhaalu Atoll, from the air" },
      { src: IMG.gdhIsland, alt: "An uninhabited island in Gaafu Dhaalu Atoll" },
    ],
    islands: registerIslands("gaafu-dhaalu"),
  },
  {
    slug: "fuvahmulah",
    name: "Fuvahmulah",
    dhivehi: "ޏ",
    region: "South",
    tagline: "One island, one atoll",
    intro:
      "Gnaviyani is a single large island on its own atoll. Its people speak their own dialect of Dhivehi, and divers come for the tiger sharks off its harbour.",
    bestFor: ["Shark diving", "Nature"],
    transfer: "Flight to Fuvahmulah",
    image: IMG.fuvahmulahSunset,
    gallery: [
      { src: IMG.fuvahmulahSunset, alt: "Sunset at Fuvahmulah harbour" },
      { src: IMG.fuvahmulahHarbour, alt: "The surf area by Fuvahmulah's harbour" },
      { src: IMG.thoondu, alt: "Thoondu beach on Fuvahmulah" },
    ],
    body: [
      {
        heading: "The name",
        text: "Fuvah means areca nut, once plentiful on the island. The ruins of a Buddhist stupa, the Havitta, still stand about 12 m high.",
      },
    ],
    islands: registerIslands("fuvahmulah"),
  },
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");

/** Splits the hand-curated "Ari Atoll" entry into Alif Alif (North Ari) and Alif Dhaal (South Ari). */
export function splitAri(ari: Atoll): Atoll[] {
  const inRegister = (slug: string, island: string) => {
    const r = REGISTER[slug];
    return [...r.inhabited, ...r.uninhabited, ...r.resorts, ...r.proposedResorts, ...r.protected].some((n) => norm(n) === norm(island));
  };
  const named = ari.islands?.resorts ?? [];
  // a named resort goes to North Ari when the register lists its island there, otherwise South Ari
  const north = named.filter((r) => inRegister("alif-alif", r.island));
  const south = named.filter((r) => !north.includes(r));
  const shared = { region: ari.region, transfer: ari.transfer };
  return [
    {
      ...shared,
      slug: "alif-alif",
      name: "Alif Alif Atoll",
      dhivehi: "އއ",
      tagline: "North Ari, Rasdhoo and Thoddoo",
      intro:
        "North Ari, together with little Rasdhoo Atoll and the lone island of Thoddoo. Many islands have been lived on since ancient times, and some have remains from the Buddhist era.",
      bestFor: ["Diving", "Local islands", "Resorts"],
      image: IMG.ariPasses,
      gallery: [
        { src: IMG.ariPasses, alt: "Channels in the eastern reef of Ari Atoll from the air" },
        { src: IMG.bathalaa, alt: "Bathalaa island in Alif Alif Atoll" },
      ],
      islands: { ...registerIslands("alif-alif", north) },
    },
    {
      ...shared,
      slug: "alif-dhaal",
      name: "Alif Dhaal Atoll",
      dhivehi: "އދ",
      tagline: "South Ari: whale sharks, all year",
      intro:
        "South Ari, where whale sharks live all year along the southern reef. Fenfushi has an old mosque with carved wooden ceilings and lacquerwork, and Ariadhoo has Buddhist remains.",
      bestFor: ["Whale sharks", "Diving", "Resorts"],
      image: IMG.sunIsland,
      gallery: [
        { src: IMG.sunIsland, alt: "A resort island in Alif Dhaal Atoll from the air" },
        { src: IMG.alifDhaal1, alt: "A beach in Alif Dhaal Atoll" },
        { src: IMG.alifDhaal2, alt: "An island in Alif Dhaal Atoll" },
      ],
      islands: { ...registerIslands("alif-dhaal", south) },
    },
  ];
}
