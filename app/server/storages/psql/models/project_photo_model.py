# СОЗДАЙ НОВЫЙ ФАЙЛ: app/server/storages/psql/models/project_photo_model.py

from datetime import datetime
from sqlalchemy import DateTime, Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from storages.psql.base import Base

class DBProjectPhotoModel(Base):
    __tablename__ = "project_photos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(Integer, ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    photo_url: Mapped[str] = mapped_column(String(500), nullable=False)
    photo_name: Mapped[str] = mapped_column(String(255), nullable=True)  # Имя файла
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)  # Порядок отображения
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Связь с проектом
    project: Mapped["DBProjectModel"] = relationship("DBProjectModel", back_populates="photos")

    def __repr__(self) -> str:
        return f"ProjectPhoto(id={self.id}, project_id={self.project_id}, photo_url={self.photo_url})"