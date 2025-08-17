from datetime import datetime
from sqlalchemy import DateTime, Integer, String, Text, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from storages.psql.base import Base

class DBServiceRequestModel(Base):
    __tablename__ = "service_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    client_name: Mapped[str] = mapped_column(String(100), nullable=False)
    client_email: Mapped[str] = mapped_column(String(255), nullable=False)
    client_phone: Mapped[str] = mapped_column(String(50), nullable=True)
    company_name: Mapped[str] = mapped_column(String(100), nullable=True)
    project_type: Mapped[str] = mapped_column(String(50), nullable=False)
    budget_range: Mapped[str] = mapped_column(String(50), nullable=True)
    timeline: Mapped[str] = mapped_column(String(100), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    requirements: Mapped[dict] = mapped_column(JSON, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="new", nullable=False)
    priority: Mapped[str] = mapped_column(String(20), default="medium", nullable=False)
    developer_id: Mapped[int] = mapped_column(Integer, ForeignKey('developers.id'), nullable=True)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"ServiceRequest(id={self.id}, client={self.client_name}, status={self.status})"