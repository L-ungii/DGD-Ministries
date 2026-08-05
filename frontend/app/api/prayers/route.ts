import { getDb } from "@/lib/db";
import { apiRoute, ValidationError } from "@/lib/auth";
import { isDbConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

/** Public submission endpoint — anyone can post a prayer request; only the admin panel can read them. */
export const POST = apiRoute(async (req: Request) => {
  if (!isDbConfigured) {
    return Response.json({ error: "Not available right now." }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const request = (body?.request ?? "").toString().trim();

  if (!request) throw new ValidationError("Please share your prayer request.");
  if (request.length > 3000) throw new ValidationError("Please keep your request under 3000 characters.");

  const sql = getDb();
  await sql`
    insert into prayer_requests (name, email, request, is_private)
    values (
      ${(body?.name ?? "").toString().trim() || null},
      ${(body?.email ?? "").toString().trim() || null},
      ${request},
      ${body?.is_private !== false}
    )
  `;

  return Response.json({ ok: true }, { status: 201 });
});
