import { getDb } from "@/lib/db";
import { requireAdmin, apiRoute, ValidationError } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export const PATCH = apiRoute(async (req: Request, { params }: Params) => {
  await requireAdmin();
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) throw new ValidationError("Invalid request body.");

  const sql = getDb();

  // Partial update: only touch the columns the caller actually sent.
  const updates: Record<string, unknown> = {};

  if ("title" in body) {
    const title = (body.title ?? "").toString().trim();
    if (!title) throw new ValidationError("Title cannot be empty.");
    updates.title = title;
  }
  if ("description" in body) updates.description = body.description?.toString().trim() || null;
  if ("location" in body) updates.location = body.location?.toString().trim() || null;
  if ("media_id" in body) updates.media_id = body.media_id || null;
  if ("published" in body) updates.published = Boolean(body.published);

  if ("starts_at" in body) {
    const startsAt = new Date(body.starts_at);
    if (isNaN(startsAt.getTime())) throw new ValidationError("Invalid start date/time.");
    updates.starts_at = startsAt.toISOString();
  }
  if ("ends_at" in body) {
    if (body.ends_at) {
      const endsAt = new Date(body.ends_at);
      if (isNaN(endsAt.getTime())) throw new ValidationError("Invalid end date/time.");
      updates.ends_at = endsAt.toISOString();
    } else {
      updates.ends_at = null;
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new ValidationError("Nothing to update.");
  }

  const [row] = await sql`
    update events set ${sql(updates)} where id = ${id} returning *
  `;

  if (!row) return Response.json({ error: "Event not found." }, { status: 404 });
  return Response.json(row);
});

export const DELETE = apiRoute(async (_req: Request, { params }: Params) => {
  await requireAdmin();
  const { id } = await params;
  const sql = getDb();
  await sql`delete from events where id = ${id}`;
  return Response.json({ ok: true });
});
