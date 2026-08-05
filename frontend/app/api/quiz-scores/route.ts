import { getDb } from "@/lib/db";
import { apiRoute, ValidationError } from "@/lib/auth";
import { isDbConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export const GET = apiRoute(async () => {
  if (!isDbConfigured) return Response.json([]);

  const sql = getDb();
  const rows = await sql`
    select * from quiz_scores order by score desc, created_at asc limit 10
  `;
  return Response.json(rows);
});

export const POST = apiRoute(async (req: Request) => {
  if (!isDbConfigured) {
    return Response.json({ error: "Not available right now." }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const name = (body?.name ?? "").toString().trim().slice(0, 40);
  const score = Number(body?.score);
  const maxScore = Number(body?.max_score);

  if (!name) throw new ValidationError("A name is required.");
  if (!Number.isInteger(score) || !Number.isInteger(maxScore) || score < 0 || score > maxScore) {
    throw new ValidationError("Invalid score.");
  }

  const sql = getDb();
  const [row] = await sql`
    insert into quiz_scores (name, score, max_score)
    values (${name}, ${score}, ${maxScore})
    returning *
  `;

  return Response.json(row, { status: 201 });
});
