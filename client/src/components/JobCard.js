"use client";

import { useState } from "react";
import * as api from "@/lib/api";

export function JobCard({ job, onDelete, onEdit }) {
  const [showRelated, setShowRelated] = useState(false);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm(`Delete "${job.title}"?`)) {
      onDelete(job.id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(job);
  };

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, " ");
  };

  return (
    <div className="glass rounded-xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden flex flex-col">
      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1" title={job.title}>
            {job.title}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={handleEdit}
              className="text-gray-400 hover:text-blue-400 transition-colors p-1"
              title="Edit Job"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-400 transition-colors p-1"
              title="Delete Job"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>

        {job.company && (
          <div className="mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
              {job.company}
            </span>
          </div>
        )}

        {job.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
            {stripHtml(job.description)}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-700/50">
          {job.created_at && (
            <span className="text-xs text-gray-500">
              {new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleToggleRelated}
              className="inline-flex items-center text-xs font-medium text-slate-300 bg-slate-700/50 hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors border border-slate-600/50"
            >
              {showRelated ? "Hide Similar" : "Find Similar"}
            </button>

            {job.url ? (
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
              >
                Apply Now
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </a>
            ) : (
              <span className="text-xs text-gray-500 italic px-2 py-1">No Link</span>
            )}
          </div>
        </div>

        {/* Related Jobs Section */}
        {showRelated && (
          <div className="mt-4 pt-4 border-t border-gray-700/50 animate-fade-in">
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Similar Jobs</h4>
            {loadingRelated ? (
              <div className="space-y-2">
                <div className="h-8 bg-slate-700/50 rounded animate-pulse"></div>
                <div className="h-8 bg-slate-700/50 rounded animate-pulse"></div>
              </div>
            ) : relatedJobs.length === 0 ? (
              <p className="text-xs text-slate-500">No similar jobs found.</p>
            ) : (
              <ul className="space-y-2">
                {relatedJobs.map((rJob) => (
                  <li key={rJob.id} className="p-2 bg-slate-800/50 rounded border border-slate-700 hover:bg-slate-800 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-slate-200 line-clamp-1">{rJob.title}</p>
                        <p className="text-xs text-slate-500">{rJob.company}</p>
                      </div>
                      {rJob.url && (
                        <a href={rJob.url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 shrink-0 ml-2">
                          View
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
