/*
 * What the dashboard can edit, and how each field is edited and validated.
 * Plain data only (no functions), so it can be passed to the dashboard's client components.
 */

export type ScalarField =
  | { name: string; label: string; type: "text" | "textarea" | "image" | "link"; required?: boolean; help?: string; placeholder?: string }
  | { name: string; label: string; type: "number"; required?: boolean; help?: string; min?: number; max?: number; step?: number }
  | { name: string; label: string; type: "select"; required?: boolean; help?: string; options: string[] }
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

export type CollectionKey = "guides" | "atolls" | "stays" | "eats" | "events" | "essentials";

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
    ],
  },
  {
    key: "stays",
    label: "Places to stay",
    singular: "place to stay",
    description: "Hotels, guesthouses and liveaboards on the Stay page, each with its own page.",
    titleField: "name",
    subtitleField: "atoll",
    imageField: "image",
    slugField: "slug",
    itemPath: "/stay/{slug}",
    listPath: "/stay",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Page address", type: "text", required: true, help: SLUG_HELP },
      { name: "type", label: "Type", type: "select", required: true, options: ["Resort", "Guesthouse", "Liveaboard"] },
      { name: "atoll", label: "Atoll", type: "text", required: true },
      { name: "price", label: "Price", type: "text", required: true, placeholder: "From USD 650" },
      { name: "rating", label: "Our rating (out of 5)", type: "number", required: true, min: 0, max: 5, step: 0.1 },
      { name: "note", label: "Short note", type: "text", required: true, help: "One line on the card." },
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
    key: "eats",
    label: "Eat & drink",
    singular: "place to eat",
    description: "Cafés and restaurants on the Eat & drink page.",
    titleField: "name",
    subtitleField: "area",
    imageField: "image",
    listPath: "/eat-drink",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "kind", label: "Kind", type: "text", required: true, placeholder: "Local café" },
      { name: "area", label: "Area", type: "text", required: true },
      { name: "price", label: "Typical price", type: "text", required: true, placeholder: "MVR 60" },
      { name: "dish", label: "Dish to order", type: "text", required: true },
      { name: "image", label: "Photo", type: "image", required: true, help: IMAGE_HELP },
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
