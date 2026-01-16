"use client";

import { useEffect, useState } from "react";
import { JobCard } from "@/components/JobCard";
import { JobForm } from "@/components/JobForm";
import { SearchBar } from "@/components/SearchBar";
import * as api from "@/lib/api";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    fetchJobsList();
  }, [search, sortBy, order]);

  async function fetchJobsList() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchJobs(0, 100, search, sortBy, order);
      setJobs(data || []);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleScrape() {
    setLoading(true);
    setError(null);
    try {
      await api.scrapeJobs();
      await fetchJobsList();
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(jobData) {
    setError(null);
    try {
      await api.createJob(jobData);
      await fetchJobsList();
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteJob(id);
      setJobs((s) => s.filter((j) => j.id !== id));
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ScrapeHire</h1>
          <p className="text-gray-600">Find and manage remote job listings</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={handleScrape}
            disabled={loading}
            className="rounded bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Scraping..." : "Scrape Jobs"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Search + Form */}
          <div className="lg:col-span-1 space-y-4">
            <SearchBar
              value={search}
              onChange={setSearch}
              onSort={(s, o) => {
                setSortBy(s);
                setOrder(o);
              }}
              sortBy={sortBy}
              order={order}
            />
            <JobForm onSubmit={handleAdd} loading={loading} />
          </div>

          {/* Right: Jobs List */}
          <div className="lg:col-span-2">
            {loading && jobs.length === 0 ? (
              <p className="text-center py-8 text-gray-500">Loading...</p>
            ) : jobs.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                No jobs found. Try scraping or adding one!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
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
