"use client";

import { useCallback, useEffect, useState } from "react";
import type { PrayerRequest } from "@/lib/types";
import {
  PageHeader,
  Button,
  Alert,
  EmptyState,
} from "@/components/Admin/ui";

type Filter = "all" | "open" | "answered";

async function parseJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
  return data;
}

export default function AdminPrayersPage() {
  const [items, setItems] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("open");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/prayers");
      setItems(await parseJson(res));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load prayer requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleAnswered = async (p: PrayerRequest) => {
    try {
      await parseJson(
        await fetch(`/api/admin/prayers/${p.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answered: !p.answered }),
        })
      );
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update.");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this prayer request?")) return;
    try {
      await parseJson(await fetch(`/api/admin/prayers/${id}`, { method: "DELETE" }));
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete.");
    }
  };

  const visible = items.filter((p) =>
    filter === "all" ? true : filter === "open" ? !p.answered : p.answered
  );

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "open", label: "To pray for", count: items.filter((p) => !p.answered).length },
    { key: "answered", label: "Prayed for", count: items.filter((p) => p.answered).length },
    { key: "all", label: "All", count: items.length },
  ];

  return (
    <div>
      <PageHeader
        title="Prayer Requests"
        subtitle="Requests submitted through the website. Private ones are only ever visible here."
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filter === t.key
                ? "bg-blue-950 text-white"
                : "bg-white text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      <div className="mb-4">
        <Alert kind="error">{error}</Alert>
      </div>

      {loading ? (
        <p className="text-slate-400 animate-pulse">Loading…</p>
      ) : visible.length === 0 ? (
        <EmptyState message="Nothing here right now." />
      ) : (
        <div className="grid gap-3">
          {visible.map((p) => (
            <div
              key={p.id}
              className={`bg-white rounded-xl shadow-sm p-5 ${
                p.answered ? "opacity-70" : ""
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-slate-800">
                    {p.name?.trim() || "Anonymous"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(p.created_at).toLocaleString("default", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {p.email && ` · ${p.email}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {p.is_private && (
                    <span className="text-[10px] uppercase bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                      Private
                    </span>
                  )}
                  {p.answered && (
                    <span className="text-[10px] uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Prayed for
                    </span>
                  )}
                </div>
              </div>

              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {p.request}
              </p>

              <div className="flex gap-2 mt-4">
                <Button variant="ghost" onClick={() => toggleAnswered(p)}>
                  {p.answered ? "Mark as open" : "Mark as prayed for"}
                </Button>
                {p.email && (
                  <a
                    href={`mailto:${p.email}?subject=${encodeURIComponent(
                      "We are praying for you"
                    )}`}
                    className="px-4 py-2 rounded-lg font-semibold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                  >
                    Reply by email
                  </a>
                )}
                <Button variant="danger" onClick={() => remove(p.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
