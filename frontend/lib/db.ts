import postgres from "postgres";

/**
 * Lazily-created, shared Postgres connection pool (via postgres.js).
 * Query with tagged templates: sql`select * from events where id = ${id}`
 * — values are always sent as parameters, never string-interpolated.
 *
 * Lazy on purpose: importing this module must never throw just because
 * DATABASE_URL isn't set yet — callers check `isDbConfigured` first and
 * only call getDb() when they actually intend to query.
 *
 * Cached on `globalThis` in dev so Next.js's hot-reload doesn't open a
 * fresh pool on every file save.
 */
declare global {
  var __dgdSql: ReturnType<typeof postgres> | undefined;
}

export function getDb() {
  if (globalThis.__dgdSql) return globalThis.__dgdSql;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set — see ADMIN_SETUP.md to connect a database."
    );
  }

  const instance = postgres(url, {
    // "prefer" negotiates TLS when the server offers it (every managed
    // provider — Neon, Railway, Render — does) and falls back to a plain
    // connection otherwise, so a bare local/self-hosted Postgres without
    // TLS configured still connects. Prepared statements are disabled
    // since most managed providers sit behind a pooler that doesn't
    // support them; that's harmless on a plain box too.
    ssl: "prefer",
    prepare: false,
    max: 5,
  });

  if (process.env.NODE_ENV !== "production") globalThis.__dgdSql = instance;
  return instance;
}
