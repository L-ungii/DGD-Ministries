"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useImageUpload } from "@/components/Admin/ImageUpload";
import type { GalleryPhoto } from "@/lib/types";
import {
  PageHeader,
  Card,
  Field,
  inputClass,
  Button,
  Alert,
  EmptyState,
} from "@/components/Admin/ui";
import { HiOutlineArrowUpTray } from "react-icons/hi2";

async function parseJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
  return data;
}

export default function AdminGalleryPage() {
  const { upload } = useImageUpload();
  const fileRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [album, setAlbum] = useState("General");
  const [filter, setFilter] = useState<string>("All");
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      setPhotos(await parseJson(res));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load photos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    setSuccess(null);

    const list = Array.from(files);
    setProgress({ done: 0, total: list.length });

    const items: { media_id: string; album: string }[] = [];
    let failed = 0;

    for (let i = 0; i < list.length; i++) {
      try {
        const { id } = await upload(list[i]);
        items.push({
          media_id: id,
          album: album.trim() || "General",
        });
      } catch {
        failed++;
      }
      setProgress({ done: i + 1, total: list.length });
    }

    if (items.length) {
      try {
        await parseJson(
          await fetch("/api/admin/gallery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }),
          })
        );
        setSuccess(
          `Uploaded ${items.length} photo${items.length === 1 ? "" : "s"}.` +
            (failed ? ` ${failed} failed.` : "")
        );
        await load();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save photos.");
      }
    } else if (failed) {
      setError(`All ${failed} upload(s) failed.`);
    }

    setProgress(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const updateCaption = async (id: string, caption: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, caption } : p))
    );
    try {
      await parseJson(
        await fetch(`/api/admin/gallery/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ caption }),
        })
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save caption.");
    }
  };

  const remove = async (photo: GalleryPhoto) => {
    if (!confirm("Delete this photo?")) return;
    try {
      await parseJson(
        await fetch(`/api/admin/gallery/${photo.id}`, { method: "DELETE" })
      );
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete photo.");
    }
  };

  const albums = ["All", ...new Set(photos.map((p) => p.album))];
  const visible =
    filter === "All" ? photos : photos.filter((p) => p.album === filter);

  return (
    <div>
      <PageHeader
        title="Photo Gallery"
        subtitle="Upload church photos. They appear immediately on the public Gallery page."
      />

      <Card className="mb-8">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <Field
            label="Album"
            hint="Photos are grouped by album on the public page — e.g. Crusade 2026, Baptism, Youth Camp."
          >
            <input
              className={inputClass}
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              list="album-options"
              placeholder="General"
            />
            <datalist id="album-options">
              {[...new Set(photos.map((p) => p.album))].map((a) => (
                <option key={a} value={a} />
              ))}
            </datalist>
          </Field>

          <Button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={!!progress}
            className="flex items-center gap-2 h-[42px]"
          >
            <HiOutlineArrowUpTray size={18} />
            {progress
              ? `Uploading ${progress.done}/${progress.total}…`
              : "Choose photos"}
          </Button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {progress && (
          <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-950 transition-all duration-300"
              style={{
                width: `${(progress.done / progress.total) * 100}%`,
              }}
            />
          </div>
        )}

        <div className="mt-4 space-y-2">
          <Alert kind="error">{error}</Alert>
          <Alert kind="success">{success}</Alert>
        </div>
      </Card>

      {albums.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {albums.map((a) => (
            <button
              key={a}
              onClick={() => setFilter(a)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                filter === a
                  ? "bg-blue-950 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-200"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-slate-400 animate-pulse">Loading…</p>
      ) : visible.length === 0 ? (
        <EmptyState message="No photos yet — upload your first ones above." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visible.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden group"
            >
              <div className="relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image_url}
                  alt={p.caption ?? ""}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => remove(p)}
                  className="absolute top-2 right-2 bg-white/90 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-md shadow opacity-0 group-hover:opacity-100 focus:opacity-100 transition"
                >
                  Delete
                </button>
                <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {p.album}
                </span>
              </div>
              <input
                defaultValue={p.caption ?? ""}
                onBlur={(e) => updateCaption(p.id, e.target.value)}
                placeholder="Add a caption…"
                className="w-full px-3 py-2 text-xs text-slate-700 border-t border-slate-100 focus:outline-none focus:bg-slate-50"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
