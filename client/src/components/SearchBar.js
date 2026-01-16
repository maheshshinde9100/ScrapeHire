"use client";

export function SearchBar({ value, onChange, onSort, sortBy, order }) {
  return (
    <div className="space-y-3 bg-gray-50 p-4 rounded border border-gray-200">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search jobs by title or company..."
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
      />
      <div className="flex gap-2">
        <select
          value={sortBy}
          onChange={(e) => onSort(e.target.value, order)}
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="created_at">Newest</option>
          <option value="title">Title</option>
          <option value="company">Company</option>
        </select>
        <select
          value={order}
          onChange={(e) => onSort(sortBy, e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
}
