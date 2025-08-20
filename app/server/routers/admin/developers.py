from fastapi import APIRouter, HTTPException, Query, Request, Response, UploadFile, File, Form, Depends
from sqlalchemy import select, func
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import json

from storages.psql.models.developer_model import DBDeveloperModel
from services.r2_service import R2Service
from settings import Settings

router = APIRouter(prefix="/developers", tags=["admin-developers"])

# Pydantic схемы
class DeveloperResponse(BaseModel):
    id: int
    name: str
    email: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    years_experience: int
    hourly_rate: Optional[int] = None
    skills: Optional[List[str]] = None
    specialization: str
    is_active: bool
    order_priority: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DeveloperCreate(BaseModel):
    name: str
    email: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    years_experience: int = 0
    hourly_rate: Optional[int] = None
    skills: Optional[List[str]] = None
    specialization: str
    is_active: bool = True
    order_priority: int = 0

class DeveloperUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    years_experience: Optional[int] = None
    hourly_rate: Optional[int] = None
    skills: Optional[List[str]] = None
    specialization: Optional[str] = None
    is_active: Optional[bool] = None
    order_priority: Optional[int] = None

def get_r2_service() -> R2Service:
    """Dependency для получения R2 сервиса"""
    settings = Settings()
    return R2Service(settings)

def developer_to_dict(dev):
    """Convert developer model to dict"""
    return {
        "id": dev.id,
        "name": dev.name,
        "email": dev.email,
        "bio": dev.bio,
        "avatar_url": dev.avatar_url,
        "github_url": dev.github_url,
        "linkedin_url": dev.linkedin_url,
        "portfolio_url": dev.portfolio_url,
        "years_experience": dev.years_experience,
        "hourly_rate": dev.hourly_rate,
        "skills": dev.skills or [],
        "specialization": dev.specialization,
        "is_active": dev.is_active,
        "order_priority": dev.order_priority,
        "created_at": dev.created_at.isoformat(),
        "updated_at": dev.updated_at.isoformat()
    }

@router.get("", response_model=List[DeveloperResponse])
async def get_developers(
        request: Request,
        _start: int = Query(0),
        _end: int = Query(10),
        _sort: str = Query("id"),
        _order: str = Query("ASC"),
):
    async with request.app.state.db_session() as db:
        query = select(DBDeveloperModel)

        # Sorting
        sort_field = getattr(DBDeveloperModel, _sort) if hasattr(DBDeveloperModel, _sort) else DBDeveloperModel.id
        if _order.upper() == "DESC":
            query = query.order_by(sort_field.desc(), DBDeveloperModel.order_priority.desc())
        else:
            query = query.order_by(sort_field.asc(), DBDeveloperModel.order_priority.asc())

        # Get total count first
        count_query = select(func.count(DBDeveloperModel.id))
        count_result = await db.execute(count_query)
        total = count_result.scalar()

        # Pagination
        query = query.offset(_start).limit(_end - _start)

        result = await db.execute(query)
        developers = result.scalars().all()

        # Convert to dicts
        developers_data = [developer_to_dict(dev) for dev in developers]

        # Calculate end index for Content-Range
        actual_end = _start + len(developers_data)

        # Возвращаем ответ с заголовком Content-Range
        return Response(
            content=json.dumps(developers_data),
            headers={"Content-Range": f"items {_start}-{actual_end}/{total}"}
        )

@router.get("/{developer_id}", response_model=DeveloperResponse)
async def get_developer(developer_id: int, request: Request):
    async with request.app.state.db_session() as db:
        query = select(DBDeveloperModel).where(DBDeveloperModel.id == developer_id)
        result = await db.execute(query)
        db_developer = result.scalar_one_or_none()

        if not db_developer:
            raise HTTPException(status_code=404, detail="Developer not found")

        return developer_to_dict(db_developer)

@router.post("", response_model=DeveloperResponse)
async def create_developer(developer: DeveloperCreate, request: Request):
    async with request.app.state.db_session() as db:
        email_check = await db.execute(select(DBDeveloperModel).where(DBDeveloperModel.email == developer.email))
        if email_check.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Email already exists")

        db_developer = DBDeveloperModel(**developer.dict())
        db.add(db_developer)
        await db.commit()
        await db.refresh(db_developer)

        return developer_to_dict(db_developer)

@router.put("/{developer_id}", response_model=DeveloperResponse)
async def update_developer(developer_id: int, developer_update: DeveloperUpdate, request: Request):
    async with request.app.state.db_session() as db:
        query = select(DBDeveloperModel).where(DBDeveloperModel.id == developer_id)
        result = await db.execute(query)
        db_developer = result.scalar_one_or_none()

        if not db_developer:
            raise HTTPException(status_code=404, detail="Developer not found")

        if developer_update.email and developer_update.email != db_developer.email:
            email_check = await db.execute(select(DBDeveloperModel).where(DBDeveloperModel.email == developer_update.email))
            if email_check.scalar_one_or_none():
                raise HTTPException(status_code=400, detail="Email already exists")

        update_data = developer_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_developer, key, value)

        await db.commit()
        await db.refresh(db_developer)

        return developer_to_dict(db_developer)

@router.delete("/{developer_id}")
async def delete_developer(
        developer_id: int,
        request: Request,
        r2_service: R2Service = Depends(get_r2_service)
):
    async with request.app.state.db_session() as db:
        query = select(DBDeveloperModel).where(DBDeveloperModel.id == developer_id)
        result = await db.execute(query)
        db_developer = result.scalar_one_or_none()

        if not db_developer:
            raise HTTPException(status_code=404, detail="Developer not found")

        if db_developer.avatar_url:
            await r2_service.delete_avatar(db_developer.avatar_url)

        await db.delete(db_developer)
        await db.commit()

        return {"message": "Developer deleted"}

@router.delete("")
async def delete_many_developers(
        request: Request,
        ids: str = Query(..., description="Comma-separated list of IDs"),
        r2_service: R2Service = Depends(get_r2_service)
):
    async with request.app.state.db_session() as db:
        try:
            developer_ids = [int(id.strip()) for id in ids.split(',')]
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid IDs format")

        query = select(DBDeveloperModel).where(DBDeveloperModel.id.in_(developer_ids))
        result = await db.execute(query)
        developers = result.scalars().all()

        if not developers:
            raise HTTPException(status_code=404, detail="No developers found")

        for developer in developers:
            if developer.avatar_url:
                await r2_service.delete_avatar(developer.avatar_url)

        for developer in developers:
            await db.delete(developer)

        await db.commit()

        return {
            "message": f"Deleted {len(developers)} developers",
            "deleted_ids": [dev.id for dev in developers]
        }

@router.post("/{developer_id}/avatar")
async def upload_avatar(
        developer_id: int,
        request: Request,
        avatar: UploadFile = File(...),
        r2_service: R2Service = Depends(get_r2_service)
):
    async with request.app.state.db_session() as db:
        query = select(DBDeveloperModel).where(DBDeveloperModel.id == developer_id)
        result = await db.execute(query)
        db_developer = result.scalar_one_or_none()

        if not db_developer:
            raise HTTPException(status_code=404, detail="Developer not found")

        if db_developer.avatar_url:
            await r2_service.delete_avatar(db_developer.avatar_url)

        avatar_url = await r2_service.upload_avatar(avatar, developer_id)
        db_developer.avatar_url = avatar_url
        await db.commit()
        await db.refresh(db_developer)

        return {
            "message": "Avatar uploaded successfully",
            "avatar_url": avatar_url,
            "developer": developer_to_dict(db_developer)
        }

@router.delete("/{developer_id}/avatar")
async def delete_avatar(
        developer_id: int,
        request: Request,
        r2_service: R2Service = Depends(get_r2_service)
):
    async with request.app.state.db_session() as db:
        query = select(DBDeveloperModel).where(DBDeveloperModel.id == developer_id)
        result = await db.execute(query)
        db_developer = result.scalar_one_or_none()

        if not db_developer:
            raise HTTPException(status_code=404, detail="Developer not found")

        if not db_developer.avatar_url:
            raise HTTPException(status_code=404, detail="Developer has no avatar")

        await r2_service.delete_avatar(db_developer.avatar_url)
        db_developer.avatar_url = None
        await db.commit()
        await db.refresh(db_developer)

        return {
            "message": "Avatar deleted successfully",
            "developer": developer_to_dict(db_developer)
        }