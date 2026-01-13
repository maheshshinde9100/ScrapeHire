from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api_router import router
from app.db.session import engine, Base

app = FastAPI(title="ScrapeHire API")

# simple CORS for local development (adjust origins in production)
app.add_middleware(
	CORSMiddleware,
	allow_origins=["http://localhost:3000"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
	# ensure database tables exist
	Base.metadata.create_all(bind=engine)


app.include_router(router)
