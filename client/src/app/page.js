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
  const [offset, setOffset] = useState(0);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    // When filters change, reset to page 0 and fetch fresh
    setOffset(0);
    fetchJobsList(0, false);
  }, [search, sortBy, order]);

  async function fetchJobsList(skip = 0, isLoadMore = false) {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchJobs(skip, 100, search, sortBy, order);
      if (isLoadMore) {
        setJobs((prev) => [...prev, ...(data || [])]);
      } else {
        setJobs(data || []);
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadMore() {
    const newOffset = offset + 100;
    setOffset(newOffset);
    await fetchJobsList(newOffset, true);
  }

  async function handleScrape() {
    setLoading(true);
    setError(null);
    try {
      await api.scrapeJobs();
      // Refresh list from scratch
      setOffset(0);
      await fetchJobsList(0, false);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleFormSubmit(jobData) {
    setError(null);
    try {
      if (editingJob) {
        await api.updateJob(editingJob.id, jobData);
        // Optimistic update or refresh? Refresh for safety.
        // Or better: update locally to avoid flash
        setJobs((prev) => prev.map(j => j.id === editingJob.id ? { ...j, ...jobData } : j));
        setEditingJob(null);
      } else {
        await api.createJob(jobData);
        // Refresh to show new job at top (if sorted by date)
        fetchJobsList(0, false);
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  }

  function handleEdit(job) {
    setEditingJob(job);
    // Scroll to top to see form
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingJob(null);
  }

  async function handleDelete(id) {
    try {
      await api.deleteJob(id);
      setJobs((s) => s.filter((j) => j.id !== id));
      if (editingJob && editingJob.id === id) {
        setEditingJob(null);
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen text-slate-200">

      {/* Navbar / Hero */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
              S
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ScrapeHire
            </h1>
          </div>

          <button
            onClick={handleScrape}
            disabled={loading}
            className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md bg-white/10 px-6 font-medium text-white transition-all duration-300 hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none"
          >
            <span className="mr-2">
              {loading ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              )}
            </span>
            {loading ? "Syncing..." : "Scrape Remote Jobs"}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

        {/* Error Banner */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 flex items-center gap-3 animate-fade-in">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
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
              <JobForm
                onSubmit={handleFormSubmit}
                loading={loading && !offset} // Only show form loading on initial fetch or submit
                initialValues={editingJob}
                onCancel={handleCancelEdit}
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Latest Opportunities
                <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-slate-900 bg-white rounded-full">
                  {jobs.length}
                </span>
              </h2>
            </div>

            {loading && jobs.length === 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="glass h-48 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 glass rounded-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 text-slate-500 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No jobs found</h3>
                <p className="text-slate-400 max-w-sm mx-auto">
                  Try adjusting your search filters or click "Scrape Remote Jobs" to fetch the latest listings.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                    />
                  ))}
                </div>

                {jobs.length > 0 && jobs.length % 100 === 0 && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
                    >
                      {loading ? "Loading..." : "Load More Jobs"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
