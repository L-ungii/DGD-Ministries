import { getDb } from "@/lib/db";
import { requireAdmin, apiRoute, ValidationError } from "@/lib/auth";
import { deleteImage } from "@/lib/storage";

export const dynamic = "force-dynamic";

export const GET = apiRoute(async () => {
  await requireAdmin();
  const sql = getDb();
  const [row] = await sql`select * from poster order by created_at desc limit 1`;
  return Response.json(row ?? null);
});

/** Replaces the current poster — there is only ever zero or one row. */
export const POST = apiRoute(async (req: Request) => {
  await requireAdmin();
  const body = await req.json().catch(() => null);

  const mediaId = (body?.media_id ?? "").toString();
  if (!mediaId) throw new ValidationError("An image is required.");

  const sql = getDb();

  const old = await sql`delete from poster returning media_id`;
  const [row] = await sql`
    insert into poster (media_id, caption)
    values (${mediaId}, ${(body?.caption ?? "").toString().trim() || null})
    returning *
  `;

  for (const o of old) {
    if (o.media_id && o.media_id !== mediaId) {
      await deleteImage(o.media_id).catch((err) =>
        console.error("Failed to delete old poster media:", err)
      );
    }
  }

  return Response.json(row, { status: 201 });
});

export const DELETE = apiRoute(async () => {
  await requireAdmin();
  const sql = getDb();

  const old = await sql`delete from poster returning media_id`;
  for (const o of old) {
    if (o.media_id) {
      await deleteImage(o.media_id).catch((err) =>
        console.error("Failed to delete poster media:", err)
      );
    }
  }

  return Response.json({ ok: true });
});
