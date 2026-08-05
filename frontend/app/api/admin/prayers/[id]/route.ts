import { getDb } from "@/lib/db";
import { requireAdmin, apiRoute } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export const PATCH = apiRoute(async (req: Request, { params }: Params) => {
  await requireAdmin();
  const { id } = await params;
  const body = await req.json().catch(() => null);

  const sql = getDb();
  const [row] = await sql`
    update prayer_requests set answered = ${Boolean(body?.answered)} where id = ${id} returning *
  `;

  if (!row) return Response.json({ error: "Prayer request not found." }, { status: 404 });
  return Response.json(row);
});

export const DELETE = apiRoute(async (_req: Request, { params }: Params) => {
  await requireAdmin();
  const { id } = await params;
  const sql = getDb();
  await sql`delete from prayer_requests where id = ${id}`;
  return Response.json({ ok: true });
});
