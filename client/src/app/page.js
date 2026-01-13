"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", company: "", url: "" });

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("http://localhost:8000/jobs");
        const data = await res.json();
        setJobs(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  async function handleScrape() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/jobs/scrape", { method: "POST" });
      if (res.ok) {
        await fetchJobsOnce();
      } else {
        console.error("scrape failed", res.status);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchJobsOnce() {
    try {
      const res = await fetch("http://localhost:8000/jobs");
      const data = await res.json();
      setJobs(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ title: "", company: "", url: "" });
        await fetchJobsOnce();
      } else {
        console.error("add failed", res.status);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`http://localhost:8000/jobs/${id}`, { method: "DELETE" });
      if (res.status === 204) {
        setJobs((s) => s.filter((j) => j.id !== id));
      } else {
        console.error("delete failed", res.status);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col gap-8 py-16 px-8 bg-white dark:bg-black">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/next.svg" alt="logo" width={64} height={20} />
            <h1 className="text-2xl font-semibold">ScrapeHire</h1>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-medium mb-4">Jobs</h2>
          <div className="mb-4 flex gap-2">
            <button
              onClick={handleScrape}
              className="rounded bg-blue-600 px-3 py-1 text-white"
            >
              Scrape
            </button>
            <form onSubmit={handleAdd} className="flex gap-2">
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Title"
                className="border px-2"
              />
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Company"
                className="border px-2"
              />
              <input
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="URL"
                className="border px-2"
              />
              <button className="rounded bg-green-600 px-3 py-1 text-white">Add</button>
            </form>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : jobs.length === 0 ? (
            <p>No jobs found yet. Click Scrape to import.</p>
          ) : (
            <ul className="space-y-4">
              {jobs.map((job) => (
                <li key={job.id} className="rounded border p-4">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  {job.company && <p className="text-sm text-zinc-600">{job.company}</p>}
                  {job.url && (
                    <a className="text-sm text-blue-600" href={job.url} target="_blank" rel="noreferrer">
                      View
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
