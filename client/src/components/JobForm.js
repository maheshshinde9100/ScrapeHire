"use client";

import { useState } from "react";

export function JobForm({ onSubmit, loading = false }) {
  const [form, setForm] = useState({ title: "", company: "", description: "", url: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ title: "", company: "", description: "", url: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-gray-50 p-4 rounded border border-gray-200">
      <h3 className="font-semibold text-gray-900">Add Job</h3>
      <input
        required
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="Job Title"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
      />
      <input
        value={form.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
        placeholder="Company (optional)"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
      />
      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Description (optional)"
        rows="2"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
      />
      <input
        value={form.url}
        onChange={(e) => setForm({ ...form, url: e.target.value })}
        placeholder="Job URL (optional)"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-green-600 text-white font-medium py-2 hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Job"}
      </button>
    </form>
  );
}
