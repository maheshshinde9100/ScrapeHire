const API_BASE = "http://localhost:8000";

export async function fetchJobs(skip = 0, limit = 100, search = null, sortBy = "created_at", order = "desc") {
  const params = new URLSearchParams({ skip, limit, sort_by: sortBy, order });
  if (search) params.append("search", search);
  
  const res = await fetch(`${API_BASE}/jobs?${params}`);
  if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.statusText}`);
  return res.json();
}

export async function createJob(jobData) {
  const res = await fetch(`${API_BASE}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jobData),
  });
  if (!res.ok) throw new Error(`Failed to create job: ${res.statusText}`);
  return res.json();
}

export async function getJob(id) {
  const res = await fetch(`${API_BASE}/jobs/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch job: ${res.statusText}`);
  return res.json();
}

export async function updateJob(id, jobData) {
  const res = await fetch(`${API_BASE}/jobs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jobData),
  });
  if (!res.ok) throw new Error(`Failed to update job: ${res.statusText}`);
  return res.json();
}

export async function deleteJob(id) {
  const res = await fetch(`${API_BASE}/jobs/${id}`, { method: "DELETE" });
  if (res.status !== 204) throw new Error(`Failed to delete job: ${res.statusText}`);
}

export async function scrapeJobs() {
  const res = await fetch(`${API_BASE}/jobs/scrape`, { method: "POST" });
  if (!res.ok) throw new Error(`Failed to scrape jobs: ${res.statusText}`);
  return res.json();
}
