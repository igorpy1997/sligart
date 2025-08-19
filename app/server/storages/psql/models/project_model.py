# app/server/storages/psql/models/project_model.py
from datetime import datetime
from sqlalchemy import DateTime, Integer, String, Text, Boolean, JSON, ForeignKey, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from storages.psql.base import Base

# Промежуточная таблица для связи many-to-many между проектами и разработчиками
project_developers = Table(
    'project_developers',
    Base.metadata,
    Column('project_id', Integer, ForeignKey('projects.id'), primary_key=True),
    Column('developer_id', Integer, ForeignKey('developers.id'), primary_key=True)
)

class DBProjectModel(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    short_description: Mapped[str] = mapped_column(String(500), nullable=True)
    demo_url: Mapped[str] = mapped_column(String(500), nullable=True)
    github_url: Mapped[str] = mapped_column(String(500), nullable=True)
    image_urls: Mapped[list] = mapped_column(JSON, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="active", nullable=False)
    featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    project_type: Mapped[str] = mapped_column(String(50), nullable=True)
    category: Mapped[str] = mapped_column(String(50), nullable=True)
    duration_months: Mapped[int] = mapped_column(Integer, nullable=True)
    budget_range: Mapped[str] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Связь many-to-many с разработчиками
    developers: Mapped[list["DBDeveloperModel"]] = relationship(
        "DBDeveloperModel",
        secondary=project_developers,
        back_populates="projects",
        lazy="selectin"  # Добавил это чтобы избежать lazy loading
    )

    def __repr__(self) -> str:
        return f"Project(id={self.id}, title={self.title}, status={self.status})"