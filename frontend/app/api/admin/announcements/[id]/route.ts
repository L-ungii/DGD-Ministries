import { getDb } from "@/lib/db";
import { requireAdmin, apiRoute, ValidationError } from "@/lib/auth";
import { deleteImage } from "@/lib/storage";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export const PATCH = apiRoute(async (req: Request, { params }: Params) => {
  await requireAdmin();
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) throw new ValidationError("Invalid request body.");

  const sql = getDb();
  const updates: Record<string, unknown> = {};

  if ("message" in body) {
    const message = (body.message ?? "").toString().trim();
    if (!message) throw new ValidationError("Message cannot be empty.");
    updates.message = message;
  }
  if ("link_url" in body) updates.link_url = body.link_url?.toString().trim() || null;
  if ("media_id" in body) updates.media_id = body.media_id || null;
  if ("active" in body) updates.active = Boolean(body.active);
  if ("expires_at" in body) {
    if (body.expires_at) {
      const d = new Date(body.expires_at);
      if (isNaN(d.getTime())) throw new ValidationError("Invalid expiry date/time.");
      updates.expires_at = d.toISOString();
    } else {
      updates.expires_at = null;
    }
  }

  if (Object.keys(updates).length === 0) throw new ValidationError("Nothing to update.");

  const [row] = await sql`
    update announcements set ${sql(updates)} where id = ${id} returning *
  `;

  if (!row) return Response.json({ error: "Notice not found." }, { status: 404 });
  return Response.json(row);
});

export const DELETE = apiRoute(async (_req: Request, { params }: Params) => {
  await requireAdmin();
  const { id } = await params;
  const sql = getDb();

  const [row] = await sql`delete from announcements where id = ${id} returning media_id`;

  if (row?.media_id) {
    await deleteImage(row.media_id).catch((err) =>
      console.error("Failed to delete media row:", err)
    );
  }

  return Response.json({ ok: true });
});
