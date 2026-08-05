"use client";

import { useRef, useState } from "react";
import { HiOutlineArrowUpTray } from "react-icons/hi2";

export type UploadResult = { id: string; url: string };

/** Uploads a file to /api/admin/upload, which stores it in Postgres and hands back its id + serving URL. */
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File): Promise<UploadResult> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      return data as UploadResult;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
}

export default function ImageUpload({
  value,
  onChange,
  label = "Image",
}: {
  value: string | null;
  onChange: (result: UploadResult | null) => void;
  label?: string;
}) {
  const { upload, uploading } = useImageUpload();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    try {
      onChange(await upload(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    }
  };

  return (
    <div>
      <span className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </span>

      {value ? (
        <div className="relative w-full h-44 rounded-lg overflow-hidden border border-slate-200 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 bg-white/90 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-md shadow hover:bg-white"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-44 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-900 hover:text-blue-900 transition disabled:opacity-60"
        >
          <HiOutlineArrowUpTray size={26} />
          <span className="text-sm font-medium">
            {uploading ? "Uploading…" : "Click to upload an image"}
          </span>
          <span className="text-xs">JPG, PNG or WEBP, up to 5MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
