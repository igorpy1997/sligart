from fastapi import APIRouter, HTTPException, Query, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import json

from storages.psql.models.developer_model import DBDeveloperModel

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
    is_active: bool
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
    is_active: bool = True

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
    is_active: Optional[bool] = None

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
        "is_active": dev.is_active,
        "created_at": dev.created_at.isoformat(),
        "updated_at": dev.updated_at.isoformat()
    }

@router.get("")
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
        if hasattr(DBDeveloperModel, _sort):
            if _order.upper() == "DESC":
                query = query.order_by(getattr(DBDeveloperModel, _sort).desc())
            else:
                query = query.order_by(getattr(DBDeveloperModel, _sort))

        # Pagination
        query = query.offset(_start).limit(_end - _start)

        result = await db.execute(query)
        developers = result.scalars().all()

        # Get total count
        count_query = select(func.count(DBDeveloperModel.id))
        count_result = await db.execute(count_query)
        total = count_result.scalar()

        # Convert to dicts
        developers_data = [developer_to_dict(dev) for dev in developers]

        return Response(
            content=json.dumps(developers_data),
            headers={"X-Total-Count": str(total)},
            media_type="application/json"
        )

@router.get("/{developer_id}")
async def get_developer(developer_id: int, request: Request):
    async with request.app.state.db_session() as db:
        query = select(DBDeveloperModel).where(DBDeveloperModel.id == developer_id)
        result = await db.execute(query)
        developer = result.scalar_one_or_none()

        if not developer:
            raise HTTPException(status_code=404, detail="Developer not found")

        return developer_to_dict(developer)

@router.post("")
async def create_developer(developer: DeveloperCreate, request: Request):
    async with request.app.state.db_session() as db:
        db_developer = DBDeveloperModel(**developer.dict())
        db.add(db_developer)
        await db.commit()
        await db.refresh(db_developer)

        return developer_to_dict(db_developer)

@router.put("/{developer_id}")
async def update_developer(
        developer_id: int,
        developer: DeveloperUpdate,
        request: Request
):
    async with request.app.state.db_session() as db:
        query = select(DBDeveloperModel).where(DBDeveloperModel.id == developer_id)
        result = await db.execute(query)
        db_developer = result.scalar_one_or_none()

        if not db_developer:
            raise HTTPException(status_code=404, detail="Developer not found")

        # Update fields
        for field, value in developer.dict(exclude_unset=True).items():
            setattr(db_developer, field, value)

        await db.commit()
        await db.refresh(db_developer)
        return developer_to_dict(db_developer)

@router.delete("/{developer_id}")
async def delete_developer(developer_id: int, request: Request):
    async with request.app.state.db_session() as db:
        query = select(DBDeveloperModel).where(DBDeveloperModel.id == developer_id)
        result = await db.execute(query)
        db_developer = result.scalar_one_or_none()

        if not db_developer:
            raise HTTPException(status_code=404, detail="Developer not found")

        await db.delete(db_developer)
        await db.commit()

        return {"message": "Developer deleted"}