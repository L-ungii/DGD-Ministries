"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChurchEvent } from "@/lib/types";
import ImageUpload from "@/components/Admin/ImageUpload";
import {
  PageHeader,
  Card,
  Field,
  inputClass,
  Button,
  Alert,
  EmptyState,
} from "@/components/Admin/ui";

/** <input type="datetime-local"> wants "YYYY-MM-DDTHH:mm" in local time. */
const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const blankForm = {
  title: "",
  description: "",
  location: "",
  starts_at: "",
  ends_at: "",
  media_id: null as string | null,
  image_url: null as string | null,
  published: true,
};

async function parseJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
  return data;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(blankForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/events");
      setEvents(await parseJson(res));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm(blankForm);
    setEditingId(null);
    setError(null);
  };

  const startEdit = (e: ChurchEvent) => {
    setEditingId(e.id);
    setForm({
      title: e.title,
      description: e.description ?? "",
      location: e.location ?? "",
      starts_at: toLocalInput(e.starts_at),
      ends_at: toLocalInput(e.ends_at),
      media_id: e.media_id,
      image_url: e.image_url,
      published: e.published,
    });
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    if (form.ends_at && new Date(form.ends_at) < new Date(form.starts_at)) {
      setError("The end time cannot be before the start time.");
      setSaving(false);
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      location: form.location.trim() || null,
      starts_at: new Date(form.starts_at).toISOString(),
      ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
      media_id: form.media_id,
      published: form.published,
    };

    try {
      const res = await fetch(
        editingId ? `/api/admin/events/${editingId}` : "/api/admin/events",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      await parseJson(res);
      setSuccess(editingId ? "Event updated." : "Event added.");
      resetForm();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save event.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await parseJson(await fetch(`/api/admin/events/${id}`, { method: "DELETE" }));
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete event.");
    }
  };

  const togglePublished = async (e: ChurchEvent) => {
    try {
      await parseJson(
        await fetch(`/api/admin/events/${e.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ published: !e.published }),
        })
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event.");
    }
  };

  const now = Date.now();

  return (
    <div>
      <PageHeader
        title="Events"
        subtitle="Events you add here show up on the homepage alongside the Google Calendar events."
      />

      <Card className="mb-8">
        <h2 className="font-bold text-blue-950 mb-5">
          {editingId ? "Edit event" : "Add a new event"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Event title *">
              <input
                required
                className={inputClass}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Sunday Revival Service"
              />
            </Field>

            <Field label="Location">
              <input
                className={inputClass}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="73 Signal Hill, Mahikeng"
              />
            </Field>

            <Field label="Starts *">
              <input
                required
                type="datetime-local"
                className={inputClass}
                value={form.starts_at}
                onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
              />
            </Field>

            <Field label="Ends">
              <input
                type="datetime-local"
                className={inputClass}
                value={form.ends_at}
                onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              rows={4}
              className={inputClass}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Tell the congregation what to expect…"
            />
          </Field>

          <ImageUpload
            label="Event poster (optional)"
            value={form.image_url}
            onChange={(result) =>
              setForm({
                ...form,
                media_id: result?.id ?? null,
                image_url: result?.url ?? null,
              })
            }
          />

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) =>
                setForm({ ...form, published: e.target.checked })
              }
              className="w-4 h-4 accent-blue-950"
            />
            Visible on the website
          </label>

          <Alert kind="error">{error}</Alert>
          <Alert kind="success">{success}</Alert>

          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : editingId ? "Save changes" : "Add event"}
            </Button>
            {editingId && (
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <h2 className="font-bold text-blue-950 mb-4">
        All events {events.length > 0 && `(${events.length})`}
      </h2>

      {loading ? (
        <p className="text-slate-400 animate-pulse">Loading…</p>
      ) : events.length === 0 ? (
        <EmptyState message="No events yet — add your first one above." />
      ) : (
        <div className="grid gap-3">
          {events.map((e) => {
            const past = new Date(e.starts_at).getTime() < now;
            return (
              <div
                key={e.id}
                className={`bg-white rounded-xl shadow-sm p-4 flex flex-wrap items-center gap-4 ${
                  past ? "opacity-60" : ""
                }`}
              >
                <div className="shrink-0 w-16 text-center bg-blue-950 text-white rounded-lg py-2">
                  <p className="text-[10px] uppercase">
                    {new Date(e.starts_at).toLocaleDateString("default", {
                      month: "short",
                    })}
                  </p>
                  <p className="text-xl font-bold leading-none">
                    {new Date(e.starts_at).getDate()}
                  </p>
                </div>

                {e.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={e.image_url}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-800">{e.title}</p>
                    {!e.published && (
                      <span className="text-[10px] uppercase bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                        Hidden
                      </span>
                    )}
                    {past && (
                      <span className="text-[10px] uppercase bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        Past
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(e.starts_at).toLocaleString("default", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {e.location && (
                    <p className="text-xs text-slate-400">📍 {e.location}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => togglePublished(e)}>
                    {e.published ? "Hide" : "Show"}
                  </Button>
                  <Button variant="ghost" onClick={() => startEdit(e)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => remove(e.id, e.title)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
