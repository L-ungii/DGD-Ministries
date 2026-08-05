"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Announcement } from "@/lib/types";
import { HiOutlineMegaphone } from "react-icons/hi2";
import { CgClose } from "react-icons/cg";

/**
 * Thin banner under the navbar showing whatever notices the admin has
 * marked active. Rotates through them when there is more than one.
 */
export default function AnnouncementBar() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Already dismissed this session — skip the fetch, so items stays
    // empty and the banner never renders (see the guard below).
    if (sessionStorage.getItem("dgd-notice-dismissed") === "1") return;

    fetch("/api/announcements")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Announcement[]) => setItems(data))
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      6000
    );
    return () => clearInterval(id);
  }, [items.length]);

  if (dismissed || items.length === 0) return null;

  const current = items[index];

  const body = (
    <span className="flex items-center gap-2 min-w-0">
      <HiOutlineMegaphone size={18} className="shrink-0" />
      <span className="truncate">{current.message}</span>
      {current.link_url && (
        <span className="underline shrink-0 hidden sm:inline">Read more</span>
      )}
    </span>
  );

  return (
    <div className="fixed top-[12vh] left-0 w-full z-[999] bg-yellow-300 text-blue-950">
      <div className="w-[90%] xl:w-[80%] mx-auto flex items-center justify-between gap-4 py-2 text-sm font-medium">
        <div key={current.id} className="min-w-0 animate-[fadeIn_0.4s_ease-out]">
          {current.link_url ? (
            <Link
              href={current.link_url}
              target={
                current.link_url.startsWith("http") ? "_blank" : undefined
              }
              className="hover:opacity-80 transition"
            >
              {body}
            </Link>
          ) : (
            body
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {items.length > 1 && (
            <div className="hidden sm:flex gap-1.5">
              {items.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => setIndex(i)}
                  aria-label={`Notice ${i + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition ${
                    i === index ? "bg-blue-950" : "bg-blue-950/30"
                  }`}
                />
              ))}
            </div>
          )}
          <button
            onClick={() => {
              sessionStorage.setItem("dgd-notice-dismissed", "1");
              setDismissed(true);
            }}
            aria-label="Dismiss notice"
            className="hover:opacity-70 transition"
          >
            <CgClose size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
