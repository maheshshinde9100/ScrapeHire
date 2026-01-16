from sqlalchemy.orm import Session
from typing import List
from app.models.job import Job
from app.schemas.job import JobCreate


def get_jobs(db: Session, skip: int = 0, limit: int = 100, search: str = None, sort_by: str = "created_at", order: str = "desc") -> List[Job]:
    query = db.query(Job)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Job.title.ilike(search_term)) | (Job.company.ilike(search_term))
        )
    
    if sort_by == "title":
        query = query.order_by(Job.title.desc() if order == "desc" else Job.title.asc())
    elif sort_by == "company":
        query = query.order_by(Job.company.desc() if order == "desc" else Job.company.asc())
    else:
        query = query.order_by(Job.created_at.desc() if order == "desc" else Job.created_at.asc())
    
    return query.offset(skip).limit(limit).all()


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


def get_job(db: Session, job_id: int) -> Job | None:
    return db.query(Job).filter(Job.id == job_id).first()


def delete_job(db: Session, job_id: int) -> bool:
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        return False
    db.delete(job)
    db.commit()
    return True


def update_job(db: Session, job_id: int, job_in: JobCreate) -> Job | None:
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        return None
    job.title = job_in.title
    job.company = job_in.company
    job.description = job_in.description
    job.url = job_in.url
    db.commit()
    db.refresh(job)
    return job
