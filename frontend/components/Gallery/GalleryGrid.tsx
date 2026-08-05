"use client";

import { useCallback, useEffect, useState } from "react";
import type { GalleryPhoto } from "@/lib/types";
import Reveal from "@/components/Reveal";
import { CgClose } from "react-icons/cg";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

export default function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const albums = ["All", ...new Set(photos.map((p) => p.album))];
  const [album, setAlbum] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const visible =
    album === "All" ? photos : photos.filter((p) => p.album === album);

  const close = useCallback(() => setLightbox(null), []);
  const next = useCallback(
    () => setLightbox((i) => (i === null ? null : (i + 1) % visible.length)),
    [visible.length]
  );
  const prev = useCallback(
    () =>
      setLightbox((i) =>
        i === null ? null : (i - 1 + visible.length) % visible.length
      ),
    [visible.length]
  );

  useEffect(() => {
    if (lightbox === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, next, prev]);

  const current = lightbox === null ? null : visible[lightbox];

  return (
    <>
      {albums.length > 2 && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {albums.map((a) => (
            <button
              key={a}
              onClick={() => {
                setAlbum(a);
                setLightbox(null);
              }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                album === a
                  ? "bg-blue-950 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-200"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visible.map((p, i) => (
          <Reveal key={p.id} delay={(i % 8) * 60}>
            <button
              onClick={() => setLightbox(i)}
              className="group relative block w-full aspect-square rounded-xl overflow-hidden shadow-md focus:outline-none focus:ring-4 focus:ring-blue-900/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image_url}
                alt={p.caption ?? `Church photo — ${p.album}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-blue-950/0 group-hover:bg-blue-950/40 transition-colors duration-300" />
              {p.caption && (
                <span className="absolute bottom-0 left-0 right-0 p-3 text-left text-white text-xs md:text-sm bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {p.caption}
                </span>
              )}
            </button>
          </Reveal>
        ))}
      </div>

      {/* Lightbox */}
      {current && (
        <div
          className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-5 right-5 text-white hover:opacity-70 transition z-10"
          >
            <CgClose size={30} />
          </button>

          {visible.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous photo"
                className="absolute left-2 md:left-6 text-white bg-white/10 hover:bg-white/25 rounded-full p-2 transition z-10"
              >
                <HiChevronLeft size={30} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next photo"
                className="absolute right-2 md:right-6 text-white bg-white/10 hover:bg-white/25 rounded-full p-2 transition z-10"
              >
                <HiChevronRight size={30} />
              </button>
            </>
          )}

          <figure
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.image_url}
              alt={current.caption ?? ""}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            <figcaption className="text-center text-white/80 mt-4 text-sm">
              {current.caption && <span>{current.caption} · </span>}
              <span className="text-white/50">
                {lightbox! + 1} of {visible.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
