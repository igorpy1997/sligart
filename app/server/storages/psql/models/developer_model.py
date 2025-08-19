# app/server/storages/psql/models/developer_model.py
from datetime import datetime
from sqlalchemy import DateTime, Integer, String, Text, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column
from storages.psql.base import Base

class DBDeveloperModel(Base):
    __tablename__ = "developers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    bio: Mapped[str] = mapped_column(Text, nullable=True)
    avatar_url: Mapped[str] = mapped_column(String(500), nullable=True)
    github_url: Mapped[str] = mapped_column(String(255), nullable=True)
    linkedin_url: Mapped[str] = mapped_column(String(255), nullable=True)
    portfolio_url: Mapped[str] = mapped_column(String(255), nullable=True)
    years_experience: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    hourly_rate: Mapped[int] = mapped_column(Integer, nullable=True)
    skills: Mapped[list] = mapped_column(JSON, nullable=True)
    specialization: Mapped[str] = mapped_column(String(100), nullable=False, default="Full-Stack Developer")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"Developer(id={self.id}, name={self.name}, email={self.email})"