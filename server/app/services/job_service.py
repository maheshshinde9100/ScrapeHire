from sqlalchemy.orm import Session
from typing import List
from app.models.job import Job
from app.schemas.job import JobCreate


def get_jobs(db: Session, skip: int = 0, limit: int = 100) -> List[Job]:
    return db.query(Job).offset(skip).limit(limit).all()


def create_job(db: Session, job_in: JobCreate) -> Job:
    job = Job(
        title=job_in.title,
        company=job_in.company,
        description=job_in.description,
        url=job_in.url,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job
