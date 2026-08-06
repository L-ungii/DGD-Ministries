"use client";

import { useCallback, useEffect, useState } from "react";
import type { Poster } from "@/lib/types";
import ImageUpload from "@/components/Admin/ImageUpload";
import {
  PageHeader,
  Card,
  Field,
  inputClass,
  Button,
  Alert,
} from "@/components/Admin/ui";

async function parseJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
  return data;
}

export default function AdminPosterPage() {
  const [poster, setPoster] = useState<Poster | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [title, setTitle] = useState("");
  const [pendingImage, setPendingImage] = useState<{
    id: string;
    url: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/poster");
      const data = await parseJson(res);
      setPoster(data);
      setTitle(data?.title ?? "");
      setPendingImage(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load the poster.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const displayUrl = pendingImage?.url ?? poster?.image_url ?? null;
  const displayMediaId = pendingImage?.id ?? poster?.media_id ?? null;

  const save = async () => {
    if (!displayMediaId) {
      setError("Upload an image first.");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await parseJson(
        await fetch("/api/admin/poster", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ media_id: displayMediaId, title }),
        })
      );
      setSuccess("Poster saved — it's live on the homepage now.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save the poster.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm("Remove the current poster from the homepage?")) return;
    setRemoving(true);
    setError(null);
    setSuccess(null);

    try {
      await parseJson(await fetch("/api/admin/poster", { method: "DELETE" }));
      setSuccess("Poster removed.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to remove the poster.");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Poster"
        subtitle="A single featured image shown prominently on the homepage. Upload a new one whenever you like — it replaces whatever was showing before."
      />

      <Card>
        {loading ? (
          <p className="text-slate-400 animate-pulse">Loading…</p>
        ) : (
          <div className="grid gap-5">
            <ImageUpload
              label={poster ? "Replace poster" : "Upload a poster"}
              value={displayUrl}
              onChange={(result) => {
                setPendingImage(result);
                setSuccess(null);
              }}
            />

            <Field label="Title (optional)" hint="Shown as a heading above the poster on the homepage.">
              <input
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Join Us This Sunday"
              />
            </Field>

            <Alert kind="error">{error}</Alert>
            <Alert kind="success">{success}</Alert>

            <div className="flex gap-3">
              <Button onClick={save} disabled={saving || !displayMediaId}>
                {saving ? "Saving…" : "Save poster"}
              </Button>
              {poster && (
                <Button variant="danger" onClick={remove} disabled={removing}>
                  {removing ? "Removing…" : "Remove poster"}
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
