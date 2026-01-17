"use client";

export function SearchBar({ value, onChange, onSort, sortBy, order }) {
  const selectClass = "bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer";

  return (
    <div className="glass p-5 rounded-xl space-y-4">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for jobs or companies..."
          className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs text-slate-400 mb-1 ml-1">Sort By</label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSort(e.target.value, order)}
              className={`${selectClass} w-full appearance-none`}
            >
              <option value="created_at">Date Posted</option>
              <option value="title">Job Title</option>
              <option value="company">Company</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <div className="w-1/3">
          <label className="block text-xs text-slate-400 mb-1 ml-1">Order</label>
          <div className="relative">
            <select
              value={order}
              onChange={(e) => onSort(sortBy, e.target.value)}
              className={`${selectClass} w-full appearance-none`}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
