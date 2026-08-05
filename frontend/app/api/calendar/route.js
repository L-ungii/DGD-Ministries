import { getCalendarEvents } from "../../lib/calendar";
import { getDb } from "@/lib/db";
import { isDbConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

/**
 * Returns upcoming events from BOTH sources, merged and sorted:
 *   - Google Calendar (whatever the church already keeps there)
 *   - Events added by an admin in /admin/events
 * A failure in one source never hides the other.
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const maxResults = Number(searchParams.get("maxResults") || 9);

  const [google, admin] = await Promise.allSettled([
    getCalendarEvents(maxResults),
    getAdminEvents(),
  ]);

  if (google.status === "rejected") console.error(google.reason);
  if (admin.status === "rejected") console.error(admin.reason);

  const events = [
    ...(google.status === "fulfilled"
      ? google.value.map((e) => ({ ...e, source: "google" }))
      : []),
    ...(admin.status === "fulfilled" ? admin.value : []),
  ].sort(
    (a, b) =>
      new Date(a.start.dateTime || a.start.date) -
      new Date(b.start.dateTime || b.start.date)
  );

  return Response.json(events, {
    headers: { "Cache-Control": "no-store" },
  });
}

async function getAdminEvents() {
  if (!isDbConfigured) return [];

  const sql = getDb();
  const rows = await sql`
    select * from events
    where published = true and starts_at >= now()
    order by starts_at asc
  `;

  return rows.map((e) => ({
    id: e.id,
    name: e.title,
    description: e.description,
    location: e.location,
    imageUrl: e.image_url,
    source: "admin",
    start: { dateTime: e.starts_at.toISOString() },
    end: { dateTime: (e.ends_at || e.starts_at).toISOString() },
  }));
}
