import { getDb } from "@/lib/db";
import { requireAdmin, apiRoute } from "@/lib/auth";
import { deleteImage } from "@/lib/storage";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export const PATCH = apiRoute(async (req: Request, { params }: Params) => {
  await requireAdmin();
  const { id } = await params;
  const body = await req.json().catch(() => null);

  const sql = getDb();
  const [row] = await sql`
    update gallery
    set caption = ${(body?.caption ?? "").toString().trim() || null}
    where id = ${id}
    returning *
  `;

  if (!row) return Response.json({ error: "Photo not found." }, { status: 404 });
  return Response.json(row);
});

export const DELETE = apiRoute(async (_req: Request, { params }: Params) => {
  await requireAdmin();
  const { id } = await params;
  const sql = getDb();

  const [row] = await sql`delete from gallery where id = ${id} returning media_id`;

  if (row?.media_id) {
    await deleteImage(row.media_id).catch((err) =>
      console.error("Failed to delete media row:", err)
    );
  }

  return Response.json({ ok: true });
});
