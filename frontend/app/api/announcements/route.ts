import { getDb } from "@/lib/db";
import { apiRoute } from "@/lib/auth";
import { isDbConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

/** Public read of active, unexpired notices — used by the homepage banner. */
export const GET = apiRoute(async () => {
  if (!isDbConfigured) return Response.json([]);

  const sql = getDb();
  const rows = await sql`
    select * from announcements
    where active = true and (expires_at is null or expires_at > now())
    order by created_at desc
  `;
  return Response.json(rows);
});
