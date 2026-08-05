import { getDb } from "@/lib/db";
import { isDbConfigured } from "@/lib/env";
import type { GalleryPhoto } from "@/lib/types";
import GalleryGrid from "@/components/Gallery/GalleryGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gallery — DGD Ministries",
  description:
    "Photos from services, crusades and celebrations at Divine Grace & Deliverance Ministries.",
};

export default async function GalleryPage() {
  let photos: GalleryPhoto[] = [];

  if (isDbConfigured) {
    const sql = getDb();
    photos = (await sql`
      select * from gallery order by album asc, sort_order asc, created_at desc
    `) as unknown as GalleryPhoto[];
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-[12vh]">
      <div className="bg-blue-950 text-white py-16">
        <div className="w-[90%] xl:w-[80%] mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Gallery</h1>
          <p className="text-gray-200 max-w-2xl mx-auto">
            Moments from our services, crusades and celebrations. To God be the
            glory.
          </p>
        </div>
      </div>

      <div className="w-[90%] xl:w-[80%] mx-auto py-16">
        {photos.length === 0 ? (
          <p className="text-center text-slate-400 py-20">
            Photos are coming soon — check back shortly.
          </p>
        ) : (
          <GalleryGrid photos={photos} />
        )}
      </div>
    </div>
  );
}
