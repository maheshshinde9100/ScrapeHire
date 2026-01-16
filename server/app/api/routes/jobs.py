from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.job_service import get_jobs, create_job, get_job, delete_job, update_job
from app.schemas.job import JobCreate, JobRead
from typing import List


router = APIRouter()


@router.get("", response_model=List[JobRead])
def list_jobs(skip: int = 0, limit: int = 100, search: str = None, sort_by: str = "created_at", order: str = "desc", db: Session = Depends(get_db)):
    return get_jobs(db, skip=skip, limit=limit, search=search, sort_by=sort_by, order=order)


@router.post("", response_model=JobRead)
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



@router.get("/{job_id}", response_model=JobRead)
def read_job(job_id: int, db: Session = Depends(get_db)):
    job = get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.patch("/{job_id}", response_model=JobRead)
def edit_job(job_id: int, job_in: JobCreate, db: Session = Depends(get_db)):
    job = update_job(db, job_id, job_in)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_job(job_id: int, db: Session = Depends(get_db)):
    ok = delete_job(db, job_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Job not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)

