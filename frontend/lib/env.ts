/**
 * True once DATABASE_URL is set.
 *
 * Everything database-backed (gallery, events, notices, prayer requests,
 * quiz scores, the admin panel) checks this first, so the website still
 * serves normally before the database has been wired up — those sections
 * simply render empty instead of crashing the page.
 */
export const isDbConfigured = Boolean(process.env.DATABASE_URL);
