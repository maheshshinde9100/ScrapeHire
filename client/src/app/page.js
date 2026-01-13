"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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
