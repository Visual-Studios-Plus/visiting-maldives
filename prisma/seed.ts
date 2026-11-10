/*
 * Loads the starting content (prisma/seed/content.ts) into the database.
 *
 *   npm run db:seed              fill collections that are still empty (safe: never overwrites edits)
 *   npm run db:seed -- --reset   replace every collection with the seed content (throws away edits)
 *   npm run db:seed -- --reset --only=eats,dishes   …only those collections
 *
 * Runs on every Vercel build after migrations (safe mode), so a new database gets its content.
 * Without DATABASE_URL (local development) it fills .data/content.json instead.
 * Run with Node 22.6+ (TypeScript is stripped natively); the npm script loads .env.local.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import prismaPkg from "@prisma/client";
import { SEED } from "./seed/content.ts";

const reset = process.argv.includes("--reset");
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",").map((k) => k.trim()).filter(Boolean);
const allKeys = Object.keys(SEED) as (keyof typeof SEED)[];
const unknown = only?.filter((k) => !allKeys.includes(k as keyof typeof SEED)) ?? [];
if (unknown.length) throw new Error(`Unknown collection(s): ${unknown.join(", ")}. Use: ${allKeys.join(", ")}`);
const keys = only ? allKeys.filter((k) => only.includes(k)) : allKeys;

async function seedDatabase() {
  const db = new prismaPkg.PrismaClient();
  try {
    // --reset on the main branch needs an explicit confirmation, so production isn't wiped by accident
    if (reset && process.env.NEON_BRANCH === "production" && !process.argv.includes("--yes-production")) {
      throw new Error("Refusing to --reset the production branch. Add --yes-production if you really mean to replace all live content.");
    }
    for (const key of keys) {
      const exists = await db.siteContent.findUnique({ where: { key }, select: { key: true } });
      if (exists && !reset) {
        console.log(`  keep    ${key} (already in the database)`);
        continue;
      }
      const data = SEED[key] as unknown as prismaPkg.Prisma.InputJsonValue;
      await db.siteContent.upsert({ where: { key }, create: { key, data, updatedBy: "seed" }, update: { data, updatedBy: "seed" } });
      console.log(`  ${exists ? "reset " : "seeded"}  ${key} (${SEED[key].length} entries)`);
    }
  } finally {
    await db.$disconnect();
  }
}

async function seedLocalFile() {
  const file = path.join(process.cwd(), ".data", "content.json");
  let all: Record<string, unknown> = {};
  try {
    all = JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    // no file yet
  }
  for (const key of keys) {
    if (all[key] && !reset) {
      console.log(`  keep    ${key}`);
      continue;
    }
    all[key] = SEED[key];
    console.log(`  seeded  ${key} (${SEED[key].length} entries)`);
  }
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(all, null, 2));
}

const where = process.env.DATABASE_URL ? `database${process.env.NEON_BRANCH ? ` (branch ${process.env.NEON_BRANCH})` : ""}` : ".data/content.json";
console.log(`Seeding ${where}${reset ? " — RESET: replacing all collections" : ""}`);
await (process.env.DATABASE_URL ? seedDatabase() : seedLocalFile());
console.log("Done.");
