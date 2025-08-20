# app/server/routers/public.py
from fastapi import APIRouter, Request, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from pydantic import BaseModel

from storages.psql.models.developer_model import DBDeveloperModel
from storages.psql.models.project_model import DBProjectModel
from storages.psql.models.technology_model import DBTechnologyModel
from storages.psql.models.service_request_model import DBServiceRequestModel

router = APIRouter(prefix="/public", tags=["public"])

# Pydantic схемы для публичного API
class PublicDeveloper(BaseModel):
    id: int
    name: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    years_experience: int
    skills: Optional[List[str]] = None
    specialization: str
    project_count: Optional[int] = None  # Количество проектов

    class Config:
        from_attributes = True

class PublicProject(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    image_urls: Optional[List[str]] = None
    project_type: Optional[str] = None
    category: Optional[str] = None  # Новое поле
    duration_months: Optional[int] = None
    developers: Optional[List[dict]] = None  # Информация о разработчиках

    class Config:
        from_attributes = True

class PublicTechnology(BaseModel):
    id: int
    name: str
    category: Optional[str] = None
    icon_url: Optional[str] = None
    color: Optional[str] = None

    class Config:
        from_attributes = True

class ServiceRequestCreate(BaseModel):
    client_name: str
    client_email: str
    client_phone: Optional[str] = None
    company_name: Optional[str] = None
    project_type: str
    budget_range: Optional[str] = None
    timeline: Optional[str] = None
    description: str
    requirements: Optional[dict] = None

class ServiceRequestResponse(BaseModel):
    id: int
    message: str
    status: str

@router.get("/developers", response_model=List[PublicDeveloper])
async def get_developers(
        request: Request,
        active_only: bool = True,
        limit: int = 10
):
    """Get list of active developers for public display"""
    async with request.app.state.db_session() as db:
        query = select(DBDeveloperModel).options(selectinload(DBDeveloperModel.projects))

        if active_only:
            query = query.where(DBDeveloperModel.is_active == True)

        query = query.limit(limit)

        result = await db.execute(query)
        developers = result.scalars().all()

        # Преобразуем в PublicDeveloper с подсчетом проектов
        response_data = []
        for dev in developers:
            dev_data = PublicDeveloper.from_orm(dev)
            dev_data.project_count = len([p for p in dev.projects if p.status == "active"]) if dev.projects else 0
            response_data.append(dev_data)

        return response_data

@router.get("/developers/{developer_id}", response_model=PublicDeveloper)
async def get_developer(developer_id: int, request: Request):
    """Get single developer by ID with their projects"""
    async with request.app.state.db_session() as db:
        query = select(DBDeveloperModel).options(selectinload(DBDeveloperModel.projects)).where(
            DBDeveloperModel.id == developer_id,
            DBDeveloperModel.is_active == True
        )
        result = await db.execute(query)
        developer = result.scalar_one_or_none()

        if not developer:
            raise HTTPException(status_code=404, detail="Developer not found")

        dev_data = PublicDeveloper.from_orm(developer)
        dev_data.project_count = len([p for p in developer.projects if p.status == "active"]) if developer.projects else 0
        return dev_data

@router.get("/developers/{developer_id}/projects")
async def get_developer_projects(
        developer_id: int,
        request: Request,
        limit: int = 20
):
    """Get projects for a specific developer"""
    async with request.app.state.db_session() as db:
        # Проверяем что разработчик существует
        dev_query = select(DBDeveloperModel).where(
            DBDeveloperModel.id == developer_id,
            DBDeveloperModel.is_active == True
        )
        dev_result = await db.execute(dev_query)
        developer = dev_result.scalar_one_or_none()

        if not developer:
            raise HTTPException(status_code=404, detail="Developer not found")

        # Получаем проекты разработчика
        project_query = (
            select(DBProjectModel)
            .options(selectinload(DBProjectModel.developers))
            .join(DBProjectModel.developers)
            .where(
                DBDeveloperModel.id == developer_id,
                DBProjectModel.status == "active"
            )
            .order_by(DBProjectModel.created_at.desc())
            .limit(limit)
        )

        project_result = await db.execute(project_query)
        projects = project_result.scalars().all()

        # Преобразуем в PublicProject
        response_data = []
        for project in projects:
            project_data = PublicProject.from_orm(project)
            project_data.developers = [
                {"id": dev.id, "name": dev.name, "specialization": dev.specialization}
                for dev in project.developers
            ]
            response_data.append(project_data)

        return response_data

@router.get("/projects", response_model=List[PublicProject])
async def get_projects(
        request: Request,
        featured_only: bool = False,
        project_type: Optional[str] = None,
        category: Optional[str] = None,
        limit: int = 12
):
    async with request.app.state.db_session() as db:
        query = select(DBProjectModel).options(selectinload(DBProjectModel.developers)).where(DBProjectModel.status == "active")

        if featured_only:
            query = query.where(DBProjectModel.featured == True)

        if project_type:
            query = query.where(DBProjectModel.project_type == project_type)

        if category:
            query = query.where(DBProjectModel.category == category)

        query = query.order_by(DBProjectModel.created_at.desc()).limit(limit)

        result = await db.execute(query)
        projects = result.scalars().all()

        # Преобразуем в PublicProject с информацией о разработчиках
        response_data = []
        for project in projects:
            project_dict = project.__dict__.copy()  # Копируем атрибуты проекта
            project_dict["developers"] = [
                {
                    "id": dev.id,
                    "name": dev.name,
                    "specialization": dev.specialization,
                    "avatar_url": dev.avatar_url
                }
                for dev in project.developers
            ] if project.developers else []
            project_data = PublicProject.model_validate(project_dict, from_attributes=True)
            response_data.append(project_data)

        return response_data

@router.get("/projects/{project_id}", response_model=PublicProject)
async def get_project(project_id: int, request: Request):
    async with request.app.state.db_session() as db:
        query = select(DBProjectModel).options(selectinload(DBProjectModel.developers)).where(
            DBProjectModel.id == project_id,
            DBProjectModel.status == "active"
        )
        result = await db.execute(query)
        project = result.scalar_one_or_none()

        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        # Преобразуем данные проекта в словарь, включая разработчиков
        project_dict = project.__dict__.copy()  # Копируем атрибуты проекта
        project_dict["developers"] = [
            {
                "id": dev.id,
                "name": dev.name,
                "specialization": dev.specialization,
                "avatar_url": dev.avatar_url,
                "github_url": dev.github_url,
                "linkedin_url": dev.linkedin_url
            }
            for dev in project.developers
        ] if project.developers else []

        # Валидируем словарь с помощью Pydantic v2
        project_data = PublicProject.model_validate(project_dict, from_attributes=True)
        return project_data

@router.get("/projects/categories/list")
async def get_project_categories(request: Request):
    """Get list of all project categories with counts"""
    async with request.app.state.db_session() as db:
        from sqlalchemy import func

        query = select(
            DBProjectModel.category,
            func.count(DBProjectModel.id).label("count")
        ).where(
            DBProjectModel.status == "active",
            DBProjectModel.category.is_not(None)
        ).group_by(DBProjectModel.category)

        result = await db.execute(query)
        categories = result.all()

        return {
            "categories": [
                {"id": cat.category, "name": cat.category.title(), "count": cat.count}
                for cat in categories
            ]
        }

@router.get("/technologies", response_model=List[PublicTechnology])
async def get_technologies(
        request: Request,
        category: Optional[str] = None,
        limit: int = 50
):
    """Get list of technologies for public display"""
    async with request.app.state.db_session() as db:
        query = select(DBTechnologyModel)

        if category:
            query = query.where(DBTechnologyModel.category == category)

        query = query.order_by(DBTechnologyModel.name).limit(limit)

        result = await db.execute(query)
        technologies = result.scalars().all()

        return [PublicTechnology.from_orm(tech) for tech in technologies]

@router.get("/technologies/categories")
async def get_technology_categories(request: Request):
    """Get list of all technology categories"""
    async with request.app.state.db_session() as db:
        query = select(DBTechnologyModel.category).distinct().where(
            DBTechnologyModel.category.is_not(None)
        )
        result = await db.execute(query)
        categories = result.scalars().all()

        return {"categories": categories}

@router.post("/contact", response_model=ServiceRequestResponse)
async def submit_contact_form(
        service_request: ServiceRequestCreate,
        request: Request
):
    """Submit a service request / contact form"""
    async with request.app.state.db_session() as db:
        # Create new service request
        db_service_request = DBServiceRequestModel(
            **service_request.dict(),
            status="new",
            priority="medium"
        )

        db.add(db_service_request)
        await db.commit()
        await db.refresh(db_service_request)

        return ServiceRequestResponse(
            id=db_service_request.id,
            message="Thank you for your request! We'll get back to you soon.",
            status="submitted"
        )

@router.get("/stats")
async def get_public_stats(request: Request):
    """Get public statistics for homepage"""
    async with request.app.state.db_session() as db:
        from sqlalchemy import func

        # Count active developers
        dev_query = select(func.count(DBDeveloperModel.id)).where(DBDeveloperModel.is_active == True)
        dev_result = await db.execute(dev_query)
        developers_count = dev_result.scalar()

        # Count active projects
        proj_query = select(func.count(DBProjectModel.id)).where(DBProjectModel.status == "active")
        proj_result = await db.execute(proj_query)
        projects_count = proj_result.scalar()

        # Count completed service requests
        sr_query = select(func.count(DBServiceRequestModel.id)).where(DBServiceRequestModel.status == "completed")
        sr_result = await db.execute(sr_query)
        completed_requests = sr_result.scalar()

        # Count projects by category for homepage
        cat_query = select(
            DBProjectModel.category,
            func.count(DBProjectModel.id).label("count")
        ).where(
            DBProjectModel.status == "active",
            DBProjectModel.category.is_not(None)
        ).group_by(DBProjectModel.category)
        cat_result = await db.execute(cat_query)
        categories_stats = {row.category: row.count for row in cat_result}

        return {
            "developers": developers_count,
            "projects": projects_count,
            "completed_projects": completed_requests,
            "years_experience": 3,
            "technologies": 15,
            "categories": categories_stats
        }