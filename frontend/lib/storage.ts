import { getDb } from "@/lib/db";

/**
 * Admin photo uploads are stored as bytea rows in Postgres itself (the
 * `media` table) and served back out by GET /api/media/:id — no separate
 * storage service to run or configure.
 */
export async function uploadImage(
  file: Buffer,
  contentType: string
): Promise<{ id: string; url: string }> {
  const sql = getDb();
  const [row] = await sql`
    insert into media (data, content_type)
    values (${file}, ${contentType})
    returning id
  `;

  return { id: row.id, url: `/api/media/${row.id}` };
}

export async function deleteImage(id: string): Promise<void> {
  const sql = getDb();
  await sql`delete from media where id = ${id}`;
}

export async function getImage(
  id: string
): Promise<{ data: Buffer; contentType: string } | null> {
  const sql = getDb();
  const [row] = await sql`select data, content_type from media where id = ${id}`;
  if (!row) return null;
  return { data: row.data, contentType: row.content_type };
}
