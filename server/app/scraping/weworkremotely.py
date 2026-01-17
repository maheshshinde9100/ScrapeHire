import requests
from bs4 import BeautifulSoup

def scrape_weworkremotely():
    # We Work Remotely RSS Feed
    rss_url = "https://weworkremotely.com/categories/remote-programming-jobs.rss"
    try:
        res = requests.get(rss_url, timeout=10)
        res.raise_for_status()
        
        # Use simple XML parsing
        soup = BeautifulSoup(res.content, "xml")
        items = soup.find_all("item")
        
        jobs = []
        for item in items:
            title = item.find("title").text if item.find("title") else "Unknown Role"
            # Title is often "Company: Role" or "Role", let's leave it as is
            
            company = "WeWorkRemotely" # RSS doesn't always have clean company tag, sometimes inside title
            # Try to parse "Company: Role" format if possible, but WWR format varies.
            # Usually <title>Role</title> and <description>...Company...</description>
            # But in WWR RSS: <title>Company: Role</title>
            
            if ":" in title:
                parts = title.split(":", 1)
                company = parts[0].strip()
                title = parts[1].strip()
            
            link = item.find("link").text if item.find("link") else None
            description = item.find("description").text if item.find("description") else ""
            
            # clean html from description if needed, or keep it. Database is Text.
            # remove html tags for cleaner text preview
            desc_soup = BeautifulSoup(description, "html.parser")
            clean_desc = desc_soup.get_text()[:500] + "..." if desc_soup.get_text() else ""

            if link:
                jobs.append({
                    "title": title,
                    "company": company,
                    "description": clean_desc,
                    "url": link
                })
        return jobs
    except Exception as e:
        print(f"Error scraping WWR: {e}")
        return []
