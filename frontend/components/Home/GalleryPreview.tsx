import Link from "next/link";
import { getDb } from "@/lib/db";
import { isDbConfigured } from "@/lib/env";
import Reveal from "@/components/Reveal";
import type { GalleryPhoto } from "@/lib/types";

/**
 * Shows the eight most recent gallery photos on the homepage.
 * Renders nothing until the admin has uploaded something.
 */
export default async function GalleryPreview() {
  if (!isDbConfigured) return null;

  const sql = getDb();
  const photos = (await sql`
    select * from gallery order by created_at desc limit 8
  `) as unknown as GalleryPhoto[];

  if (photos.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <p className="text-blue-900 font-semibold tracking-[0.3em] uppercase text-xs mb-3">
              Our church family
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold text-blue-950">
              Recent Moments
            </h2>
            <div className="w-20 h-1 bg-yellow-300 mx-auto mt-5 rounded-full" />
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 100}>
              <Link
                href="/gallery"
                className="block relative aspect-square rounded-xl overflow-hidden shadow-md group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image_url}
                  alt={p.caption ?? "Church photo"}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-blue-950/0 group-hover:bg-blue-950/30 transition-colors duration-300" />
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="text-center mt-10">
            <Link
              href="/gallery"
              className="inline-block px-8 py-3 border-2 border-blue-950 text-blue-950 rounded-lg font-semibold hover:bg-blue-950 hover:text-white transition-all duration-300"
            >
              View Full Gallery
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
