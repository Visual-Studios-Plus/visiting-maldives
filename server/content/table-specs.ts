/*
 * How each content collection is stored in its own tables: one row per entry with a column per
 * field, and a child table for each list of objects (facts, photos, sections, reviews...). Lists
 * of plain words (a guide's tags, an atoll's island names) are Postgres text[] columns.
 *
 * The same description drives reading (rows → the objects the site uses), writing (a changed
 * list → only the row changes needed, tables.ts) and the Prisma models (scripts/gen-content-models.ts),
 * so the three can't drift apart. Places to stay have their own module (stays-table.ts).
 *
 * Field types: s = text, i = whole number, f = decimal, b = yes/no, ss = list of words (text[]).
 * `opt`: may be missing; `col`: the Prisma field name when the entry's name can't be used.
 */

export type ColType = "s" | "i" | "f" | "b" | "ss";
export type Col = { f: string; t: ColType; opt?: boolean; col?: string; unique?: boolean; index?: boolean };
export type Child = { f: string; model: string; rel: string; table: string; doc: string; cols: Col[]; opt?: boolean };
/** An object field that may be missing as a whole (an atoll's `islands`): stored as a yes/no flag plus its parts. */
export type Group = { path: string; flag: string };
export type TableSpec = { key: string; model: string; table: string; doc: string; cols: Col[]; children: Child[]; groups?: Group[] };

const photos = (model: string, table: string, f = "gallery"): Child => ({
  f, model, rel: "photos", table, doc: "A photo in the gallery.", opt: true,
  cols: [{ f: "src", t: "s" }, { f: "alt", t: "s" }, { f: "caption", t: "s", opt: true }],
});
const textSections = (f: string, model: string, table: string, opt = false): Child => ({
  f, model, rel: "sections", table, doc: "A heading and its text, shown as a numbered section.", opt,
  cols: [{ f: "heading", t: "s" }, { f: "text", t: "s" }],
});
const facts = (model: string, table: string, opt = false): Child => ({
  f: "facts", model, rel: "facts", table, doc: "A label and value shown at a glance.", opt,
  cols: [{ f: "label", t: "s" }, { f: "value", t: "s" }],
});
const reviews = (model: string, table: string): Child => ({
  f: "reviews", model, rel: "reviews", table, doc: "A guest review.", opt: true,
  cols: [{ f: "author", t: "s" }, { f: "from", t: "s" }, { f: "date", t: "s" }, { f: "rating", t: "f" }, { f: "text", t: "s" }],
});
const place: Col[] = [
  { f: "atoll", t: "s", opt: true },
  { f: "atollSlug", t: "s", opt: true, index: true },
  { f: "island", t: "s", opt: true },
];

export const TABLE_SPECS: TableSpec[] = [
  {
    key: "guides", model: "Guide", table: "guides", doc: "A guide (things to do), published at /guides/<slug>.",
    cols: [
      { f: "slug", t: "s", unique: true }, { f: "title", t: "s" }, { f: "short", t: "s" }, { f: "summary", t: "s" },
      { f: "category", t: "s", index: true }, { f: "atoll", t: "s" }, { f: "season", t: "s" }, { f: "read", t: "i" }, { f: "image", t: "s" },
    ],
    children: [textSections("body", "GuideSection", "guide_sections"), facts("GuideFact", "guide_facts"), photos("GuidePhoto", "guide_photos")],
  },
  {
    key: "atolls", model: "Atoll", table: "atolls", doc: "An atoll (or a single-island profile with `parent` set), published at /atolls/<slug>.",
    cols: [
      { f: "slug", t: "s", unique: true }, { f: "name", t: "s" }, { f: "dhivehi", t: "s" }, { f: "region", t: "s" }, { f: "tagline", t: "s" },
      { f: "intro", t: "s" }, { f: "bestFor", t: "ss" }, { f: "transfer", t: "s" }, { f: "image", t: "s" },
      { f: "parent", t: "s", opt: true, index: true },
      { f: "islands.inhabited", t: "ss" }, { f: "islands.uninhabited", t: "ss" }, { f: "islands.resortIslands", t: "ss", opt: true },
    ],
    groups: [{ path: "islands", flag: "hasIslands" }],
    children: [
      photos("AtollPhoto", "atoll_photos"),
      textSections("body", "AtollSection", "atoll_sections", true),
      facts("AtollFact", "atoll_facts", true),
      {
        f: "islands.resorts", model: "AtollResort", rel: "resorts", table: "atoll_resorts", doc: "A resort island: one island, one resort.",
        cols: [{ f: "island", t: "s" }, { f: "resort", t: "s" }],
      },
      {
        f: "islands.halfResort", model: "AtollHalfResort", rel: "halfResorts", table: "atoll_half_resorts", opt: true,
        doc: "An island that is part local community, part resort or hotel.",
        cols: [{ f: "island", t: "s" }, { f: "resort", t: "s" }],
      },
    ],
  },
  {
    key: "islands", model: "Island", table: "islands", doc: "An island page, /atolls/<atoll>/islands/<slug>, and its card on the atoll page.",
    cols: [
      { f: "slug", t: "s", index: true }, { f: "name", t: "s" }, { f: "atoll", t: "s" }, { f: "atollSlug", t: "s", opt: true, index: true },
      { f: "kind", t: "s" }, { f: "tagline", t: "s", opt: true }, { f: "description", t: "s" },
      { f: "population", t: "i", opt: true }, { f: "populationYear", t: "s", opt: true }, { f: "area", t: "f", opt: true },
      { f: "image", t: "s", opt: true }, { f: "imageCredit", t: "s", opt: true }, { f: "imageSource", t: "s", opt: true },
      { f: "source", t: "s", opt: true }, { f: "lat", t: "f", opt: true }, { f: "lng", t: "f", opt: true },
      { f: "highlights", t: "ss", opt: true }, { f: "gettingThere", t: "s", opt: true },
    ],
    children: [photos("IslandPhoto", "island_photos"), textSections("sections", "IslandSection", "island_sections", true)],
  },
  {
    key: "eats", model: "Eat", table: "eats", doc: "A place to eat, published at /eat-drink/<slug>.",
    cols: [
      { f: "slug", t: "s", opt: true, index: true }, { f: "name", t: "s" }, { f: "kind", t: "s" }, ...place,
      { f: "area", t: "s" }, { f: "price", t: "s" }, { f: "dish", t: "s" }, { f: "image", t: "s" },
      { f: "about", t: "s", opt: true }, { f: "hours", t: "s", opt: true }, { f: "rating", t: "f", opt: true },
      { f: "address", t: "s", opt: true }, { f: "lat", t: "f", opt: true }, { f: "lng", t: "f", opt: true },
    ],
    children: [
      {
        f: "recommends", model: "EatRecommend", rel: "recommends", table: "eat_recommends", opt: true,
        doc: "A dish worth ordering here, with a short reason.", cols: [{ f: "dish", t: "s" }, { f: "note", t: "s" }],
      },
      reviews("EatReview", "eat_reviews"),
    ],
  },
  {
    key: "dishes", model: "Dish", table: "dishes", doc: "A dish to know, in \"What to eat\".",
    cols: [
      { f: "name", t: "s" }, { f: "local", t: "s", opt: true }, { f: "kind", t: "s" }, { f: "text", t: "s" },
      { f: "whereToTry", t: "s", opt: true }, { f: "image", t: "s" }, { f: "vegetarian", t: "b", opt: true },
    ],
    children: [],
  },
  {
    key: "events", model: "Event", table: "events", doc: "A date in the year (What's on).",
    cols: [{ f: "month", t: "s" }, { f: "title", t: "s" }, { f: "text", t: "s" }, { f: "where", t: "s", col: "place" }],
    children: [],
  },
  {
    key: "essentials", model: "Essential", table: "essentials", doc: "A practical fact for planning a trip.",
    cols: [{ f: "label", t: "s" }, { f: "big", t: "s" }, { f: "text", t: "s" }, { f: "href", t: "s", opt: true }],
    children: [],
  },
  {
    key: "salons", model: "Salon", table: "salons", doc: "A salon, spa or barber, published at /salons/<slug>.",
    cols: [
      { f: "slug", t: "s", opt: true, index: true }, { f: "name", t: "s" }, { f: "kind", t: "s" }, { f: "services", t: "ss", opt: true },
      ...place, { f: "area", t: "s" }, { f: "address", t: "s", opt: true }, { f: "lat", t: "f", opt: true }, { f: "lng", t: "f", opt: true },
      { f: "rating", t: "f", opt: true }, { f: "image", t: "s" }, { f: "about", t: "s", opt: true }, { f: "hours", t: "s", opt: true },
      { f: "phone", t: "s", opt: true }, { f: "link", t: "s", opt: true },
    ],
    children: [reviews("SalonReview", "salon_reviews")],
  },
  {
    key: "sections", model: "PageSection", table: "page_sections", doc: "A section built in the dashboard (Page sections).",
    cols: [
      { f: "title", t: "s" }, { f: "published", t: "b" }, { f: "order", t: "i", opt: true, col: "displayOrder" },
      { f: "placement", t: "s" }, { f: "scope", t: "s" }, ...place,
      { f: "pageSlug", t: "s", opt: true, index: true }, { f: "pageTitle", t: "s", opt: true },
      { f: "position", t: "s", col: "slot" }, { f: "eyebrow", t: "s", opt: true }, { f: "intro", t: "s", opt: true },
      { f: "block", t: "s" }, { f: "source", t: "s", opt: true }, { f: "area", t: "s", opt: true }, { f: "kindFilter", t: "s", opt: true },
      { f: "limit", t: "i", opt: true, col: "maxItems" }, { f: "body", t: "s", opt: true }, { f: "image", t: "s", opt: true },
      { f: "imageSide", t: "s", opt: true }, { f: "buttonLabel", t: "s", opt: true }, { f: "buttonLink", t: "s", opt: true },
    ],
    children: [
      {
        f: "items", model: "PageSectionItem", rel: "items", table: "page_section_items", opt: true,
        doc: "A hand-picked card, photo or link in a section.",
        cols: [{ f: "title", t: "s" }, { f: "text", t: "s", opt: true }, { f: "image", t: "s", opt: true }, { f: "link", t: "s", opt: true }],
      },
    ],
  },
];

/** The Prisma field for a column: its `col`, else the path in camelCase ("islands.inhabited" → "islandsInhabited"). */
export const fieldName = (c: { f: string; col?: string }) => c.col ?? c.f.replace(/\.(\w)/g, (_, x: string) => x.toUpperCase());

/** The database column: snake_case of the Prisma field. */
export const columnName = (field: string) => field.replace(/[A-Z]/g, (x) => `_${x.toLowerCase()}`);

/** Prisma delegate name for a model ("PageSection" → "pageSection"). */
export const delegateName = (model: string) => model[0].toLowerCase() + model.slice(1);
