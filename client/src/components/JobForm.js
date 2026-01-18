"use client";

import { useState, useEffect } from "react";

export function JobForm({ onSubmit, loading = false, initialValues = null, onCancel }) {
  const [form, setForm] = useState({ title: "", company: "", description: "", url: "" });

  useEffect(() => {
    if (initialValues) {
      setForm({
        title: initialValues.title || "",
        company: initialValues.company || "",
        description: initialValues.description || "",
        url: initialValues.url || ""
      });
    } else {
      setForm({ title: "", company: "", description: "", url: "" });
    }
  }, [initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    if (!initialValues) {
      setForm({ title: "", company: "", description: "", url: "" });
    }
  };

  const isEditing = !!initialValues;
  const inputClass = "w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all";

  return (
    <form onSubmit={handleSubmit} className="glass p-6 rounded-xl space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </div>
        <h3 className="font-bold text-lg text-white">
          {isEditing ? "Edit Job" : "Post a Job"}
        </h3>
      </div>

      <div>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Job Title"
          className={inputClass}
        />
      </div>

      <div>
        <input
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          placeholder="Company Name"
          className={inputClass}
        />
      </div>

      <div>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Job Description..."
          rows="3"
          className={inputClass}
        />
      </div>

      <div>
        <input
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          placeholder="Application URL"
          className={inputClass}
        />
      </div>

      <div className="flex gap-2">
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="w-1/3 rounded-lg bg-slate-700 text-white font-semibold py-3 hover:bg-slate-600 transition-all"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/30 flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Processing...
            </>
          ) : (
            isEditing ? "Update Job" : "Add Job Listing"
          )}
        </button>
      </div>
    </form>
  );
}
