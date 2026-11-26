/*
 * One-time move: copies each collection from its old JSON row (site_content) into its own tables
 * (server/content/table-specs.ts), checks that every entry reads back the same, then (with
 * --drop-json) removes the JSON row. Places to stay have their own script (move-stays-to-table.ts).
 *
 *   npx prisma migrate deploy                                              create the tables first
 *   node --env-file=.env.local scripts/move-content-to-tables.ts              copy and check
 *   node --env-file=.env.local scripts/move-content-to-tables.ts --drop-json  …then remove the JSON rows
 *
 * Safe to re-run: a collection whose table already has rows is only checked, not copied again.
 * A copy of every JSON row is written to .data/content-before-tables.json first.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import { TABLE_SPECS } from "../server/content/table-specs.ts";
import { readTable, tableHasRows, writeTable } from "../server/content/tables.ts";

const url = new URL(process.env.DATABASE_URL ?? "");
url.searchParams.set("connect_timeout", "40");
const db = new PrismaClient({ datasourceUrl: url.toString() });

/** An entry as plain data for comparing: no row id, no empty or missing values, keys sorted. */
function plain(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(plain);
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v).sort()) {
      if (k === "_id") continue;
      const x = plain((v as Record<string, unknown>)[k]);
      if (x === undefined || x === null || x === "" || (Array.isArray(x) && !x.length)) continue;
      out[k] = x;
    }
    return out;
  }
  return v;
}

let failed = false;
try {
  const rows = await db.siteContent.findMany();
  mkdirSync(".data", { recursive: true });
  writeFileSync(".data/content-before-tables.json", JSON.stringify(Object.fromEntries(rows.map((r) => [r.key, r.data]))));
  for (const spec of TABLE_SPECS) {
    const old = rows.find((r) => r.key === spec.key);
    const before = (old?.data ?? []) as Record<string, unknown>[];
    if (!(await tableHasRows(db, spec))) {
      if (!old) {
        console.log(`${spec.key.padEnd(11)} no JSON row and an empty table: nothing to move`);
        continue;
      }
      await writeTable(db, spec, before, "move to tables");
    }
    const after = (await readTable(db, spec))?.items ?? [];
    const same = old ? before.filter((b, i) => JSON.stringify(plain(b)) === JSON.stringify(plain(after[i]))).length : after.length;
    const ok = !old || (after.length === before.length && same === before.length);
    console.log(`${spec.key.padEnd(11)} table ${String(after.length).padStart(4)} · JSON ${String(before.length).padStart(4)} · identical ${same} ${ok ? "✓" : "✗ MISMATCH"}`);
    if (!ok) failed = true;
    else if (old && process.argv.includes("--drop-json")) {
      await db.siteContent.delete({ where: { key: spec.key } });
      console.log(`${"".padEnd(11)} removed the JSON row`);
    }
  }
  if (failed) console.log("\nSome collections didn't match; their JSON rows were kept.");
} finally {
  await db.$disconnect();
}
