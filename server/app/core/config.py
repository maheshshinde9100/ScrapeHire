import os
from types import SimpleNamespace
from dotenv import load_dotenv

load_dotenv()

# Prefer a DATABASE_URL from the environment; fall back to a local SQLite file for
# easy local development so the app starts without a running Postgres server.
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
	DATABASE_URL = f"sqlite:///./scrapehire.db"

settings = SimpleNamespace(DATABASE_URL=DATABASE_URL)
