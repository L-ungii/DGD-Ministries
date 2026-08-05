import { getDb } from "@/lib/db";
import { requireAdmin, apiRoute, ValidationError } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const GET = apiRoute(async () => {
  await requireAdmin();
  const sql = getDb();
  const rows = await sql`select * from events order by starts_at asc`;
  return Response.json(rows);
});

export const POST = apiRoute(async (req: Request) => {
  await requireAdmin();
  const body = await req.json().catch(() => null);

  const title = (body?.title ?? "").toString().trim();
  const startsAtRaw = (body?.starts_at ?? "").toString();
  if (!title) throw new ValidationError("Title is required.");

  const startsAt = new Date(startsAtRaw);
  if (isNaN(startsAt.getTime())) {
    throw new ValidationError("A valid start date/time is required.");
  }

  let endsAt: Date | null = null;
  if (body?.ends_at) {
    endsAt = new Date(body.ends_at);
    if (isNaN(endsAt.getTime())) throw new ValidationError("Invalid end date/time.");
    if (endsAt < startsAt) {
      throw new ValidationError("The end time cannot be before the start time.");
    }
  }

  const sql = getDb();
  const [row] = await sql`
    insert into events (title, description, location, starts_at, ends_at, media_id, published)
    values (
      ${title},
      ${(body?.description ?? "").toString().trim() || null},
      ${(body?.location ?? "").toString().trim() || null},
      ${startsAt.toISOString()},
      ${endsAt ? endsAt.toISOString() : null},
      ${(body?.media_id ?? null)},
      ${body?.published !== false}
    )
    returning *
  `;

  return Response.json(row, { status: 201 });
});
