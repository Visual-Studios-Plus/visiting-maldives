// Vercel build step: apply Prisma migrations when a database is configured.
// Without DATABASE_URL the site still builds and shows its built-in content (dashboard read-only),
// so a deploy never fails just because Neon isn't connected yet.
import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.log("[migrate] DATABASE_URL not set: skipping migrations (site uses built-in content).");
} else if (!process.env.DATABASE_URL_UNPOOLED) {
  console.error("[migrate] DATABASE_URL is set but DATABASE_URL_UNPOOLED is missing. Add the direct (non -pooler) connection string.");
  process.exit(1);
} else {
  execSync("prisma migrate deploy", { stdio: "inherit" });
}
