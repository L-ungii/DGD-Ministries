"use client";

import { useCallback, useEffect, useState } from "react";
import type { Announcement } from "@/lib/types";
import {
  PageHeader,
  Card,
  Field,
  inputClass,
  Button,
  Alert,
  EmptyState,
} from "@/components/Admin/ui";

const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const blankForm = {
  message: "",
  link_url: "",
  expires_at: "",
  active: true,
};

async function parseJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
  return data;
}

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(blankForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/announcements");
      setItems(await parseJson(res));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load notices.");
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

  const startEdit = (a: Announcement) => {
    setEditingId(a.id);
    setForm({
      message: a.message,
      link_url: a.link_url ?? "",
      expires_at: toLocalInput(a.expires_at),
      active: a.active,
    });
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      message: form.message.trim(),
      link_url: form.link_url.trim() || null,
      expires_at: form.expires_at
        ? new Date(form.expires_at).toISOString()
        : null,
      active: form.active,
    };

    try {
      const res = await fetch(
        editingId
          ? `/api/admin/announcements/${editingId}`
          : "/api/admin/announcements",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      await parseJson(res);
      setSuccess(editingId ? "Notice updated." : "Notice posted.");
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save notice.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (a: Announcement) => {
    try {
      await parseJson(
        await fetch(`/api/admin/announcements/${a.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active: !a.active }),
        })
      );
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update notice.");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this notice?")) return;
    try {
      await parseJson(
        await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" })
      );
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete notice.");
    }
  };

  const isExpired = (a: Announcement) =>
    !!a.expires_at && new Date(a.expires_at) < new Date();

  return (
    <div>
      <PageHeader
        title="Announcements"
        subtitle="Active notices scroll across a banner at the top of every public page."
      />

      <Card className="mb-8">
        <h2 className="font-bold text-blue-950 mb-5">
          {editingId ? "Edit notice" : "Post a notice"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <Field label="Message *" hint="Keep it short — it scrolls in a banner.">
            <textarea
              required
              rows={2}
              maxLength={200}
              className={inputClass}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="No evening service this Sunday — join us at 10:00 instead."
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Link (optional)" hint="Where the notice sends people.">
              <input
                type="url"
                className={inputClass}
                value={form.link_url}
                onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                placeholder="https://…"
              />
            </Field>

            <Field
              label="Hide after (optional)"
              hint="The notice disappears by itself at this time."
            >
              <input
                type="datetime-local"
                className={inputClass}
                value={form.expires_at}
                onChange={(e) =>
                  setForm({ ...form, expires_at: e.target.value })
                }
              />
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4 accent-blue-950"
            />
            Show on the website now
          </label>

          <Alert kind="error">{error}</Alert>
          <Alert kind="success">{success}</Alert>

          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : editingId ? "Save changes" : "Post notice"}
            </Button>
            {editingId && (
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <h2 className="font-bold text-blue-950 mb-4">All notices</h2>

      {loading ? (
        <p className="text-slate-400 animate-pulse">Loading…</p>
      ) : items.length === 0 ? (
        <EmptyState message="No notices yet." />
      ) : (
        <div className="grid gap-3">
          {items.map((a) => (
            <div
              key={a.id}
              className={`bg-white rounded-xl shadow-sm p-4 flex flex-wrap items-center gap-4 ${
                !a.active || isExpired(a) ? "opacity-60" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="text-slate-800">{a.message}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  {a.active ? (
                    <span className="text-[10px] uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Live
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                      Hidden
                    </span>
                  )}
                  {isExpired(a) && (
                    <span className="text-[10px] uppercase bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      Expired
                    </span>
                  )}
                  {a.link_url && (
                    <span className="text-xs text-slate-400 truncate">
                      🔗 {a.link_url}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => toggleActive(a)}>
                  {a.active ? "Hide" : "Show"}
                </Button>
                <Button variant="ghost" onClick={() => startEdit(a)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => remove(a.id)}>
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
