# app/server/routers/admin/projects.py
from fastapi import APIRouter, HTTPException, Query, Request, Response, UploadFile, File, Depends
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import json

from storages.psql.models.project_model import DBProjectModel
from services.r2_service import R2Service
from settings import Settings

router = APIRouter(prefix="/projects", tags=["admin-projects"])


# Pydantic схемы
class ProjectResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    image_urls: Optional[List[str]] = None
    status: str
    featured: bool
    project_type: Optional[str] = None
    category: Optional[str] = None  # Новое поле
    duration_months: Optional[int] = None
    budget_range: Optional[str] = None
    developer_ids: Optional[List[int]] = None  # ID разработчиков
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
    image_urls: Optional[List[str]] = None
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
    image_urls: Optional[List[str]] = None
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
    """Convert project model to dict with developers"""
    return {
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "short_description": project.short_description,
        "demo_url": project.demo_url,
        "github_url": project.github_url,
        "image_urls": project.image_urls or [],
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
        category: Optional[str] = Query(None),  # Фильтр по категории
):
    async with request.app.state.db_session() as db:
        query = select(DBProjectModel).options(selectinload(DBProjectModel.developers))

        # Фильтр по категории
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
        query = select(DBProjectModel).options(selectinload(DBProjectModel.developers)).where(DBProjectModel.id == project_id)
        result = await db.execute(query)
        project = result.scalar_one_or_none()

        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        return project_to_dict(project)


@router.delete("/{project_id}")
async def delete_project(
        project_id: int,
        request: Request,
        r2_service: R2Service = Depends(get_r2_service)
):
    async with request.app.state.db_session() as db:
        query = select(DBProjectModel).where(DBProjectModel.id == project_id)
        result = await db.execute(query)
        db_project = result.scalar_one_or_none()

        if not db_project:
            raise HTTPException(status_code=404, detail="Project not found")

        # Удаляем все фото проекта из R2
        if db_project.image_urls:
            for image_url in db_project.image_urls:
                await r2_service.delete_project_screenshot(image_url)

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

        query = select(DBProjectModel).where(DBProjectModel.id.in_(project_ids))
        result = await db.execute(query)
        projects = result.scalars().all()

        if not projects:
            raise HTTPException(status_code=404, detail="No projects found")

        # Удаляем все фото проектов
        for project in projects:
            if project.image_urls:
                for image_url in project.image_urls:
                    await r2_service.delete_project_screenshot(image_url)

        # Удаляем проекты
        for project in projects:
            await db.delete(project)

        await db.commit()

        return {
            "message": f"Deleted {len(projects)} projects",
            "deleted_ids": [proj.id for proj in projects]
        }

# ENDPOINTS ДЛЯ РАБОТЫ С ФОТОГРАФИЯМИ ПРОЕКТОВ

# В файле app/server/routers/admin/projects.py

# ЗАМЕНИ ЭТОТ ENDPOINT:
@router.post("/{project_id}/photos")
async def upload_project_photos(
        project_id: int,
        request: Request,
        photos: List[UploadFile] = File(...),
        r2_service: R2Service = Depends(get_r2_service)
):
    """Загружает фотографии для проекта"""
    async with request.app.state.db_session() as db:
        query = select(DBProjectModel).where(DBProjectModel.id == project_id)
        result = await db.execute(query)
        db_project = result.scalar_one_or_none()

        if not db_project:
            raise HTTPException(status_code=404, detail="Project not found")

        uploaded_urls = []
        # ВАЖНО: Получаем текущие изображения, чтобы НЕ перезаписать их
        current_images = db_project.image_urls or []

        # Загружаем каждое фото
        for photo in photos:
            try:
                photo_url = await r2_service.upload_project_screenshot(photo, project_id)
                uploaded_urls.append(photo_url)
                # ДОБАВЛЯЕМ к существующим, а не заменяем!
                current_images.append(photo_url)
            except Exception as e:
                # Если одно фото не загрузилось, продолжаем с остальными
                print(f"Failed to upload photo: {e}")

        # Обновляем список изображений в БД (ДОБАВИЛИ новые к старым)
        db_project.image_urls = current_images
        await db.commit()
        await db.refresh(db_project)

        return {
            "message": f"Uploaded {len(uploaded_urls)} photos",
            "uploaded_urls": uploaded_urls,
            "total_images": len(current_images)  # Общее количество фотографий
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
        query = select(DBProjectModel).where(DBProjectModel.id == project_id)
        result = await db.execute(query)
        db_project = result.scalar_one_or_none()

        if not db_project:
            raise HTTPException(status_code=404, detail="Project not found")

        if not db_project.image_urls or photo_url not in db_project.image_urls:
            raise HTTPException(status_code=404, detail="Photo not found in project")

        # Удаляем из R2
        await r2_service.delete_project_screenshot(photo_url)

        # Удаляем из списка в БД
        updated_images = [url for url in db_project.image_urls if url != photo_url]
        db_project.image_urls = updated_images
        await db.commit()
        await db.refresh(db_project)

        return {
            "message": "Photo deleted successfully",
            "remaining_images": len(updated_images)
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

# app/server/routers/admin/projects.py
# Заменяем функцию create_project

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
            .options(selectinload(DBProjectModel.developers))
            .where(DBProjectModel.id == db_project.id)
        )
        fresh_result = await db.execute(fresh_query)
        fresh_project = fresh_result.scalar_one()

        return project_to_dict(fresh_project)


@router.put("/{project_id}")
async def update_project(project_id: int, project: ProjectUpdate, request: Request):
    async with request.app.state.db_session() as db:
        # Загружаем проект
        query = (
            select(DBProjectModel)
            .options(selectinload(DBProjectModel.developers))
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
            .options(selectinload(DBProjectModel.developers))
            .where(DBProjectModel.id == project_id)
        )
        fresh_result = await db.execute(fresh_query)
        fresh_project = fresh_result.scalar_one()

        return project_to_dict(fresh_project)