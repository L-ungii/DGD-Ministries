#!/usr/bin/env node
/**
 * Creates (or resets the password of) an admin login.
 *
 * Usage:
 *   node scripts/create-admin.mjs admin@church.co.za "a strong password"
 *
 * Reads DATABASE_URL from the environment — either export it first, or
 * run via `npx dotenv -e .env.local -- node scripts/create-admin.mjs ...`.
 */
import postgres from "postgres";
import bcrypt from "bcryptjs";

const [, , email, password] = process.argv;

if (!email || !password) {
  console.error("Usage: node scripts/create-admin.mjs <email> <password>");
  process.exit(1);
}

if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "DATABASE_URL is not set. Example:\n" +
      '  DATABASE_URL="postgres://..." node scripts/create-admin.mjs ' +
      `${email} "${password}"`
  );
  process.exit(1);
}

const sql = postgres(url, { ssl: "prefer" });

try {
  const passwordHash = await bcrypt.hash(password, 12);

  const [row] = await sql`
    insert into admin_users (email, password_hash)
    values (${email.toLowerCase().trim()}, ${passwordHash})
    on conflict (email) do update set password_hash = excluded.password_hash
    returning id, email
  `;

  console.log(`✓ Admin ready: ${row.email} (${row.id})`);
} catch (err) {
  console.error("Failed to create admin:", err.message);
  process.exit(1);
} finally {
  await sql.end();
}
