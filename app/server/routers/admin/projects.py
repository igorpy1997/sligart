from fastapi import APIRouter, HTTPException, Query, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import json

from storages.psql.models.project_model import DBProjectModel

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
    duration_months: Optional[int] = None
    budget_range: Optional[str] = None
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
    duration_months: Optional[int] = None
    budget_range: Optional[str] = None

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
    duration_months: Optional[int] = None
    budget_range: Optional[str] = None

def project_to_dict(project):
    """Convert project model to dict"""
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
        "duration_months": project.duration_months,
        "budget_range": project.budget_range,
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
):
    async with request.app.state.db_session() as db:
        query = select(DBProjectModel)

        # Sorting
        if hasattr(DBProjectModel, _sort):
            if _order.upper() == "DESC":
                query = query.order_by(getattr(DBProjectModel, _sort).desc())
            else:
                query = query.order_by(getattr(DBProjectModel, _sort))

        # Pagination
        query = query.offset(_start).limit(_end - _start)

        result = await db.execute(query)
        projects = result.scalars().all()

        # Get total count
        count_query = select(func.count(DBProjectModel.id))
        count_result = await db.execute(count_query)
        total = count_result.scalar()

        # Convert to dicts
        projects_data = [project_to_dict(project) for project in projects]

        return Response(
            content=json.dumps(projects_data),
            headers={"X-Total-Count": str(total)},
            media_type="application/json"
        )

@router.get("/{project_id}")
async def get_project(project_id: int, request: Request):
    async with request.app.state.db_session() as db:
        query = select(DBProjectModel).where(DBProjectModel.id == project_id)
        result = await db.execute(query)
        project = result.scalar_one_or_none()

        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        return project_to_dict(project)

@router.post("")
async def create_project(project: ProjectCreate, request: Request):
    async with request.app.state.db_session() as db:
        db_project = DBProjectModel(**project.dict())
        db.add(db_project)
        await db.commit()
        await db.refresh(db_project)

        return project_to_dict(db_project)

@router.put("/{project_id}")
async def update_project(
        project_id: int,
        project: ProjectUpdate,
        request: Request
):
    async with request.app.state.db_session() as db:
        query = select(DBProjectModel).where(DBProjectModel.id == project_id)
        result = await db.execute(query)
        db_project = result.scalar_one_or_none()

        if not db_project:
            raise HTTPException(status_code=404, detail="Project not found")

        # Update fields
        for field, value in project.dict(exclude_unset=True).items():
            setattr(db_project, field, value)

        await db.commit()
        await db.refresh(db_project)
        return project_to_dict(db_project)

@router.delete("/{project_id}")
async def delete_project(project_id: int, request: Request):
    async with request.app.state.db_session() as db:
        query = select(DBProjectModel).where(DBProjectModel.id == project_id)
        result = await db.execute(query)
        db_project = result.scalar_one_or_none()

        if not db_project:
            raise HTTPException(status_code=404, detail="Project not found")

        await db.delete(db_project)
        await db.commit()

        return {"message": "Project deleted"}