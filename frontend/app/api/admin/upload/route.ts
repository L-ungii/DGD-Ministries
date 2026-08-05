import { requireAdmin, apiRoute, ValidationError } from "@/lib/auth";
import { uploadImage } from "@/lib/storage";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 5 * 1024 * 1024; // 5MB — kept modest since these rows live in Postgres itself

export const POST = apiRoute(async (req: Request) => {
  await requireAdmin();

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw new ValidationError("No file was uploaded.");
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new ValidationError("Please upload a JPG, PNG, WEBP or GIF image.");
  }
  if (file.size > MAX_BYTES) {
    throw new ValidationError("Images must be smaller than 5MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { id, url } = await uploadImage(buffer, file.type);

  return Response.json({ id, url });
});
