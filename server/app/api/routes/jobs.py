from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.job_service import get_jobs, create_job
from app.schemas.job import JobCreate, JobRead
from typing import List

router = APIRouter()


@router.get("/", response_model=List[JobRead])
def list_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_jobs(db, skip=skip, limit=limit)


@router.post("/", response_model=JobRead)
def add_job(job_in: JobCreate, db: Session = Depends(get_db)):
    job = create_job(db, job_in)
    return job


@router.post("/scrape", response_model=List[JobRead])
def scrape_and_store(db: Session = Depends(get_db)):
    # run available scrapers and persist any new jobs
    from app.scraping.remoteok import scrape_remoteok

    scraped = scrape_remoteok()
    created = []
    for item in scraped:
        payload = JobCreate(
            title=item.get("title") or "",
            company=item.get("company"),
            description=item.get("description"),
            url=item.get("url"),
        )
        created.append(create_job(db, payload))
    return created
