// Sets (or creates) an admin's password without putting it in an environment variable.
// This is the recovery/bootstrap path: run it when there is no admin you can sign in as,
// or when you want to rotate the first admin's password.
//
//   node scripts/admin-password.mjs --email you@example.com
//   node scripts/admin-password.mjs --email you@example.com --generate
//
// The password is read from the terminal (not echoed into shell history and not passed as
// an argument). --generate makes a strong random one and prints it once.
import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { promisify } from "node:util";
import { createInterface } from "node:readline";
import { PrismaClient } from "@prisma/client";

process.loadEnvFile(".env.local");

const scrypt = promisify(scryptCb);
const N = 2 ** 15, R = 8, P = 1, KEYLEN = 64;

// Same format as lib/password.ts: scrypt$N$r$p$salt$hash
async function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEYLEN, { N, r: R, p: P, maxmem: 128 * N * R * 2 });
  return ["scrypt", N, R, P, salt.toString("base64"), hash.toString("base64")].join("$");
}

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
};

const email = arg("email")?.trim().toLowerCase();
if (!email || !email.includes("@")) {
  console.error("Usage: node scripts/admin-password.mjs --email you@example.com [--generate]");
  process.exit(1);
}

function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: process.stdin.isTTY });
  return new Promise((resolve) => rl.question(question, (answer) => (rl.close(), resolve(answer))));
}

let password;
if (process.argv.includes("--generate")) {
  password = randomBytes(24).toString("base64url");
} else {
  password = await ask(`New password for ${email}: `);
  const again = await ask("Repeat it: ");
  if (password !== again) {
    console.error("The two passwords did not match.");
    process.exit(1);
  }
}
if (password.length < 12) {
  console.error("Use at least 12 characters.");
  process.exit(1);
}

const db = new PrismaClient();
try {
  const hash = await hashPassword(password);
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    // sessionVersion bump signs out every existing cookie for this account
    await db.user.update({ where: { email }, data: { passwordHash: hash, role: "ADMIN", active: true, sessionVersion: { increment: 1 } } });
    console.log(`Updated the password for ${email} and signed out its existing sessions.`);
  } else {
    await db.user.create({ data: { email, name: "Admin", role: "ADMIN", passwordHash: hash } });
    console.log(`Created an admin account for ${email}.`);
  }
  if (process.argv.includes("--generate")) console.log(`\n  Password: ${password}\n\nStore it in a password manager, then this line is gone for good.`);
} finally {
  await db.$disconnect();
}
