from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class JobBase(BaseModel):
    title: str
    company: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None


class JobCreate(JobBase):
    pass


class JobRead(JobBase):
    id: int
    created_at: Optional[datetime]

    class Config:
        from_attributes = True
