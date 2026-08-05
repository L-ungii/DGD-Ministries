import { getDb } from "@/lib/db";
import { requireAdmin, apiRoute } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const GET = apiRoute(async () => {
  await requireAdmin();
  const sql = getDb();
  const rows = await sql`select * from prayer_requests order by created_at desc`;
  return Response.json(rows);
});
