from fastapi import FastAPI
from app.api.api_router import router

app = FastAPI(title="ScrapeHire API")

app.include_router(router)
