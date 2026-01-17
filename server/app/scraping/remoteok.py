import requests
from bs4 import BeautifulSoup

def scrape_remoteok():
    url = "https://remoteok.com/remote-dev-jobs"
    headers = {"User-Agent": "Mozilla/5.0"}
    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, "html.parser")

    jobs = []
    for job in soup.select("tr.job"):
        title = job.select_one("h2")
        company = job.select_one("h3")
        if title and company:
            url_suffix = job.get("data-href")
            full_url = f"https://remoteok.com{url_suffix}" if url_suffix else None
            
            jobs.append({
                "title": title.text.strip(),
                "company": company.text.strip(),
                "url": full_url,
                "description": "" # RemoteOK doesn't easily expose desc in the list view
            })
    return jobs
