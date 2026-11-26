/*
 * What the dashboard can edit, and how each field is edited and validated.
 * Plain data only (no functions), so it can be passed to the dashboard's client components.
 */

export type ScalarField =
  | { name: string; label: string; type: "text" | "textarea" | "image" | "link"; required?: boolean; help?: string; placeholder?: string }
  | { name: string; label: string; type: "number"; required?: boolean; help?: string; min?: number; max?: number; step?: number }
  | { name: string; label: string; type: "select"; required?: boolean; help?: string; options: string[] }
  /** A dropdown of the atolls, filled from the Atolls collection at edit time. */
  | { name: string; label: string; type: "atoll"; required?: boolean; help?: string }
  /** A dropdown of the islands in the atoll chosen in this entry's "atoll" field. */
  | { name: string; label: string; type: "island"; required?: boolean; help?: string }
  /** Stored but not shown in the form (e.g. an atoll's page address kept alongside its name). */
  | { name: string; type: "hidden"; label?: string; help?: string; placeholder?: string; required?: boolean }
  | { name: string; label: string; type: "checkbox"; help?: string }
  | { name: string; label: string; type: "tags"; help?: string; placeholder?: string };

export type GroupField = {
  name: string;
  label: string;
  type: "group";
  help?: string;
  /** Short name for one entry, e.g. "section" → "Add section" */
  itemLabel: string;
  fields: ScalarField[];
};

export type Field = ScalarField | GroupField;

export type CollectionKey = "guides" | "atolls" | "islands" | "stays" | "dishes" | "eats" | "salons" | "sections" | "events" | "essentials";

export type CollectionDef = {
  key: CollectionKey;
  label: string;
  singular: string;
  description: string;
  /** Field shown as each entry's title in lists */
  titleField: string;
  subtitleField?: string;
  imageField?: string;
  /** Field that must be unique and URL-safe (used in page addresses) */
  slugField?: string;
  /** Public page for one entry, with {field} placeholders, e.g. "/guides/{slug}" */
  itemPath?: string;
  /** Public page that lists the collection */
  listPath: string;
  fields: Field[];
};

export const CATEGORY_OPTIONS = ["Marine life", "Heritage", "Islands", "Food", "Adventure"];

const IMAGE_HELP = "Upload a photo (drag it here or choose a file), or enter an Unsplash photo ID or a path like /photos/hukuru-miskiy.jpg. Shown on cards and at the top of the page.";
const SLUG_HELP = "Lower-case words joined by hyphens. Used in the page address, so changing it breaks existing links.";

export const COLLECTIONS: CollectionDef[] = [
  {
    key: "guides",
    label: "Guides",
    singular: "guide",
    description: "Travel guides: the homepage carousel, Things to do, atoll pages and each guide's own page.",
    titleField: "title",
    subtitleField: "category",
    imageField: "image",
    slugField: "slug",
    itemPath: "/guides/{slug}",
    listPath: "/things-to-do",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, placeholder: "Manta season at Hanifaru Bay" },
      { name: "short", label: "Short title", type: "text", required: true, help: "Used on cards, where space is tight." },
      { name: "slug", label: "Page address", type: "text", required: true, help: SLUG_HELP },
      { name: "summary", label: "Summary", type: "textarea", required: true, help: "One or two sentences, shown on cards and at the top of the guide." },
      { name: "category", label: "Category", type: "select", required: true, options: CATEGORY_OPTIONS },
      { name: "atoll", label: "Atoll or area", type: "text", required: true },
      { name: "season", label: "Best season", type: "text", required: true, placeholder: "Jun–Nov" },
      { name: "read", label: "Reading time (minutes)", type: "number", required: true, min: 1, max: 60 },
      { name: "image", label: "Cover photo", type: "image", required: true, help: IMAGE_HELP },
      {
        name: "gallery",
        label: "Photo gallery",
        type: "group",
        itemLabel: "photo",
        help: "Extra photos shown in a gallery on the page. The cover photo above is the one used on cards.",
        fields: [
          { name: "src", label: "Photo", type: "image", required: true },
          { name: "alt", label: "Describe the photo", type: "text", required: true, help: "For people using screen readers, e.g. “Manta rays feeding at the surface”." },
          { name: "caption", label: "Caption (optional)", type: "text" },
        ],
      },
      {
        name: "body",
        label: "Sections",
        type: "group",
        itemLabel: "section",
        help: "The guide itself, one heading and paragraph per section.",
        fields: [
          { name: "heading", label: "Heading", type: "text", required: true },
          { name: "text", label: "Text", type: "textarea", required: true },
        ],
      },
      {
        name: "facts",
        label: "Key facts",
        type: "group",
        itemLabel: "fact",
        help: "Short facts shown in the side panel, e.g. Best months / Jun–Nov.",
        fields: [
          { name: "label", label: "Label", type: "text", required: true },
          { name: "value", label: "Value", type: "text", required: true },
        ],
      },
    ],
  },
  {
    key: "atolls",
    label: "Atolls",
    singular: "atoll",
    description: "Atoll pages and the atoll lists on Explore and Atolls.",
    titleField: "name",
    subtitleField: "region",
    imageField: "image",
    slugField: "slug",
    itemPath: "/atolls/{slug}",
    listPath: "/atolls",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Page address", type: "text", required: true, help: SLUG_HELP },
      { name: "dhivehi", label: "Name in Dhivehi", type: "text" },
      { name: "region", label: "Region", type: "select", required: true, options: ["North", "Central", "South"] },
      { name: "tagline", label: "Tagline", type: "text", required: true },
      { name: "intro", label: "Introduction", type: "textarea", required: true },
      { name: "bestFor", label: "Best for", type: "tags", help: "Press Enter or comma after each one.", placeholder: "Diving" },
      { name: "transfer", label: "Transfer", type: "text", required: true, placeholder: "Seaplane · 35 min" },
      { name: "image", label: "Cover photo", type: "image", required: true, help: IMAGE_HELP },
      {
        name: "gallery",
        label: "Photo gallery",
        type: "group",
        itemLabel: "photo",
        help: "Extra photos shown in a gallery on the page. The cover photo above is the one used on cards.",
        fields: [
          { name: "src", label: "Photo", type: "image", required: true },
          { name: "alt", label: "Describe the photo", type: "text", required: true, help: "For people using screen readers, e.g. “Manta rays feeding at the surface”." },
          { name: "caption", label: "Caption (optional)", type: "text" },
        ],
      },
      // Resorts are not edited here: every resort island is a "place to stay" (see the stays
      // collection), where its atoll is selected. The atoll keeps only its name lists.
      { name: "islands.inhabited", label: "Inhabited islands", type: "tags", help: "Press Enter or comma after each.", placeholder: "Island name" },
      { name: "islands.uninhabited", label: "Uninhabited islands", type: "tags", help: "Press Enter or comma after each.", placeholder: "Island name" },
    ],
  },
  {
    key: "islands",
    label: "Islands",
    singular: "island",
    description: "Every island with its own page: description, population and photos. An inhabited island added here also shows on its atoll's page.",
    titleField: "name",
    subtitleField: "atoll",
    imageField: "image",
    slugField: "slug",
    listPath: "/atolls",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, placeholder: "Maafushi" },
      { name: "slug", label: "Page address", type: "text", required: true, help: SLUG_HELP },
      { name: "atoll", label: "Atoll", type: "atoll", required: true, help: "Choose the atoll; the island then shows on that atoll's page." },
      // kept in step with `atoll` by the editor, so listings never depend on free text
      { name: "atollSlug", type: "hidden" },
      { name: "kind", label: "Type", type: "select", required: true, options: ["Inhabited", "Resort island", "Uninhabited"] },
      { name: "tagline", label: "Short line", type: "text", placeholder: "Guesthouses, surf and sandbanks", help: "Shown under the name on the island's card." },
      { name: "description", label: "Description", type: "textarea", required: true, help: "Shown at the top of the island's page." },
      { name: "population", label: "Population", type: "number", min: 0, step: 1 },
      { name: "populationYear", label: "Population year", type: "text", placeholder: "2022" },
      { name: "area", label: "Area (km²)", type: "number", min: 0, step: 0.01 },
      { name: "image", label: "Cover photo", type: "image", help: IMAGE_HELP },
      { name: "imageCredit", label: "Photo credit", type: "text", help: "For a photo you didn't take, e.g. \"Name, CC BY-SA 4.0\"." },
      { name: "imageSource", label: "Photo source link", type: "link" },
      {
        name: "gallery",
        label: "Photo gallery",
        type: "group",
        itemLabel: "photo",
        help: "Extra photos shown on the island's page.",
        fields: [
          { name: "src", label: "Photo", type: "image", required: true },
          { name: "alt", label: "Description", type: "text", required: true, help: "What the photo shows, for people who can't see it." },
        ],
      },
      { name: "source", label: "Facts source", type: "link", help: "Where the population and other facts come from, e.g. a Wikipedia article." },
      { name: "highlights", label: "Highlights", type: "tags", placeholder: "Bikini beach", help: "Short things worth knowing, shown as chips: \"Bikini beach\", \"Dive centre\", \"ATM\", \"Hospital\". Press Enter after each." },
      { name: "gettingThere", label: "Getting there", type: "textarea", help: "How to reach the island. Leave empty to use the atoll's usual transfer." },
      {
        name: "sections",
        label: "Guide sections",
        type: "group",
        itemLabel: "section",
        help: "Longer write-ups shown on the island's page, e.g. \"Things to do\", \"Where to swim\", \"Food\".",
        fields: [
          { name: "heading", label: "Heading", type: "text", required: true, placeholder: "Things to do" },
          { name: "text", label: "Text", type: "textarea", required: true },
        ],
      },
      { name: "lat", label: "Map latitude", type: "number", min: -90, max: 90, step: 0.000001, help: "Leave empty to use the government register's position. In Google Maps, right-click the island and copy the first number." },
      { name: "lng", label: "Map longitude", type: "number", min: -180, max: 180, step: 0.000001, help: "The second number." },
    ],
  },
  {
    key: "stays",
    label: "Places to stay",
    singular: "place to stay",
    description: "Every resort, resort island, hotel, guesthouse and liveaboard. Each is published at /stay and appears under the atoll picked in its entry.",
    titleField: "name",
    subtitleField: "atoll",
    imageField: "image",
    slugField: "slug",
    itemPath: "/stay/{slug}",
    listPath: "/stay",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Page address", type: "text", required: true, help: SLUG_HELP },
      { name: "type", label: "Type", type: "select", required: true, options: ["Resort", "Resort island", "Hotel", "Guesthouse", "Homestay", "Liveaboard", "Marina"] },
      { name: "atoll", label: "Atoll", type: "atoll", help: "Choose the atoll this place is in; it then appears on that atoll's page. Leave empty for a liveaboard that cruises several atolls." },
      // kept in step with `atoll` by the editor, so atoll listings never depend on free text
      { name: "atollSlug", type: "hidden" },
      { name: "island", label: "Island", type: "island", help: "Choose the island (pick the atoll first). The place then appears on that island's page." },
      { name: "lat", label: "Map latitude", type: "number", min: -90, max: 90, step: 0.000001, help: "Puts the place on its island's map. In Google Maps, right-click it and copy the first number." },
      { name: "lng", label: "Map longitude", type: "number", min: -180, max: 180, step: 0.000001, help: "The second number." },
      { name: "price", label: "Price", type: "text", required: true, placeholder: "From USD 650" },
      { name: "rating", label: "Our rating (out of 5)", type: "number", min: 0, max: 5, step: 0.1, help: "Leave empty for a resort island we have not rated yet." },
      { name: "note", label: "Short note", type: "text", required: true, help: "One line on the card." },
      { name: "rooms", label: "Rooms (cabins for a liveaboard)", type: "number", min: 0, step: 1 },
      { name: "beds", label: "Beds", type: "number", min: 0, step: 1 },
      { name: "berths", label: "Yacht berths (marinas)", type: "number", min: 0, step: 1 },
      { name: "phone", label: "Phone", type: "text", placeholder: "+960 333 4455", help: "Shown in the Contact section of the page. Separate several with commas." },
      { name: "email", label: "Email", type: "text", placeholder: "reservations@example.com", help: "Separate several with commas." },
      { name: "website", label: "Website", type: "text", placeholder: "https://example.com" },
      { name: "licensed", label: "Licensed by the Ministry of Tourism", type: "checkbox", help: "Listed in the government register of tourist accommodation." },
      { name: "about", label: "About", type: "textarea", required: true },
      { name: "image", label: "Cover photo", type: "image", required: true, help: IMAGE_HELP },
      {
        name: "gallery",
        label: "Photo gallery",
        type: "group",
        itemLabel: "photo",
        help: "Extra photos shown in a gallery on the page. The cover photo above is the one used on cards.",
        fields: [
          { name: "src", label: "Photo", type: "image", required: true },
          { name: "alt", label: "Describe the photo", type: "text", required: true, help: "For people using screen readers, e.g. “Manta rays feeding at the surface”." },
          { name: "caption", label: "Caption (optional)", type: "text" },
        ],
      },
      { name: "partner", label: "Partner listing", type: "checkbox", help: "Shows a “Partner” label. Required for paid listings." },
      { name: "amenities", label: "What's included", type: "tags", placeholder: "House reef" },
      {
        name: "facts",
        label: "Key facts",
        type: "group",
        itemLabel: "fact",
        fields: [
          { name: "label", label: "Label", type: "text", required: true },
          { name: "value", label: "Value", type: "text", required: true },
        ],
      },
      {
        name: "reviews",
        label: "Guest reviews",
        type: "group",
        itemLabel: "review",
        help: "Only publish real, verified reviews.",
        fields: [
          { name: "author", label: "Name", type: "text", required: true },
          { name: "from", label: "From", type: "text", required: true, placeholder: "United Kingdom" },
          { name: "date", label: "Date", type: "text", required: true, placeholder: "Oct 2026" },
          { name: "rating", label: "Rating", type: "number", required: true, min: 1, max: 5, step: 1 },
          { name: "text", label: "Review", type: "textarea", required: true },
        ],
      },
    ],
  },
  {
    key: "dishes",
    label: "Dishes",
    singular: "dish",
    description: "“What to eat” on the Eat & drink page: Maldivian dishes and drinks to try.",
    titleField: "name",
    subtitleField: "kind",
    imageField: "image",
    listPath: "/eat-drink",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, placeholder: "Mas huni" },
      { name: "local", label: "Name in Dhivehi (optional)", type: "text" },
      { name: "kind", label: "Kind", type: "select", required: true, options: ["Breakfast", "Mains", "Short eats", "Sweets", "Drinks"] },
      { name: "text", label: "What it is", type: "textarea", required: true, help: "One or two sentences: what's in it and how it's eaten." },
      { name: "whereToTry", label: "Where to try it", type: "text", placeholder: "Any hotaa (teashop) in Malé, at breakfast" },
      { name: "image", label: "Photo", type: "image", required: true, help: IMAGE_HELP },
      { name: "vegetarian", label: "Vegetarian", type: "checkbox" },
    ],
  },
  {
    key: "eats",
    label: "Eat & drink",
    singular: "place to eat",
    description: "Cafés and restaurants on the Eat & drink page, with what to order at each.",
    titleField: "name",
    subtitleField: "area",
    imageField: "image",
    slugField: "slug",
    itemPath: "/eat-drink/{slug}",
    listPath: "/eat-drink",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Page address", type: "text", required: true, help: SLUG_HELP },
      { name: "kind", label: "Kind", type: "text", required: true, placeholder: "Local café" },
      { name: "atoll", label: "Atoll", type: "atoll", required: true, help: "Choose the atoll; the place then shows on that atoll's page." },
      // kept in step with `atoll` by the editor, so listings never depend on free text
      { name: "atollSlug", type: "hidden" },
      { name: "island", label: "Island", type: "island", help: "Choose the island (pick the atoll first). The place then shows on that island's page and, with a map position below, on its map." },
      { name: "area", label: "Area (optional)", type: "text", placeholder: "Harbour side", help: "Extra detail shown on cards, e.g. a street or neighbourhood. Leave empty to show the island and atoll." },
      { name: "price", label: "Typical price", type: "text", required: true, placeholder: "MVR 60" },
      { name: "dish", label: "Signature dish", type: "text", required: true, help: "The one thing to order. Shown first on the card." },
      { name: "about", label: "About (one line)", type: "text", placeholder: "Locals’ teashop by the harbour; busiest at breakfast." },
      { name: "hours", label: "Opening hours", type: "text", placeholder: "Daily 6:00–23:00" },
      { name: "rating", label: "Our rating (out of 5)", type: "number", min: 0, max: 5, step: 0.1 },
      { name: "address", label: "Address", type: "text", placeholder: "Boduthakurufaanu Magu, Malé" },
      { name: "lat", label: "Map latitude", type: "number", min: -90, max: 90, step: 0.000001, help: "Right-click the place in Google Maps and copy the first number (e.g. 4.1755)." },
      { name: "lng", label: "Map longitude", type: "number", min: -180, max: 180, step: 0.000001, help: "The second number (e.g. 73.5093)." },
      { name: "image", label: "Photo", type: "image", required: true, help: IMAGE_HELP },
      {
        name: "recommends",
        label: "What to order",
        type: "group",
        itemLabel: "recommendation",
        help: "Two or three dishes worth trying here, each with a short reason.",
        fields: [
          { name: "dish", label: "Dish", type: "text", required: true },
          { name: "note", label: "Why", type: "text", required: true, placeholder: "Made fresh every morning" },
        ],
      },
      {
        name: "reviews",
        label: "Guest reviews",
        type: "group",
        itemLabel: "review",
        help: "Only publish real, verified reviews.",
        fields: [
          { name: "author", label: "Name", type: "text", required: true },
          { name: "from", label: "From", type: "text", required: true, placeholder: "United Kingdom" },
          { name: "date", label: "Date", type: "text", required: true, placeholder: "Oct 2026" },
          { name: "rating", label: "Rating", type: "number", required: true, min: 1, max: 5, step: 1 },
          { name: "text", label: "Review", type: "textarea", required: true },
        ],
      },
    ],
  },
  {
    key: "salons",
    label: "Salons & spas",
    singular: "salon or spa",
    description: "Salons, spas and barbers: each has its own page, and shows on its atoll's and island's pages.",
    titleField: "name",
    subtitleField: "island",
    imageField: "image",
    slugField: "slug",
    itemPath: "/salons/{slug}",
    listPath: "/salons",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Page address", type: "text", required: true, help: SLUG_HELP },
      { name: "kind", label: "Kind", type: "text", required: true, placeholder: "Spa" },
      { name: "services", label: "Services", type: "tags", help: "Press Enter or comma after each one.", placeholder: "Massage" },
      { name: "atoll", label: "Atoll", type: "atoll", required: true, help: "Choose the atoll; the salon then appears on that atoll's page." },
      // kept in step with `atoll` by the editor, so listings never depend on free text
      { name: "atollSlug", type: "hidden" },
      { name: "island", label: "Island", type: "island", required: true, help: "Choose the island (pick the atoll first). The salon then appears on that island's page." },
      { name: "area", label: "Area (optional)", type: "text", placeholder: "Harbour side", help: "Extra detail shown on cards, e.g. a neighbourhood. Leave empty to show the island and atoll." },
      { name: "about", label: "About (one line)", type: "text", placeholder: "Coconut-oil massages and hair braiding by the harbour." },
      { name: "hours", label: "Opening hours", type: "text", placeholder: "Daily 9:00–21:00" },
      { name: "phone", label: "Phone", type: "text", placeholder: "+960 ..." },
      { name: "link", label: "Website or booking link", type: "text", placeholder: "https://" },
      { name: "rating", label: "Our rating (out of 5)", type: "number", min: 0, max: 5, step: 0.1 },
      { name: "address", label: "Address", type: "text", placeholder: "Harbour road, Maafushi" },
      { name: "lat", label: "Map latitude", type: "number", min: -90, max: 90, step: 0.000001, help: "Right-click the place in Google Maps and copy the first number (e.g. 3.9434)." },
      { name: "lng", label: "Map longitude", type: "number", min: -180, max: 180, step: 0.000001, help: "The second number (e.g. 73.4907)." },
      { name: "image", label: "Photo", type: "image", required: true, help: IMAGE_HELP },
      {
        name: "reviews",
        label: "Guest reviews",
        type: "group",
        itemLabel: "review",
        help: "Only publish real, verified reviews.",
        fields: [
          { name: "author", label: "Name", type: "text", required: true },
          { name: "from", label: "From", type: "text", required: true, placeholder: "United Kingdom" },
          { name: "date", label: "Date", type: "text", required: true, placeholder: "Oct 2026" },
          { name: "rating", label: "Rating", type: "number", required: true, min: 1, max: 5, step: 1 },
          { name: "text", label: "Review", type: "textarea", required: true },
        ],
      },
    ],
  },
  {
    key: "sections",
    label: "Page sections",
    singular: "section",
    description:
      "Build your own sections from blocks (text, carousels, card grids, photos, links, buttons) and add them to island pages, atoll pages or a page of their own. They add to the built-in sections, never replace them.",
    titleField: "title",
    subtitleField: "placement",
    imageField: "image",
    listPath: "/atolls",
    fields: [
      { name: "title", label: "Heading", type: "text", required: true, placeholder: "Things to do" },
      { name: "published", label: "Published (show on the site)", type: "checkbox" },
      { name: "order", label: "Order", type: "number", min: 0, step: 1, help: "Lower numbers show first when several sections are in the same place." },
      { name: "placement", label: "Show on", type: "select", required: true, options: ["Island pages", "Atoll pages", "Its own page"] },
      { name: "scope", label: "Which ones", type: "select", required: true, options: ["Everywhere", "One atoll", "One island"], help: "For island and atoll pages: all of them, one atoll (and its islands), or one island." },
      { name: "atoll", label: "Atoll", type: "atoll", help: "For \"One atoll\" or \"One island\", and for blocks that show things from a chosen atoll." },
      { name: "atollSlug", type: "hidden" },
      { name: "island", label: "Island", type: "island", help: "For \"One island\" (pick the atoll first)." },
      { name: "pageSlug", label: "Page address (its own page)", type: "text", placeholder: "diving-guide", help: "For \"Its own page\": the page is at /p/<address>. Sections with the same address make up one page." },
      { name: "pageTitle", label: "Page title (its own page)", type: "text", placeholder: "Diving in the Maldives" },
      { name: "position", label: "Position on the page", type: "select", required: true, options: ["Main column", "Full width, at the end"] },
      { name: "eyebrow", label: "Small label above the heading", type: "text", placeholder: "Things to do" },
      { name: "intro", label: "Intro (one or two sentences)", type: "textarea" },
      { name: "block", label: "Block", type: "select", required: true, options: ["Text", "Carousel", "Card grid", "Image and text", "Photo gallery", "Link list", "Button"] },
      { name: "source", label: "Content (Carousel, Card grid)", type: "select", options: ["Places to stay", "Restaurants", "Salons", "Islands", "Guides", "Hand-picked items"], help: "Live content from the site, or the items you add below." },
      { name: "area", label: "From where (Carousel, Card grid)", type: "select", options: ["This page's island or atoll", "The atoll or island chosen above", "Everywhere"] },
      { name: "kindFilter", label: "Only this kind (optional)", type: "text", placeholder: "Guesthouse", help: "Show only one kind: e.g. \"Guesthouse\" or \"Resort\" for stays, \"Seafood\" for restaurants, \"Spa\" for salons, \"Marine life\" for guides." },
      { name: "limit", label: "How many to show", type: "number", min: 1, max: 60, step: 1, help: "Leave empty to show all." },
      { name: "body", label: "Text (Text, Image and text)", type: "textarea" },
      { name: "image", label: "Photo (Image and text)", type: "image", help: IMAGE_HELP },
      { name: "imageSide", label: "Photo side (Image and text)", type: "select", options: ["Left", "Right"] },
      { name: "buttonLabel", label: "Button label", type: "text", placeholder: "Plan your trip", help: "For the Button block, or a link button under any block." },
      { name: "buttonLink", label: "Button link", type: "link", placeholder: "/plan-your-trip" },
      {
        name: "items",
        label: "Hand-picked items",
        type: "group",
        itemLabel: "item",
        help: "For Hand-picked carousels and grids, Photo gallery and Link list.",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "text", label: "Short text", type: "text" },
          { name: "image", label: "Photo", type: "image" },
          { name: "link", label: "Link", type: "link", placeholder: "/atolls/baa" },
        ],
      },
    ],
  },
  {
    key: "events",
    label: "What's on",
    singular: "event",
    description: "Seasons, festivals and events on the What's on page.",
    titleField: "title",
    subtitleField: "month",
    listPath: "/whats-on",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "month", label: "When", type: "text", required: true, placeholder: "Jun–Nov or 26 Jul" },
      { name: "where", label: "Where", type: "text", required: true },
      { name: "text", label: "Description", type: "textarea", required: true },
    ],
  },
  {
    key: "essentials",
    label: "Essentials",
    singular: "essential",
    description: "The quick facts panel (time zone, money, power and so on) on Plan your trip.",
    titleField: "label",
    subtitleField: "big",
    listPath: "/plan-your-trip",
    fields: [
      { name: "label", label: "Label", type: "text", required: true, placeholder: "Money" },
      { name: "big", label: "Headline value", type: "text", required: true, placeholder: "MVR" },
      { name: "text", label: "Details", type: "textarea", required: true },
      { name: "href", label: "Link (optional)", type: "link", help: "A page on this site, e.g. /guides/seaplane-transfers, or a full https:// address." },
    ],
  },
];

export const getCollectionDef = (key: string) => COLLECTIONS.find((c) => c.key === key);

/** "/guides/{slug}" + an entry → "/guides/manta-season-hanifaru-bay" */
export const fillPath = (pattern: string, item: Record<string, unknown>) =>
  pattern.replace(/\{(\w+)\}/g, (_, k: string) => encodeURIComponent(String(item[k] ?? "")));
