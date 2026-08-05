import { getDb } from "@/lib/db";
import { requireAdmin, apiRoute, ValidationError } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const GET = apiRoute(async () => {
  await requireAdmin();
  const sql = getDb();
  const rows = await sql`select * from announcements order by created_at desc`;
  return Response.json(rows);
});

export const POST = apiRoute(async (req: Request) => {
  await requireAdmin();
  const body = await req.json().catch(() => null);

  const message = (body?.message ?? "").toString().trim();
  if (!message) throw new ValidationError("Message is required.");
  if (message.length > 200) throw new ValidationError("Keep the message under 200 characters.");

  let expiresAt: string | null = null;
  if (body?.expires_at) {
    const d = new Date(body.expires_at);
    if (isNaN(d.getTime())) throw new ValidationError("Invalid expiry date/time.");
    expiresAt = d.toISOString();
  }

  const sql = getDb();
  const [row] = await sql`
    insert into announcements (message, link_url, expires_at, active)
    values (
      ${message},
      ${(body?.link_url ?? "").toString().trim() || null},
      ${expiresAt},
      ${body?.active !== false}
    )
    returning *
  `;

  return Response.json(row, { status: 201 });
});
