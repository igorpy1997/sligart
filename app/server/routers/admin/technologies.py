from fastapi import APIRouter, HTTPException, Query, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
import json

from storages.psql.models.technology_model import DBTechnologyModel

router = APIRouter(prefix="/technologies", tags=["admin-technologies"])


# Pydantic схемы
class TechnologyResponse(BaseModel):
    id: int
    name: str
    category: Optional[str] = None
    icon_url: Optional[str] = None
    color: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TechnologyCreate(BaseModel):
    name: str
    category: Optional[str] = None
    icon_url: Optional[str] = None
    color: Optional[str] = None

class TechnologyUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    icon_url: Optional[str] = None
    color: Optional[str] = None

def technology_to_dict(tech):
    """Convert technology model to dict"""
    return {
        "id": tech.id,
        "name": tech.name,
        "category": tech.category,
        "icon_url": tech.icon_url,
        "color": tech.color,
        "created_at": tech.created_at.isoformat()
    }

@router.get("")
async def get_technologies(
        request: Request,
        _start: int = Query(0),
        _end: int = Query(50),  # Технологий обычно меньше, увеличил лимит
        _sort: str = Query("name"),  # По умолчанию сортируем по имени
        _order: str = Query("ASC"),
        category: Optional[str] = Query(None),  # Фильтр по категории
):
    async with request.app.state.db_session() as db:
        query = select(DBTechnologyModel)

        # Фильтр по категории
        if category:
            query = query.where(DBTechnologyModel.category == category)

        # Sorting
        if hasattr(DBTechnologyModel, _sort):
            if _order.upper() == "DESC":
                query = query.order_by(getattr(DBTechnologyModel, _sort).desc())
            else:
                query = query.order_by(getattr(DBTechnologyModel, _sort))

        # Get total count first
        count_query = select(func.count(DBTechnologyModel.id))
        if category:
            count_query = count_query.where(DBTechnologyModel.category == category)
        count_result = await db.execute(count_query)
        total = count_result.scalar()

        # Pagination
        query = query.offset(_start).limit(_end - _start)

        result = await db.execute(query)
        technologies = result.scalars().all()

        # Convert to dicts
        technologies_data = [technology_to_dict(tech) for tech in technologies]

        # Calculate end index for Content-Range
        actual_end = min(_start + len(technologies_data) - 1, total - 1) if technologies_data else _start - 1

        return Response(
            content=json.dumps(technologies_data),
            headers={
                "Content-Range": f"items {_start}-{actual_end}/{total}",
                "Access-Control-Expose-Headers": "Content-Range"
            },
            media_type="application/json"
        )

@router.get("/{technology_id}")
async def get_technology(technology_id: int, request: Request):
    async with request.app.state.db_session() as db:
        query = select(DBTechnologyModel).where(DBTechnologyModel.id == technology_id)
        result = await db.execute(query)
        technology = result.scalar_one_or_none()

        if not technology:
            raise HTTPException(status_code=404, detail="Technology not found")

        return technology_to_dict(technology)

@router.post("")
async def create_technology(technology: TechnologyCreate, request: Request):
    async with request.app.state.db_session() as db:
        # Проверяем что технология с таким именем не существует
        existing_query = select(DBTechnologyModel).where(DBTechnologyModel.name == technology.name)
        existing_result = await db.execute(existing_query)
        existing_tech = existing_result.scalar_one_or_none()

        if existing_tech:
            raise HTTPException(status_code=400, detail="Technology with this name already exists")

        db_technology = DBTechnologyModel(**technology.dict())
        db.add(db_technology)
        await db.commit()
        await db.refresh(db_technology)

        return technology_to_dict(db_technology)

@router.put("/{technology_id}")
async def update_technology(
        technology_id: int,
        technology: TechnologyUpdate,
        request: Request
):
    async with request.app.state.db_session() as db:
        query = select(DBTechnologyModel).where(DBTechnologyModel.id == technology_id)
        result = await db.execute(query)
        db_technology = result.scalar_one_or_none()

        if not db_technology:
            raise HTTPException(status_code=404, detail="Technology not found")

        # Проверяем уникальность имени если оно изменяется
        if technology.name and technology.name != db_technology.name:
            existing_query = select(DBTechnologyModel).where(
                DBTechnologyModel.name == technology.name,
                DBTechnologyModel.id != technology_id
            )
            existing_result = await db.execute(existing_query)
            existing_tech = existing_result.scalar_one_or_none()

            if existing_tech:
                raise HTTPException(status_code=400, detail="Technology with this name already exists")

        # Update fields
        for field, value in technology.dict(exclude_unset=True).items():
            setattr(db_technology, field, value)

        await db.commit()
        await db.refresh(db_technology)
        return technology_to_dict(db_technology)

@router.delete("/{technology_id}")
async def delete_technology(technology_id: int, request: Request):
    async with request.app.state.db_session() as db:
        query = select(DBTechnologyModel).where(DBTechnologyModel.id == technology_id)
        result = await db.execute(query)
        db_technology = result.scalar_one_or_none()

        if not db_technology:
            raise HTTPException(status_code=404, detail="Technology not found")

        await db.delete(db_technology)
        await db.commit()

        return {"message": "Technology deleted"}

# Дополнительный endpoint для получения списка категорий
@router.get("/categories/list")
async def get_technology_categories(request: Request):
    """Получить список всех уникальных категорий технологий"""
    async with request.app.state.db_session() as db:
        query = select(DBTechnologyModel.category).distinct().where(DBTechnologyModel.category.is_not(None))
        result = await db.execute(query)
        categories = result.scalars().all()

        return {"categories": categories}