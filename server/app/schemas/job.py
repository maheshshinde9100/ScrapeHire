from pydantic import BaseModel
from typing import Optional


class JobBase(BaseModel):
    title: str
    company: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None


class JobCreate(JobBase):
    pass


class JobRead(JobBase):
    id: int
    created_at: Optional[str]

    class Config:
        orm_mode = True
