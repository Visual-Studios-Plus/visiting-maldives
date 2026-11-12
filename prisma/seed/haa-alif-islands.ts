import type { Atoll, GalleryPhoto } from "../../lib/data.ts";

type IslandProfile = {
  slug: string;
  name: string;
  dhivehi?: string;
  tagline: string;
  intro: string;
  body: { heading: string; text: string }[];
  facts: { label: string; value: string }[];
  image: string;
  /** describes the cover photo honestly (e.g. when it shows the atoll, not this island) */
  imageAlt: string;
  gallery?: GalleryPhoto[];
};

/*
 * Inhabited islands of Haa Alif Atoll, each listed as its own entry in the Atolls section
 * (/atolls/<slug>), as the client asked.
 * Facts come from each island's English Wikipedia article (checked 12 Nov 2026); distances are
 * Wikipedia's figures from Malé. Photos are Wikimedia Commons, credited on /credits. Where no
 * good photo of the island itself exists, the cover shows the wider atoll and its alt text says so.
 */

const C = "https://upload.wikimedia.org/wikipedia/commons";
const T = "https://thumb.wikimedia.org/wikipedia/commons/thumb";

export const HA = {
  dhidhdhooAerial: `${C}/6/6c/Ha._Dhidhdhoo_Aerial_view.jpg`,
  dhidhdhooWater: `${C}/8/81/Ha._Dhidhdhoo_Watersports.jpg`,
  dhidhdhooNight: `${C}/b/bf/Ha._Dhidhdhoo_Nightview.jpg`,
  filladhoo: `${C}/6/66/Filladhoo_school_-_panoramio.jpg`,
  hoarafushiAerial: `${C}/e/ef/Aerial_view_of_Hoarafushi%2C_Haa_Alif_Atoll%2C_Maldives.jpg`,
  hoarafushiNight: `${C}/0/0e/Hoarafushi_-Nov_2023.jpg`,
  ihavandhooBeach: `${C}/6/69/Ihavandhoo-SouthWest%2802-09.2011%29.jpg`,
  ihavandhooAerial: `${C}/4/45/Island_of_maldives_ihavandhoo_view_July_2021.jpg`,
  kelaaLagoon: `${T}/0/0e/Water_sports_activities_in_Kelaa_Lagoon.jpg/1920px-Water_sports_activities_in_Kelaa_Lagoon.jpg`,
  kelaaHouse: `${T}/3/3c/Kelaa%2C_Maldives_-_panoramio.jpg/1920px-Kelaa%2C_Maldives_-_panoramio.jpg`,
  maarandhooOffice: `${C}/3/34/Maarandhoo_office1.jpg`,
  muraidhoo: `${C}/8/8e/Muraidhoo.jpg`,
  thakandhoo: `${C}/c/ca/Thakandhoo-Aerial~2.jpg`,
  ihavandhippolhu: `${C}/1/1b/Ihavandhippolhu_Atoll_%28Landsat%29.JPG`,
  utheemuHarbour: `${C}/1/11/Utheemu01.jpg`,
  utheemuBeach: `${C}/7/7b/Utheemu02.jpg`,
  utheemuGanduvaru: `${C}/5/5a/Utheemu03.jpg`,
  utheemuMosque: `${C}/b/b1/Utheemu04.jpg`,
  vashafaruSands: `${T}/9/9e/The_White_Sands_of_Vashafaru.jpg/1920px-The_White_Sands_of_Vashafaru.jpg`,
  vashafaru: `${T}/0/0b/Vashafaru%2C_Maldives_-_panoramio.jpg/1920px-Vashafaru%2C_Maldives_-_panoramio.jpg`,
  haBeach: `${T}/9/98/Haa_Alifu_Atoll%2C_Maldives_-_panoramio.jpg/1920px-Haa_Alifu_Atoll%2C_Maldives_-_panoramio.jpg`,
  haSandbank: `${T}/7/74/Haa_Alifu_Atoll%2C_Maldives_-_panoramio_%281%29.jpg/1920px-Haa_Alifu_Atoll%2C_Maldives_-_panoramio_%281%29.jpg`,
  haShore: `${T}/e/e9/Haa_Alifu_Atoll%2C_Maldives_-_panoramio_%282%29.jpg/1920px-Haa_Alifu_Atoll%2C_Maldives_-_panoramio_%282%29.jpg`,
  haJetty: `${T}/d/d4/Haa_Alifu_Atoll%2C_Maldives_-_panoramio_%283%29.jpg/1920px-Haa_Alifu_Atoll%2C_Maldives_-_panoramio_%283%29.jpg`,
} as const;

const atollPhotos: GalleryPhoto[] = [
  { src: HA.haSandbank, alt: "A sandbank in Haa Alif Atoll" },
  { src: HA.haJetty, alt: "A wooden jetty over the lagoon in Haa Alif Atoll" },
];

const GETTING_THERE =
  "Most visitors fly from Malé to Hanimaadhoo, in neighbouring Haa Dhaalu Atoll, and continue by speedboat or ferry. Ask your guesthouse to arrange the transfer.";

const facts = (fromMale: string, geoAtoll: string, council: string, extra: { label: string; value: string }[] = []) => [
  { label: "From Malé", value: fromMale },
  { label: "Geographic atoll", value: geoAtoll },
  { label: "Governed by", value: council },
  ...extra,
];

export const haaAlifIslands: IslandProfile[] = [
  {
    slug: "baarah",
    name: "Baarah",
    dhivehi: "ބާރަށް",
    tagline: "Where the hero's warship was built",
    intro:
      "A mangrove-fringed island of about 2,000 people, with guesthouses, cafés, restaurants, dive centres and shops. In the 16th century its boatbuilders made the Kalhuohfummi, the ship of the war against the Portuguese.",
    body: [
      {
        heading: "History",
        text: "Baarah is where the Kalhuohfummi was built in the second half of the 16th century. The ship carried Sultan Muhammad Thakurufaanu's campaign against the Portuguese; its sails were made on Maroshi, further south.",
      },
      {
        heading: "Mangroves",
        text: "Much of the shore is mangrove, mostly Rhizophora mucronata with beach hibiscus. The wetland is under pressure from logging and waste, so stick to paths and take your rubbish with you.",
      },
      { heading: "Staying here", text: "Baarah is one of the atoll's busier local islands for visitors, with guesthouses, cafés, restaurants, dive centres and shops." },
      { heading: "Getting there", text: GETTING_THERE },
    ],
    facts: facts("294 km", "Thiladhunmathi", "Baarah Island Council", [{ label: "Population", value: "About 2,000" }]),
    image: HA.haShore,
    imageAlt: "A quiet shore in Haa Alif Atoll",
    gallery: atollPhotos,
  },
  {
    slug: "dhidhdhoo",
    name: "Dhidhdhoo",
    dhivehi: "ދިއްދޫ",
    tagline: "The atoll capital",
    intro:
      "The capital of Haa Alif and the second most populated island in the north after Kulhudhuffushi, known for one of the lowest crime rates among the country's larger islands.",
    body: [
      {
        heading: "Island life",
        text: "As the atoll's administrative centre, Dhidhdhoo has its busiest harbour, shops and services. Ha. Atoll Education Centre, the largest school in the atoll, teaches more than a thousand students.",
      },
      {
        heading: "Growing fast",
        text: "A 75-home housing project began here in 2022, and an airport with a 1,500 m runway is planned on reclaimed land, to make the far north easier to reach.",
      },
      { heading: "Getting there", text: GETTING_THERE },
    ],
    facts: facts("Centre of the atoll", "Thiladhunmathi", "Dhidhdhoo Island Council", [{ label: "Role", value: "Atoll capital" }]),
    image: HA.dhidhdhooAerial,
    imageAlt: "Dhidhdhoo from the air, its reef and lagoon around it",
    gallery: [
      { src: HA.dhidhdhooWater, alt: "Children swimming and water sports in Dhidhdhoo's lagoon" },
      { src: HA.dhidhdhooNight, alt: "Dhidhdhoo's streets lit up at night" },
    ],
  },
  {
    slug: "filladhoo",
    name: "Filladhoo",
    dhivehi: "ފިއްލަދޫ",
    tagline: "A sand spit and a seabird haven",
    intro:
      "A small island on a large reef, with a long sandy spit reaching north to Dhapparu, once a separate island. The waters around it are part of an Important Bird Area.",
    body: [
      {
        heading: "Nature",
        text: "Haa Alif and its reef waters form a 6,000-hectare Important Bird Area, named by BirdLife International for its colony of around 15,000 lesser noddies.",
      },
      { heading: "Island life", text: "Filladhoo has its own school, Madhrasathul Sobaah, founded in 1998, and a health centre for basic care." },
      { heading: "Getting there", text: GETTING_THERE },
    ],
    facts: facts("300 km", "Thiladhunmathi", "Filladhoo Island Council"),
    image: HA.filladhoo,
    imageAlt: "Filladhoo's school among the palms",
    gallery: atollPhotos,
  },
  {
    slug: "hoarafushi",
    name: "Hoarafushi",
    dhivehi: "ހޯރަފުށި",
    tagline: "Named for the frigatebird",
    intro:
      "A large island on the Maldives' longest fringing reef, more than 22 km long. It is named after the great frigatebird, the hoara, once common here.",
    body: [
      {
        heading: "History",
        text: "Islanders trace their roots to Gudhanfushi, a vanished island on the same reef; as it eroded they moved to Huvahandhoo and then here, about 300 years ago. In 1912 Hoarafushi was the fourth-largest settlement in the country.",
      },
      {
        heading: "Geography",
        text: "Three islands have joined to make today's 105 hectares: Bodufinolhu in the 1700s and Kudafinolhu in 2013. An aviation academy with the country's first automatic fire simulator opened here in 2022.",
      },
      { heading: "Getting there", text: GETTING_THERE },
    ],
    facts: facts("318 km", "Ihavandhippolhu", "Hoarafushi Island Council", [{ label: "Land area", value: "105 ha" }]),
    image: HA.hoarafushiAerial,
    imageAlt: "Hoarafushi from the air, its harbour and the reef beyond",
    gallery: [{ src: HA.hoarafushiNight, alt: "Hoarafushi's street grid lit up at night" }],
  },
  {
    slug: "ihavandhoo",
    name: "Ihavandhoo",
    dhivehi: "އިހަވަންދޫ",
    tagline: "A fishing island with a coral-stone mosque",
    intro:
      "A traditional fishing island in Ihavandhippolhu, the country's northernmost geographic atoll. The mother of national hero Mohamed Thakurufaanu came from here.",
    body: [
      {
        heading: "History",
        text: "The island's mosque was built from brain coral by Sultan Ibrahim Muhiyuddin in 1701 and has been restored with its original form kept. It is the island's only surviving archaeological site.",
      },
      {
        heading: "Fishing",
        text: "Most working islanders fish, and Ihavandhoo supplies chilled, frozen and dried tuna for export. Its harbour, first dug in 1992, is the centre of daily life.",
      },
      { heading: "Getting there", text: GETTING_THERE },
    ],
    facts: facts("314 km", "Ihavandhippolhu", "Ihavandhoo Island Council", [{ label: "Hospital", value: "50 beds (since 2003)" }]),
    image: HA.ihavandhooAerial,
    imageAlt: "Ihavandhoo's houses and streets from the air",
    gallery: [{ src: HA.ihavandhooBeach, alt: "The south-west beach of Ihavandhoo" }],
  },
  {
    slug: "kelaa",
    name: "Kelaa",
    dhivehi: "ކެލާ",
    tagline: "A lagoon twelve times its size",
    intro:
      "On the north-north-east tip of the country, the closest point of the Maldives to India. Kelaa's turquoise lagoon covers 2,423 hectares, about twelve times the island itself.",
    body: [
      {
        heading: "The name",
        text: "Most islanders say Kelaa is named after a sandalwood tree (kelaa) that early sailors found by its scent. Other stories link it to the keyla fish, or to a word for 'entrance', as the first island reached from the north-east.",
      },
      {
        heading: "Nature",
        text: "The island covers 203 hectares, with coral rock on its eastern shore and sandy beaches on the west. Farm plots and wetlands fill much of the interior.",
      },
      { heading: "Getting there", text: GETTING_THERE },
    ],
    facts: facts("Northern tip", "Thiladhunmathi", "Kelaa Island Council", [
      { label: "Land area", value: "203 ha" },
      { label: "Lagoon", value: "2,423 ha" },
    ]),
    image: HA.kelaaLagoon,
    imageAlt: "Water sports in Kelaa's turquoise lagoon",
    gallery: [{ src: HA.kelaaHouse, alt: "A house in Kelaa" }],
  },
  {
    slug: "maarandhoo",
    name: "Maarandhoo",
    dhivehi: "މާރަންދޫ",
    tagline: "A quiet island in the inner atoll",
    intro: "A small local island in Thiladhunmathi, with everyday island life and few visitors.",
    body: [
      { heading: "Island life", text: "Maarandhoo is run by its own island council. It is a good choice for a slow day trip from the larger islands nearby." },
      { heading: "Getting there", text: GETTING_THERE },
    ],
    facts: facts("302 km", "Thiladhunmathi", "Maarandhoo Island Council"),
    image: HA.haJetty,
    imageAlt: "A wooden jetty over a lagoon in Haa Alif Atoll",
    gallery: [{ src: HA.maarandhooOffice, alt: "The island council office in Maarandhoo" }],
  },
  {
    slug: "mulhadhoo",
    name: "Mulhadhoo",
    dhivehi: "މޮޅަދޫ",
    tagline: "Once a great turtle beach",
    intro:
      "Also spelled Molhadhoo. Half a century ago, Mulhadhoo and nearby Gaamathikulhudhoo saw more than 20,000 green turtles nest on their beaches each year.",
    body: [
      {
        heading: "Turtles",
        text: "Nesting has fallen sharply, to under 400 females in 2001. If you see a turtle on the beach, keep your distance, use no lights at night, and never touch eggs or hatchlings.",
      },
      { heading: "Getting there", text: GETTING_THERE },
    ],
    facts: facts("319 km", "Ihavandhippolhu", "Molhadhoo Island Council", [{ label: "Also spelled", value: "Molhadhoo" }]),
    image: HA.ihavandhippolhu,
    imageAlt: "Ihavandhippolhu, the geographic atoll Mulhadhoo lies on, seen from space",
    gallery: atollPhotos,
  },
  {
    slug: "muraidhoo",
    name: "Muraidhoo",
    dhivehi: "މުރައިދޫ",
    tagline: "An island of royal officials",
    intro:
      "An inner-atoll island, away from the outer reef. It was home to Hassan Kaleyge, treasurer to several sultans, and to Hussein Dahara Takurufan, foreign minister from 1759 to 1767.",
    body: [
      { heading: "Island life", text: "Sheltered inside the atoll, Muraidhoo is a calm, small community with its own island council." },
      { heading: "Getting there", text: GETTING_THERE },
    ],
    facts: facts("297 km", "Thiladhunmathi", "Muraidhoo Island Council"),
    image: HA.muraidhoo,
    imageAlt: "Muraidhoo seen from the water",
    gallery: atollPhotos,
  },
  {
    slug: "thakandhoo",
    name: "Thakandhoo",
    dhivehi: "ތަކަންދޫ",
    tagline: "The tomb of Ali Thakurufaanu",
    intro:
      "A low, flat island ringed by lagoon and reef. It holds the tomb of Ali Thakurufaanu, the first to fall in the war against the Portuguese, in 1572.",
    body: [
      {
        heading: "History",
        text: "After Ali Thakurufaanu was killed, his head was taken to Malé as a trophy. Maldivians later took it back and buried it on Funadhoo, and his body was laid to rest here.",
      },
      { heading: "Nature", text: "White beaches and coconut palms line the shore, and the reef protects the island from strong currents." },
      { heading: "Getting there", text: GETTING_THERE },
    ],
    facts: facts("301 km", "Thiladhunmathi", "Thakandhoo Island Council"),
    image: HA.thakandhoo,
    imageAlt: "Thakandhoo from the air",
    gallery: atollPhotos,
  },
  {
    slug: "thuraakunu",
    name: "Thuraakunu",
    dhivehi: "ތުރާކުނު",
    tagline: "The northernmost island of the Maldives",
    intro:
      "The country's northernmost island and its closest neighbour to Minicoy in India. Fishermen from the two islands once traded and visited freely, until 1956.",
    body: [
      {
        heading: "History",
        text: "Thuraakunu and Minicoy share close ties of language and custom. The exchange carried on after Indian independence, until visits were stopped in 1956.",
      },
      { heading: "Getting there", text: GETTING_THERE },
    ],
    facts: facts("331 km", "Ihavandhippolhu", "Thuraakunu Island Council", [{ label: "Known for", value: "Northernmost island" }]),
    image: HA.ihavandhippolhu,
    imageAlt: "Ihavandhippolhu from space; Thuraakunu lies on its northern rim",
    gallery: atollPhotos,
  },
  {
    slug: "uligamu",
    name: "Uligamu",
    dhivehi: "އުލިގަން",
    tagline: "The yachts' last stop",
    intro:
      "Also called Uligan. Yachts crossing from Thailand often stop here before heading for the Red Sea, and islanders sell provisions and souvenirs to passing sailors.",
    body: [
      {
        heading: "Clean power",
        text: "Uligamu runs on a hybrid micro grid of wind turbines, solar panels and batteries, billed as the first of its kind in the world.",
      },
      { heading: "Getting there", text: GETTING_THERE },
    ],
    facts: facts("328 km", "Ihavandhippolhu", "Uligan Island Council", [{ label: "Also called", value: "Uligan" }]),
    image: HA.haBeach,
    imageAlt: "A beach in Haa Alif Atoll",
    gallery: [{ src: HA.ihavandhippolhu, alt: "Ihavandhippolhu, the geographic atoll Uligamu lies on, seen from space" }],
  },
  {
    slug: "utheemu",
    name: "Utheemu",
    dhivehi: "އުތީމު",
    tagline: "Birthplace of a national hero",
    intro:
      "Sultan Mohamed Thakurufaanu was born here. With his brothers he led the long fight that drove out the Portuguese, who occupied the Maldives from 1558 to 1573.",
    body: [
      {
        heading: "Utheemu Ganduvaru",
        text: "The wooden palace where Mohamed Thakurufaanu grew up still stands and is the island's best-known sight.",
      },
      {
        heading: "A royal line",
        text: "The Utheemu dynasty ruled from 1632 to 1692, and regents from the island governed from 1573 to 1632.",
      },
      { heading: "Getting there", text: GETTING_THERE },
    ],
    facts: facts("297 km", "Thiladhunmathi", "Utheemu Island Council", [{ label: "See", value: "Utheemu Ganduvaru" }]),
    image: HA.utheemuGanduvaru,
    imageAlt: "Utheemu Ganduvaru, the wooden palace of Mohamed Thakurufaanu",
    gallery: [
      { src: HA.utheemuHarbour, alt: "Utheemu's harbour" },
      { src: HA.utheemuBeach, alt: "A white-sand beach on Utheemu" },
      { src: HA.utheemuMosque, alt: "The new mosque on Utheemu" },
    ],
  },
  {
    slug: "vashafaru",
    name: "Vashafaru",
    dhivehi: "ވަށަފަރު",
    tagline: "White sand and quiet days",
    intro: "A small local island in Thiladhunmathi, known for its wide white-sand beaches.",
    body: [
      { heading: "Island life", text: "Vashafaru is run by its own island council and sees few visitors, so its beaches are often empty." },
      { heading: "Getting there", text: GETTING_THERE },
    ],
    facts: facts("303 km", "Thiladhunmathi", "Vashafaru Island Council"),
    image: HA.vashafaruSands,
    imageAlt: "The white sands of Vashafaru",
    gallery: [{ src: HA.vashafaru, alt: "Palms along the shore of Vashafaru" }],
  },
];

const BEST_FOR: Record<string, string[]> = {
  baarah: ["Diving", "Mangroves"],
  dhidhdhoo: ["Atoll capital", "Local life"],
  filladhoo: ["Birdlife", "Sandbanks"],
  hoarafushi: ["Reef", "History"],
  ihavandhoo: ["Heritage", "Fishing life"],
  kelaa: ["Lagoon", "Water sports"],
  maarandhoo: ["Quiet stays"],
  mulhadhoo: ["Turtles", "Nature"],
  muraidhoo: ["History", "Quiet stays"],
  thakandhoo: ["History", "Beaches"],
  thuraakunu: ["Far north", "History"],
  uligamu: ["Yachting", "Clean energy"],
  utheemu: ["Heritage", "History"],
  vashafaru: ["Beaches", "Quiet stays"],
};

/** Every inhabited island as an entry in the Atolls collection. */
export const haaAlifIslandAtolls: Atoll[] = haaAlifIslands
  .map((p) => ({
    slug: p.slug,
    name: p.name,
    dhivehi: p.dhivehi ?? "",
    region: "North",
    tagline: `${p.tagline} · Haa Alif`,
    intro: p.intro,
    bestFor: BEST_FOR[p.slug] ?? ["Local island"],
    transfer: "Flight to Hanimaadhoo + boat",
    image: p.image,
    gallery: [{ src: p.image, alt: p.imageAlt }, ...(p.gallery ?? [])],
    body: p.body,
    facts: [{ label: "Atoll", value: "Haa Alif" }, ...p.facts],
    parent: "haa-alif",
  }));
