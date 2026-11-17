import type { CustomSection } from "@/lib/data";

/** One hand-picked item of a section (card, link or photo). */
export type SectionItem = NonNullable<CustomSection["items"]>[number];
