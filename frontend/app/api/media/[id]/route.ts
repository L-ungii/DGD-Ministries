import { getImage } from "@/lib/storage";
import { isDbConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** Serves an uploaded image's bytes straight out of Postgres. */
export async function GET(_req: Request, { params }: Params) {
  if (!isDbConfigured) return new Response("Not found", { status: 404 });

  const { id } = await params;

  // media.id is a uuid column — a malformed id would otherwise reach
  // Postgres as an invalid-input-syntax error instead of a clean 404.
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  const image = await getImage(id);
  if (!image) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.contentType,
      // Uploads are immutable — a new upload always gets a new id, and
      // deletes remove the row — so this can be cached indefinitely.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
