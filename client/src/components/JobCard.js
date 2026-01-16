"use client";

export function JobCard({ job, onDelete }) {
  const handleDelete = () => {
    if (confirm(`Delete "${job.title}"?`)) {
      onDelete(job.id);
    }
  };

  return (
    <div className="rounded border border-gray-300 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
      {job.company && (
        <p className="text-sm text-gray-600 mt-1">{job.company}</p>
      )}
      {job.description && (
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{job.description}</p>
      )}
      <div className="mt-4 flex gap-2">
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-sm text-blue-600 hover:underline"
          >
            View Job
          </a>
        )}
        <button
          onClick={handleDelete}
          className="ml-auto text-sm text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </div>
      {job.created_at && (
        <p className="text-xs text-gray-400 mt-3">
          Posted: {new Date(job.created_at).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
