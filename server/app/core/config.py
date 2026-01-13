import os
from types import SimpleNamespace
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
	"DATABASE_URL", "postgresql://postgres:password@localhost:5432/scrapehire"
)

settings = SimpleNamespace(DATABASE_URL=DATABASE_URL)
