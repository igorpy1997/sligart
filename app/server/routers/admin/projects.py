# app/server/routers/admin/projects.py - ПОЛНАЯ ВЕРСИЯ С ОТДЕЛЬНОЙ ТАБЛИЦЕЙ ФОТОК
from fastapi import APIRouter, HTTPException, Query, Request, Response, UploadFile, File, Depends
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import json

from storages.psql.models.project_model import DBProjectModel
from storages.psql.models.project_photo_model import DBProjectPhotoModel  # НОВЫЙ ИМПОРТ
from services.r2_service import R2Service
from settings import Settings

router = APIRouter(prefix="/projects", tags=["admin-projects"])


# Pydantic схемы - ОБНОВЛЕННЫЕ
class ProjectResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    image_urls: Optional[List[str]] = None  # Теперь генерируется из photos
    status: str
    featured: bool
    project_type: Optional[str] = None
    category: Optional[str] = None
    duration_months: Optional[int] = None
    budget_range: Optional[str] = None
    developer_ids: Optional[List[int]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    status: str = "draft"
    featured: bool = False
    project_type: Optional[str] = None
    category: Optional[str] = None
    duration_months: Optional[int] = None
    budget_range: Optional[str] = None
    developer_ids: Optional[List[int]] = None

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    status: Optional[str] = None
    featured: Optional[bool] = None
    project_type: Optional[str] = None
    category: Optional[str] = None
    duration_months: Optional[int] = None
    budget_range: Optional[str] = None
    developer_ids: Optional[List[int]] = None

def get_r2_service() -> R2Service:
    """Dependency для получения R2 сервиса"""
    settings = Settings()
    return R2Service(settings)

def project_to_dict(project):
    """Convert project model to dict with developers and photos"""
    # Собираем URL фоток из связанной таблицы
    image_urls = [photo.photo_url for photo in project.photos] if project.photos else []

    return {
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "short_description": project.short_description,
        "demo_url": project.demo_url,
        "github_url": project.github_url,
        "image_urls": image_urls,  # Теперь из отдельной таблицы
        "status": project.status,
        "featured": project.featured,
        "project_type": project.project_type,
        "category": project.category,
        "duration_months": project.duration_months,
        "budget_range": project.budget_range,
        "developer_ids": [dev.id for dev in project.developers] if project.developers else [],
        "created_at": project.created_at.isoformat(),
        "updated_at": project.updated_at.isoformat()
    }

@router.get("")
async def get_projects(
        request: Request,
        _start: int = Query(0),
        _end: int = Query(10),
        _sort: str = Query("id"),
        _order: str = Query("ASC"),
        category: Optional[str] = Query(None),
):
    async with request.app.state.db_session() as db:
        # ВАЖНО: загружаем фотки через selectinload
        query = select(DBProjectModel).options(
            selectinload(DBProjectModel.developers),
            selectinload(DBProjectModel.photos)  # ЗАГРУЖАЕМ ФОТКИ
        )

        if category:
            query = query.where(DBProjectModel.category == category)

        # Sorting
        if hasattr(DBProjectModel, _sort):
            if _order.upper() == "DESC":
                query = query.order_by(getattr(DBProjectModel, _sort).desc())
            else:
                query = query.order_by(getattr(DBProjectModel, _sort))

        # Get total count first
        count_query = select(func.count(DBProjectModel.id))
        if category:
            count_query = count_query.where(DBProjectModel.category == category)
        count_result = await db.execute(count_query)
        total = count_result.scalar()

        # Pagination
        query = query.offset(_start).limit(_end - _start)

        result = await db.execute(query)
        projects = result.scalars().all()

        # Convert to dicts
        projects_data = [project_to_dict(project) for project in projects]

        # Calculate end index for Content-Range
        actual_end = min(_start + len(projects_data) - 1, total - 1) if projects_data else _start - 1

        return Response(
            content=json.dumps(projects_data),
            headers={
                "Content-Range": f"items {_start}-{actual_end}/{total}",
                "Access-Control-Expose-Headers": "Content-Range"
            },
            media_type="application/json"
        )

@router.get("/{project_id}")
async def get_project(project_id: int, request: Request):
    async with request.app.state.db_session() as db:
        query = select(DBProjectModel).options(
            selectinload(DBProjectModel.developers),
            selectinload(DBProjectModel.photos)  # ЗАГРУЖАЕМ ФОТКИ
        ).where(DBProjectModel.id == project_id)
        result = await db.execute(query)
        project = result.scalar_one_or_none()

        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        return project_to_dict(project)

# НОВЫЙ ПРОСТОЙ ENDPOINT ДЛЯ ЗАГРУЗКИ ФОТОК - БЕЗ ЕБУЧИХ JSON
@router.post("/{project_id}/photos")
async def upload_project_photos(
        project_id: int,
        request: Request,
        photos: List[UploadFile] = File(...),
        r2_service: R2Service = Depends(get_r2_service)
):
    """Загружает фотографии для проекта В ОТДЕЛЬНУЮ ТАБЛИЦУ"""
    async with request.app.state.db_session() as db:
        # Проверяем что проект существует
        query = select(DBProjectModel).where(DBProjectModel.id == project_id)
        result = await db.execute(query)
        db_project = result.scalar_one_or_none()

        if not db_project:
            raise HTTPException(status_code=404, detail="Project not found")

        uploaded_urls = []

        # Получаем текущий максимальный order_index
        max_order_query = select(func.max(DBProjectPhotoModel.order_index)).where(
            DBProjectPhotoModel.project_id == project_id
        )
        max_order_result = await db.execute(max_order_query)
        max_order = max_order_result.scalar() or 0

        # Загружаем каждое фото
        for i, photo in enumerate(photos, 1):
            try:
                print(f"📸 Uploading photo {i}/{len(photos)}: {photo.filename}")

                # Загружаем в R2
                photo_url = await r2_service.upload_project_screenshot(photo, project_id)
                uploaded_urls.append(photo_url)
                print(f"📸 UPLOADED: {photo_url}")

                # СОЗДАЕМ ЗАПИСЬ В ТАБЛИЦЕ ФОТОК
                db_photo = DBProjectPhotoModel(
                    project_id=project_id,
                    photo_url=photo_url,
                    photo_name=photo.filename,
                    order_index=max_order + i
                )
                db.add(db_photo)
                print(f"📸 ADDED TO DB: {photo_url}")

            except Exception as e:
                print(f"Failed to upload photo: {e}")

        # Коммитим все новые фотки
        await db.commit()

        # Считаем общее количество фоток проекта
        count_query = select(func.count(DBProjectPhotoModel.id)).where(
            DBProjectPhotoModel.project_id == project_id
        )
        count_result = await db.execute(count_query)
        total_photos = count_result.scalar()

        return {
            "message": f"Uploaded {len(uploaded_urls)} photos",
            "uploaded_urls": uploaded_urls,
            "total_images": total_photos
        }

@router.delete("/{project_id}/photos")
async def delete_project_photo(
        project_id: int,
        request: Request,
        photo_url: str = Query(..., description="URL of photo to delete"),
        r2_service: R2Service = Depends(get_r2_service)
):
    """Удаляет конкретную фотографию проекта"""
    async with request.app.state.db_session() as db:
        # Находим фото в БД
        photo_query = select(DBProjectPhotoModel).where(
            DBProjectPhotoModel.project_id == project_id,
            DBProjectPhotoModel.photo_url == photo_url
        )
        photo_result = await db.execute(photo_query)
        db_photo = photo_result.scalar_one_or_none()

        if not db_photo:
            raise HTTPException(status_code=404, detail="Photo not found")

        # Удаляем из R2
        await r2_service.delete_project_screenshot(photo_url)

        # Удаляем из БД
        await db.delete(db_photo)
        await db.commit()

        # Считаем оставшиеся фотки
        count_query = select(func.count(DBProjectPhotoModel.id)).where(
            DBProjectPhotoModel.project_id == project_id
        )
        count_result = await db.execute(count_query)
        remaining_photos = count_result.scalar()

        return {
            "message": "Photo deleted successfully",
            "remaining_images": remaining_photos
        }

@router.delete("/{project_id}")
async def delete_project(
        project_id: int,
        request: Request,
        r2_service: R2Service = Depends(get_r2_service)
):
    async with request.app.state.db_session() as db:
        # Загружаем проект с фотками
        query = select(DBProjectModel).options(
            selectinload(DBProjectModel.photos)
        ).where(DBProjectModel.id == project_id)
        result = await db.execute(query)
        db_project = result.scalar_one_or_none()

        if not db_project:
            raise HTTPException(status_code=404, detail="Project not found")

        # Удаляем все фото из R2
        for photo in db_project.photos:
            await r2_service.delete_project_screenshot(photo.photo_url)

        # Удаляем проект (фотки удалятся автоматически через cascade)
        await db.delete(db_project)
        await db.commit()

        return {"message": "Project deleted"}

@router.delete("")
async def delete_many_projects(
        request: Request,
        ids: str = Query(..., description="Comma-separated list of IDs"),
        r2_service: R2Service = Depends(get_r2_service)
):
    """Массовое удаление проектов"""
    async with request.app.state.db_session() as db:
        try:
            project_ids = [int(id.strip()) for id in ids.split(',')]
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid IDs format")

        # Загружаем проекты с фотками
        query = select(DBProjectModel).options(
            selectinload(DBProjectModel.photos)
        ).where(DBProjectModel.id.in_(project_ids))
        result = await db.execute(query)
        projects = result.scalars().all()

        if not projects:
            raise HTTPException(status_code=404, detail="No projects found")

        # Удаляем все фото проектов из R2
        for project in projects:
            for photo in project.photos:
                await r2_service.delete_project_screenshot(photo.photo_url)

        # Удаляем проекты (фотки удалятся автоматически через cascade)
        for project in projects:
            await db.delete(project)

        await db.commit()

        return {
            "message": f"Deleted {len(projects)} projects",
            "deleted_ids": [proj.id for proj in projects]
        }

# ENDPOINTS ДЛЯ ПОЛУЧЕНИЯ КАТЕГОРИЙ И СТАТИСТИКИ

@router.get("/categories/list")
async def get_project_categories(request: Request):
    """Получить список всех уникальных категорий проектов"""
    async with request.app.state.db_session() as db:
        query = select(DBProjectModel.category).distinct().where(DBProjectModel.category.is_not(None))
        result = await db.execute(query)
        categories = result.scalars().all()

        return {"categories": categories}

@router.get("/stats/by-category")
async def get_projects_stats_by_category(request: Request):
    """Получить статистику проектов по категориям"""
    async with request.app.state.db_session() as db:
        query = select(
            DBProjectModel.category,
            func.count(DBProjectModel.id).label("count")
        ).group_by(DBProjectModel.category)

        result = await db.execute(query)
        stats = {row.category or "Uncategorized": row.count for row in result}

        return {"by_category": stats}

# CREATE PROJECT
@router.post("")
async def create_project(project: ProjectCreate, request: Request):
    async with request.app.state.db_session() as db:
        # Создаем проект БЕЗ связей
        project_data = project.dict()
        developer_ids = project_data.pop("developer_ids", [])

        db_project = DBProjectModel(**project_data)
        db.add(db_project)
        await db.flush()  # Получаем ID проекта

        # Добавляем связи через raw SQL или insert statements
        if developer_ids:
            # Импортируем Table для прямых операций
            from storages.psql.models.project_model import project_developers
            from sqlalchemy import insert

            # Создаем записи в промежуточной таблице
            stmt = insert(project_developers).values([
                {"project_id": db_project.id, "developer_id": dev_id}
                for dev_id in developer_ids
            ])
            await db.execute(stmt)

        await db.commit()
        await db.refresh(db_project)

        # Загружаем проект с связями для ответа
        fresh_query = (
            select(DBProjectModel)
            .options(
                selectinload(DBProjectModel.developers),
                selectinload(DBProjectModel.photos)
            )
            .where(DBProjectModel.id == db_project.id)
        )
        fresh_result = await db.execute(fresh_query)
        fresh_project = fresh_result.scalar_one()

        return project_to_dict(fresh_project)

# UPDATE PROJECT
@router.put("/{project_id}")
async def update_project(project_id: int, project: ProjectUpdate, request: Request):
    async with request.app.state.db_session() as db:
        # Загружаем проект
        query = (
            select(DBProjectModel)
            .options(
                selectinload(DBProjectModel.developers),
                selectinload(DBProjectModel.photos)
            )
            .where(DBProjectModel.id == project_id)
        )
        result = await db.execute(query)
        db_project = result.scalar_one_or_none()

        if not db_project:
            raise HTTPException(status_code=404, detail="Project not found")

        # Обновляем простые поля
        update_data = project.dict(exclude_unset=True)
        developer_ids = update_data.pop("developer_ids", None)

        for field, value in update_data.items():
            setattr(db_project, field, value)

        # Обновляем связи с разработчиками
        if developer_ids is not None:
            from storages.psql.models.project_model import project_developers
            from sqlalchemy import delete, insert

            # Удаляем старые связи
            delete_stmt = delete(project_developers).where(
                project_developers.c.project_id == project_id
            )
            await db.execute(delete_stmt)

            # Добавляем новые связи
            if developer_ids:
                insert_stmt = insert(project_developers).values([
                    {"project_id": project_id, "developer_id": dev_id}
                    for dev_id in developer_ids
                ])
                await db.execute(insert_stmt)

        await db.commit()

        # Заново загружаем проект с обновленными связями
        fresh_query = (
            select(DBProjectModel)
            .options(
                selectinload(DBProjectModel.developers),
                selectinload(DBProjectModel.photos)
            )
            .where(DBProjectModel.id == project_id)
        )
        fresh_result = await db.execute(fresh_query)
        fresh_project = fresh_result.scalar_one()

        return project_to_dict(fresh_project)