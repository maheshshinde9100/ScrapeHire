import os
from types import SimpleNamespace
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
	DATABASE_URL = f"sqlite:///./scrapehire.db"

settings = SimpleNamespace(DATABASE_URL=DATABASE_URL)
