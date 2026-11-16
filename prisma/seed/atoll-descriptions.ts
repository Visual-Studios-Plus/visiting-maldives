import type { Atoll } from "../../lib/data.ts";

/*
 * Longer descriptions for the atoll pages, shown as numbered sections under the intro. Facts come
 * from each atoll's English Wikipedia article and the government island register (checked Nov 2026).
 * An atoll that already has a written-up `body` keeps it.
 */
type Section = { heading: string; text: string };

const LOCAL = "Local islands are home to Maldivian communities: dress modestly away from marked bikini beaches, and alcohol is only served on resorts and liveaboards.";

export const ATOLL_DESCRIPTIONS: Record<string, Section[]> = {
  "haa-alif": [
    { heading: "About the atoll", text: "Haa Alif, officially Thiladhunmathi Uthuruburi, is the northernmost administrative atoll. It takes in Ihavandhippolhu, the country's northernmost natural atoll, and the north of Thiladhunmathi, and has 14 inhabited islands." },
    { heading: "History", text: "Utheemu is the birthplace of Sultan Mohamed Thakurufaanu, who drove out the Portuguese in the 16th century; his wooden palace, Utheemu Ganduvaru, still stands. Baarah built the warship of that campaign." },
    { heading: "Visiting", text: `Few tourists come this far north, so local islands feel quiet and unhurried. ${LOCAL}` },
  ],
  "haa-dhaalu": [
    { heading: "About the atoll", text: "Haa Dhaalu, officially Thiladhunmathi Dhekunuburi, is the southern part of Thiladhunmathi plus little Makunudhoo Atoll. Kulhudhuffushi has been the capital since 1992, taking over from Nolhivaranfaru." },
    { heading: "Getting here", text: "It is the gateway to the far north: Hanimaadhoo has an international airport and Kulhudhuffushi a domestic one, with boats on to the islands of Haa Alif." },
    { heading: "Visiting", text: `Hanimaadhoo mixes a local community with a small hotel scene. ${LOCAL}` },
  ],
  shaviyani: [
    { heading: "About the atoll", text: "Shaviyani is the northern half of Miladhunmadulu Atoll. Funadhoo is the capital, after a long dispute in 2009–2011 in which the atoll office moved to Milandhoo and back." },
    { heading: "Visiting", text: `It sees few visitors, with long beaches and small fishing communities on its 14 inhabited islands. ${LOCAL}` },
  ],
  noonu: [
    { heading: "About the atoll", text: "Noonu is the southern half of Miladhunmadulu Atoll, with Manadhoo as its capital and about 12,500 people at the 2022 census." },
    { heading: "Visiting", text: `Resort islands here sit among quiet local ones, and the reefs see few boats. ${LOCAL}` },
  ],
  raa: [
    { heading: "About the atoll", text: "Raa is the northern part of Maalhosmadulu Atoll, with 15 inhabited islands and long, lightly visited reefs." },
    { heading: "Local craft", text: "Alifushi is known for building boats, including the traditional wooden dhoni." },
    { heading: "Visiting", text: `New resorts have opened here in recent years, but local islands stay low-key. ${LOCAL}` },
  ],
  baa: [
    { heading: "About the atoll", text: "Baa is the southern part of Maalhosmadulu Atoll, and the whole atoll is a UNESCO Biosphere Reserve." },
    { heading: "Mantas at Hanifaru", text: "From June to November, plankton draws feeding manta rays into Hanifaru Bay, sometimes in groups of a hundred or more. Snorkelling there is regulated to protect them." },
    { heading: "Visiting", text: `Dharavandhoo has guesthouses and a domestic airport close to Hanifaru. ${LOCAL}` },
  ],
  lhaviyani: [
    { heading: "About the atoll", text: "Lhaviyani is Faadhippolhu to Maldivians. Naifaru is the capital, only a handful of islands are inhabited, and Felivaru has the country's only fish cannery." },
    { heading: "History", text: "Maafilaafushi was the seat of a breakaway northern kingdom in the early 1600s, and was resettled in the 1980s to ease crowding in Malé." },
    { heading: "Visiting", text: `Most visitors stay on resort islands reached by seaplane. ${LOCAL}` },
  ],
  male: [
    { heading: "About the atoll", text: "Kaafu wraps around Malé, the capital, and Velana International Airport on Hulhulé. Hulhumalé, built on reclaimed land next to the airport, is the capital's newest town." },
    { heading: "Local islands", text: "Maafushi, Thulusdhoo, Dhiffushi, Guraidhoo and Huraa have guesthouses within an hour or two of the airport by speedboat or ferry; Thulusdhoo is known for its surf break." },
    { heading: "Visiting", text: LOCAL },
  ],
  "alif-alif": [
    { heading: "About the atoll", text: "Alif Alif, or North Ari, was created on 1 March 1984 from the north of Ari Atoll, little Rasdhoo Atoll and the lone island of Thoddoo." },
    { heading: "History", text: "Many islands have been lived on since ancient times, and some have remains from the Buddhist period. Maalhos is the atoll's westernmost island." },
    { heading: "Visiting", text: `Rasdhoo, Ukulhas and Thoddoo are popular local islands for divers and snorkellers. ${LOCAL}` },
  ],
  "alif-dhaal": [
    { heading: "About the atoll", text: "Alif Dhaal, or South Ari, was split from Ari Atoll in 1984, south of the Himendhoo and Genburugau channels." },
    { heading: "Whale sharks", text: "Whale sharks live along South Ari's outer reef all year, which makes it one of the most reliable places to see them." },
    { heading: "History", text: "Fenfushi has an old mosque with carved wooden ceilings and lacquerwork, and Buddhist remains, including a stupa, have been found on Ariadhoo." },
  ],
  vaavu: [
    { heading: "About the atoll", text: "Vaavu, Felidhe Atoll, is one of the smallest and least populated atolls, with five inhabited islands." },
    { heading: "Diving", text: "It is known for channel dives, and for nurse sharks at Alimatha." },
    { heading: "Visiting", text: `Fulidhoo and Thinadhoo have small guesthouses. ${LOCAL}` },
  ],
  meemu: [
    { heading: "About the atoll", text: "Meemu is Mulaku Atoll, south of Vaavu." },
    { heading: "History", text: "Kolhufushi has a mosque of historic value, and the 1573 wreck of the Kalhuohfummi lies off the south-eastern reef of Kolhuvaariyaafushi." },
    { heading: "Visiting", text: `Quiet reefs and few boats; Muli is the capital. ${LOCAL}` },
  ],
  faafu: [
    { heading: "About the atoll", text: "Faafu is the northern Nilandhe Atoll, smaller than its sister Dhaalu across a 6 km channel." },
    { heading: "History", text: "Some islands, like Himithi, were once inhabited before their people moved to larger islands so that Friday prayers could be held." },
    { heading: "Visiting", text: LOCAL },
  ],
  dhaalu: [
    { heading: "About the atoll", text: "Dhaalu is southern Nilandhe Atoll, 23 km wide and 38 km long, with seven inhabited islands and Kudahuvadhoo as its capital." },
    { heading: "Crafts", text: "Hulhudheli and Rinbudhoo are known for generations of skilled jewellers." },
    { heading: "Nature", text: "On Gemendhoo's reef a line of uninhabited islands runs from Bulhalafushi to Naibukaloabodufushi, a route that can be walked at low tide. Vaanee was abandoned after the 2004 tsunami." },
  ],
  thaa: [
    { heading: "About the atoll", text: "Thaa is Kolhumadulu, named Kolhumaduva in the time of King Koimala, who first united the atolls under one kingdom. It has thirteen inhabited islands." },
    { heading: "History", text: "Kinbidhoo has the ruins of a large Buddhist stupa, and Kanimeedhoo has Buddhist-era remains along with old mosques, wells and bathing tanks." },
    { heading: "Visiting", text: `Its waters are rich fishing grounds, and fishing still shapes island life. ${LOCAL}` },
  ],
  laamu: [
    { heading: "About the atoll", text: "Laamu is Haddhunmathi, a classic ring-shaped atoll with Fonadhoo as its capital. Large islands line its eastern rim." },
    { heading: "Geography", text: "It marks the southern edge of the central Maldives; beyond it, the wide Huvadhu Kandu channel separates the southern atolls." },
    { heading: "Visiting", text: `Gan and Fonadhoo are linked to neighbouring islands by road. ${LOCAL}` },
  ],
  "gaafu-alif": [
    { heading: "About the atoll", text: "Gaafu Alif is the north-eastern part of Huvadhu, one of the largest atolls in the world, made a separate district on 8 February 1962. Villingili is the capital." },
    { heading: "Visiting", text: `Remote resorts and deep channels draw divers; local islands see few visitors. ${LOCAL}` },
  ],
  "gaafu-dhaalu": [
    { heading: "About the atoll", text: "Gaafu Dhaalu is the south-western part of Huvadhu, about 340 km south of Malé, with more than 150 islands and Thinadhoo as its capital." },
    { heading: "Visiting", text: `Kaadedhdhoo's domestic airport is the way in. ${LOCAL}` },
  ],
  fuvahmulah: [
    { heading: "About the island", text: "Fuvahmulah is a single large island that forms an atoll of its own, Gnaviyani. Its people speak their own dialect of Dhivehi." },
    { heading: "History", text: "The name comes from fuvah, the areca nut once plentiful here. The ruins of a Buddhist stupa, the Havitta, still stand about 12 m high." },
    { heading: "Visiting", text: `Divers come for the tiger sharks off the harbour. ${LOCAL}` },
  ],
  addu: [
    { heading: "About the atoll", text: "Addu, Seenu Atoll, is the southernmost atoll and lies south of the equator. Several of its islands are linked by causeway into Addu City." },
    { heading: "Visiting", text: `Cycle between islands, look for green turtles and explore the wetlands. ${LOCAL}` },
  ],
};

/** Gives each atoll its longer description, unless it already has one. */
export const withDescriptions = (atolls: Atoll[]): Atoll[] =>
  atolls.map((a) => (a.body?.length || !ATOLL_DESCRIPTIONS[a.slug] ? a : { ...a, body: ATOLL_DESCRIPTIONS[a.slug] }));
