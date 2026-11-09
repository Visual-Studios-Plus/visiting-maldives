// Vercel build step: apply Prisma migrations, then seed any empty collections, when a database is
// configured. Without DATABASE_URL the build still succeeds; the site is then empty until a
// database is connected (content lives in the database, seeded from prisma/seed/content.ts).
import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.log("[db] DATABASE_URL not set: skipping migrations and seeding.");
} else if (!process.env.DATABASE_URL_UNPOOLED) {
  console.error("[db] DATABASE_URL is set but DATABASE_URL_UNPOOLED is missing. Add the direct (non -pooler) connection string.");
  process.exit(1);
} else {
  execSync("prisma migrate deploy", { stdio: "inherit" });
  // safe mode: only fills collections that are still empty; never overwrites dashboard edits
  execSync("node --no-warnings prisma/seed.ts", { stdio: "inherit" });
}
