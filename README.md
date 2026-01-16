# ScrapeHire

A full-stack job listing application built with **FastAPI** (backend), **Next.js** (frontend), **PostgreSQL** (database), and **TailwindCSS** (styling). Scrape remote jobs from multiple sources and manage them in a beautiful web interface.

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy, PostgreSQL (with SQLite fallback)
- **Frontend**: Next.js 16, React 19, TailwindCSS 4
- **Scraping**: BeautifulSoup4, Requests
- **Database**: PostgreSQL 12+ or SQLite (local dev)

## Features

- ✅ Scrape job listings from RemoteOK and Remotive
- ✅ Full CRUD operations on job listings
- ✅ Search and filter jobs by title/company
- ✅ Sort by date, title, or company
- ✅ Beautiful responsive UI with TailwindCSS
- ✅ API-driven architecture with clear separation of concerns
- ✅ Automatic database creation and migrations
- ✅ Error handling and loading states

## Project Structure

```
.
├── server/                       # FastAPI backend
│   ├── app/
│   │   ├── main.py              # FastAPI app entry
│   │   ├── core/config.py        # Configuration
│   │   ├── db/session.py         # Database setup
│   │   ├── models/job.py         # SQLAlchemy Job model
│   │   ├── schemas/job.py        # Pydantic schemas
│   │   ├── services/job_service.py  # Business logic
│   │   ├── api/
│   │   │   ├── api_router.py     # API router
│   │   │   └── routes/jobs.py    # Job endpoints
│   │   └── scraping/
│   │       ├── remoteok.py       # RemoteOK scraper
│   │       └── remotive.py       # Remotive scraper
│   ├── requirements.txt           # Python dependencies
│   └── .env                       # Environment variables
└── client/                        # Next.js frontend
    ├── src/
    │   ├── app/
    │   │   ├── page.js           # Home page
    │   │   ├── layout.js         # Root layout
    │   │   └── globals.css       # Global styles
    │   ├── components/
    │   │   ├── JobCard.js        # Job listing card
    │   │   ├── JobForm.js        # Job add form
    │   │   └── SearchBar.js      # Search & filter
    │   └── lib/api.js            # API client utility
    ├── package.json              # Node dependencies
    └── next.config.mjs           # Next.js config
```

## Setup & Installation

### Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL 12+ (optional; SQLite works for local dev)

### 1. Backend Setup

```bash
cd server

# Create virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Configure Database** (optional)

By default, the app uses SQLite (`scrapehire.db` in the server root). To use PostgreSQL:

1. Create a PostgreSQL database:
```bash
createdb -U postgres scrapehire
```

2. Create or update `server/.env`:
```dotenv
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/scrapehire
```

**Run Backend**

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: **http://localhost:8000**

API docs (Swagger UI): **http://localhost:8000/docs**

### 2. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend will be available at: **http://localhost:3000**

## API Endpoints

### Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/jobs` | List jobs (supports search, pagination, sorting) |
| POST | `/jobs` | Create a new job |
| GET | `/jobs/{id}` | Get a single job |
| PATCH | `/jobs/{id}` | Update a job |
| DELETE | `/jobs/{id}` | Delete a job |
| POST | `/jobs/scrape` | Scrape jobs from remote sources |

### Query Parameters

- **search**: Search jobs by title or company
- **skip**: Pagination offset (default: 0)
- **limit**: Items per page (default: 100)
- **sort_by**: Sort field (`created_at`, `title`, `company`)
- **order**: Sort order (`asc`, `desc`)

### Example Requests

```bash
# List all jobs
curl http://localhost:8000/jobs

# Search jobs
curl "http://localhost:8000/jobs?search=python"

# Create a job
curl -X POST http://localhost:8000/jobs \
  -H "Content-Type: application/json" \
  -d '{"title": "Python Dev", "company": "Acme", "url": "https://..."}'

# Scrape jobs
curl -X POST http://localhost:8000/jobs/scrape

# Delete a job
curl -X DELETE http://localhost:8000/jobs/1
```

## Usage

1. **Start Backend & Frontend** (see Setup above)
2. **Open Frontend**: http://localhost:3000
3. **Scrape Jobs**: Click the "Scrape Jobs" button to import from RemoteOK
4. **Search & Filter**: Use the search bar and sort dropdowns
5. **Add Jobs Manually**: Fill the form on the left and click "Add Job"
6. **Delete Jobs**: Click the "Delete" button on any job card

## Environment Variables

### Backend (`.env` in `server/`)

```dotenv
# Database URL (optional; defaults to SQLite)
DATABASE_URL=postgresql://postgres:password@localhost:5432/scrapehire
```

### Frontend (client)

Update `API_BASE` in `src/lib/api.js` if backend runs on a different URL.

## Development

### Backend

- Tests: `pytest` (add to requirements.txt for full test setup)
- API docs: http://localhost:8000/docs (Swagger UI)
- Code style: Follow PEP 8

### Frontend

- TailwindCSS: Update styles in component classes
- API calls: Use functions from `src/lib/api.js`
- Components: Reusable components in `src/components/`

## Deployment

### Backend (Render, Railway, Heroku)

1. Set `DATABASE_URL` environment variable
2. Install dependencies: `pip install -r server/requirements.txt`
3. Run: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel, Netlify)

1. Update `API_BASE` in `src/lib/api.js` to your production backend URL
2. Deploy to Vercel: `vercel deploy`

## Troubleshooting

### CORS Errors
- Ensure backend is running and accessible from the frontend URL
- Check `allow_origins` in `app/main.py`

### Database Connection Errors
- Check `DATABASE_URL` in `.env`
- Verify PostgreSQL is running (or use SQLite fallback)
- For auto DB creation, ensure user has sufficient permissions

### Jobs Not Scraped
- RemoteOK/Remotive APIs may have changed; check scraper code
- Verify internet connection
- Check server logs for detailed errors

## Contributing

Feel free to fork, improve, and submit pull requests!

