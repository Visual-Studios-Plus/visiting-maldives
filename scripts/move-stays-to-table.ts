/*
 * One-time move: copies the places to stay from the old JSON row (site_content, key "stays")
 * into the stays tables (one column per field), checks the counts, then removes the JSON row.
 *
 *   npx prisma migrate deploy                                  create the tables first
 *   node --env-file=.env.local scripts/move-stays-to-table.ts   copy, check, keep the JSON row
 *   node --env-file=.env.local scripts/move-stays-to-table.ts --drop-json   …and then remove it
 *
 * Safe to re-run: it stops if the table already has stays. A copy of the JSON is written to
 * .data/stays-before-table.json first.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import { hasStays, readStays, writeStays, type StayItem } from "../server/content/stays-table.ts";

const url = new URL(process.env.DATABASE_URL ?? "");
url.searchParams.set("connect_timeout", "40");
const db = new PrismaClient({ datasourceUrl: url.toString() });
try {
  const old = await db.siteContent.findUnique({ where: { key: "stays" } });
  if (await hasStays(db)) {
    console.log("The stays table already has rows; nothing copied.");
  } else {
    if (!old) throw new Error('No JSON row "stays" to copy.');
    const items = old.data as unknown as StayItem[];
    mkdirSync(".data", { recursive: true });
    writeFileSync(".data/stays-before-table.json", JSON.stringify(items));
    const r = await writeStays(db, items, "move to table");
    console.log(`Copied ${r.added} stays into the table.`);
  }
  const now = await readStays(db);
  const count = now?.items.length ?? 0;
  const expected = old ? (old.data as unknown[]).length : count;
  if (count !== expected) throw new Error(`Count mismatch: table ${count}, JSON ${expected}. The JSON row was kept.`);
  console.log(`Check passed: ${count} stays in the table.`);
  if (process.argv.includes("--drop-json") && old) {
    await db.siteContent.delete({ where: { key: "stays" } });
    console.log('Removed the old JSON row "stays".');
  }
} finally {
  await db.$disconnect();
}
