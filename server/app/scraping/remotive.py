import requests


def scrape_remotive():
	# Remotive provides a jobs API; use it to fetch remote jobs
	url = "https://remotive.com/api/remote-jobs"
	try:
		res = requests.get(url, timeout=10)
		res.raise_for_status()
		data = res.json()
		jobs = []
		for item in data.get("jobs", []):
			jobs.append(
				{
					"title": item.get("title"),
					"company": item.get("company_name"),
					"description": item.get("description"),
					"url": item.get("url"),
				}
			)
		return jobs
	except Exception:
		return []
