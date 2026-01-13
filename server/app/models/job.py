from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.db.session import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(256), nullable=False)
    company = Column(String(256), nullable=True)
    description = Column(Text, nullable=True)
    url = Column(String(512), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
