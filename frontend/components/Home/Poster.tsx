import { getDb } from "@/lib/db";
import { isDbConfigured } from "@/lib/env";
import Reveal from "@/components/Reveal";
import type { Poster as PosterType } from "@/lib/types";

/**
 * The single "poster of the day" the admin uploads from /admin/poster.
 * Renders nothing until one has been set.
 */
export default async function Poster() {
  if (!isDbConfigured) return null;

  const sql = getDb();
  const [poster] = (await sql`
    select * from poster order by created_at desc limit 1
  `) as unknown as PosterType[];

  if (!poster) return null;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          {poster.title && (
            <h2 className="text-2xl md:text-4xl font-bold text-blue-950 text-center mb-6">
              {poster.title}
            </h2>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster.image_url}
            alt={poster.title ?? "Poster"}
            className="w-full rounded-2xl shadow-xl object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
