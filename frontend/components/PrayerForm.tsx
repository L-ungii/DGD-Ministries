"use client";

import { useState } from "react";

export default function PrayerForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    request: "",
    is_private: true,
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/prayers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "We couldn't submit your request just now.");
        setStatus("idle");
        return;
      }

      setStatus("sent");
      setForm({ name: "", email: "", request: "", is_private: true });
    } catch {
      setError("Network error — please try again shortly.");
      setStatus("idle");
    }
  };

  if (status === "sent") {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">🙏</div>
        <h3 className="text-xl font-bold text-blue-950 mb-2">
          Your request has been received
        </h3>
        <p className="text-gray-600 mb-6">
          Our ministry team will be praying with you. God bless you.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-blue-900 font-semibold hover:underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">
            Your Name{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Leave blank to stay anonymous"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="If you'd like us to reply"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Your Prayer Request
        </label>
        <textarea
          rows={6}
          required
          maxLength={3000}
          value={form.request}
          onChange={(e) => setForm({ ...form, request: e.target.value })}
          placeholder="Share what you would like us to pray about…"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
        />
        <p className="text-xs text-gray-400 mt-1">
          {form.request.length}/3000
        </p>
      </div>

      <label className="flex items-start gap-2.5 text-sm text-gray-700 bg-gray-50 rounded-md p-3">
        <input
          type="checkbox"
          checked={form.is_private}
          onChange={(e) => setForm({ ...form, is_private: e.target.checked })}
          className="w-4 h-4 mt-0.5 accent-blue-950"
        />
        <span>
          Keep this request private
          <span className="block text-xs text-gray-500 mt-0.5">
            Private requests are only ever seen by the ministry team. Unticking
            this simply lets us know you&apos;re happy for it to be shared in
            corporate prayer.
          </span>
        </span>
      </label>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-blue-950 text-white py-3 rounded-md font-semibold hover:bg-blue-900 transition disabled:opacity-60"
      >
        {status === "sending" ? "Submitting…" : "Submit Prayer Request"}
      </button>
    </form>
  );
}
