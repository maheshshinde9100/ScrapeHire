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
            jobs.append({
                "title": title.text.strip(),
                "company": company.text.strip()
            })
    return jobs
