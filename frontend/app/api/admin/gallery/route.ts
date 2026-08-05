import { getDb } from "@/lib/db";
import { requireAdmin, apiRoute, ValidationError } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const GET = apiRoute(async () => {
  await requireAdmin();
  const sql = getDb();
  const rows = await sql`select * from gallery order by created_at desc`;
  return Response.json(rows);
});

/** Bulk insert — the client uploads each file to /api/admin/upload first, then posts the resulting rows here in one call. */
export const POST = apiRoute(async (req: Request) => {
  await requireAdmin();
  const body = await req.json().catch(() => null);
  const items = Array.isArray(body?.items) ? body.items : null;
  if (!items?.length) throw new ValidationError("No photos to save.");

  const rows = items.map((item: Record<string, unknown>) => {
    const mediaId = (item.media_id ?? "").toString();
    if (!mediaId) throw new ValidationError("Each photo needs a media_id.");
    return {
      media_id: mediaId,
      album: (item.album ?? "General").toString().trim() || "General",
      caption: item.caption ? item.caption.toString().trim() : null,
      sort_order: 0,
    };
  });

  const sql = getDb();
  const inserted = await sql`insert into gallery ${sql(rows)} returning *`;
  return Response.json(inserted, { status: 201 });
});
