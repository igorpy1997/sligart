from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
import json

from storages.psql.models.service_request_model import DBServiceRequestModel

router = APIRouter(prefix="/service-requests", tags=["admin-service-requests"])

# Dependency для получения сессии
async def get_db_session(request: Request) -> AsyncSession:
    return request.app.state.db_session()

# Pydantic схемы (только для чтения и обновления статуса)
class ServiceRequestResponse(BaseModel):
    id: int
    client_name: str
    client_email: str
    client_phone: Optional[str] = None
    company_name: Optional[str] = None
    project_type: str
    budget_range: Optional[str] = None
    timeline: Optional[str] = None
    description: str
    requirements: Optional[dict] = None
    status: str
    priority: str
    developer_id: Optional[int] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ServiceRequestUpdate(BaseModel):
    """Только для обновления статуса, приоритета, заметок и назначения разработчика"""
    status: Optional[str] = None
    priority: Optional[str] = None
    developer_id: Optional[int] = None
    notes: Optional[str] = None

def service_request_to_dict(sr):
    """Convert service request model to dict"""
    return {
        "id": sr.id,
        "client_name": sr.client_name,
        "client_email": sr.client_email,
        "client_phone": sr.client_phone,
        "company_name": sr.company_name,
        "project_type": sr.project_type,
        "budget_range": sr.budget_range,
        "timeline": sr.timeline,
        "description": sr.description,
        "requirements": sr.requirements or {},
        "status": sr.status,
        "priority": sr.priority,
        "developer_id": sr.developer_id,
        "notes": sr.notes,
        "created_at": sr.created_at.isoformat(),
        "updated_at": sr.updated_at.isoformat()
    }

@router.get("")
async def get_service_requests(
        request: Request,
        _start: int = Query(0),
        _end: int = Query(25),
        _sort: str = Query("created_at"),  # По умолчанию сортируем по дате создания
        _order: str = Query("DESC"),  # Новые сверху
        status: Optional[str] = Query(None),  # Фильтр по статусу
        priority: Optional[str] = Query(None),  # Фильтр по приоритету
        project_type: Optional[str] = Query(None),  # Фильтр по типу проекта
        db: AsyncSession = Depends(get_db_session)
):
    query = select(DBServiceRequestModel)

    # Фильтры
    if status:
        query = query.where(DBServiceRequestModel.status == status)
    if priority:
        query = query.where(DBServiceRequestModel.priority == priority)
    if project_type:
        query = query.where(DBServiceRequestModel.project_type == project_type)

    # Sorting
    if hasattr(DBServiceRequestModel, _sort):
        if _order.upper() == "DESC":
            query = query.order_by(getattr(DBServiceRequestModel, _sort).desc())
        else:
            query = query.order_by(getattr(DBServiceRequestModel, _sort))

    # Pagination
    query = query.offset(_start).limit(_end - _start)

    result = await db.execute(query)
    service_requests = result.scalars().all()

    # Get total count
    count_query = select(func.count(DBServiceRequestModel.id))
    if status:
        count_query = count_query.where(DBServiceRequestModel.status == status)
    if priority:
        count_query = count_query.where(DBServiceRequestModel.priority == priority)
    if project_type:
        count_query = count_query.where(DBServiceRequestModel.project_type == project_type)

    count_result = await db.execute(count_query)
    total = count_result.scalar()

    # Convert to dicts
    requests_data = [service_request_to_dict(sr) for sr in service_requests]

    return Response(
        content=json.dumps(requests_data),
        headers={"X-Total-Count": str(total)},
        media_type="application/json"
    )

@router.get("/{request_id}")
async def get_service_request(request_id: int, db: AsyncSession = Depends(get_db_session)):
    query = select(DBServiceRequestModel).where(DBServiceRequestModel.id == request_id)
    result = await db.execute(query)
    service_request = result.scalar_one_or_none()

    if not service_request:
        raise HTTPException(status_code=404, detail="Service request not found")

    return service_request_to_dict(service_request)

@router.put("/{request_id}")
async def update_service_request(
        request_id: int,
        service_request: ServiceRequestUpdate,
        db: AsyncSession = Depends(get_db_session)
):
    """Обновить статус, приоритет, заметки или назначить разработчика"""
    query = select(DBServiceRequestModel).where(DBServiceRequestModel.id == request_id)
    result = await db.execute(query)
    db_service_request = result.scalar_one_or_none()

    if not db_service_request:
        raise HTTPException(status_code=404, detail="Service request not found")

    # Update fields
    for field, value in service_request.dict(exclude_unset=True).items():
        setattr(db_service_request, field, value)

    await db.commit()
    await db.refresh(db_service_request)
    return service_request_to_dict(db_service_request)

@router.delete("/{request_id}")
async def delete_service_request(request_id: int, db: AsyncSession = Depends(get_db_session)):
    """Удалить заявку (только для спама/тестовых заявок)"""
    query = select(DBServiceRequestModel).where(DBServiceRequestModel.id == request_id)
    result = await db.execute(query)
    db_service_request = result.scalar_one_or_none()

    if not db_service_request:
        raise HTTPException(status_code=404, detail="Service request not found")

    await db.delete(db_service_request)
    await db.commit()

    return {"message": "Service request deleted"}

# Дополнительные endpoints для статистики
@router.get("/stats/overview")
async def get_requests_stats(db: AsyncSession = Depends(get_db_session)):
    """Получить общую статистику по заявкам"""

    # Количество по статусам
    status_query = select(
        DBServiceRequestModel.status,
        func.count(DBServiceRequestModel.id).label("count")
    ).group_by(DBServiceRequestModel.status)

    status_result = await db.execute(status_query)
    status_stats = {row.status: row.count for row in status_result}

    # Количество по приоритетам
    priority_query = select(
        DBServiceRequestModel.priority,
        func.count(DBServiceRequestModel.id).label("count")
    ).group_by(DBServiceRequestModel.priority)

    priority_result = await db.execute(priority_query)
    priority_stats = {row.priority: row.count for row in priority_result}

    # Общее количество
    total_query = select(func.count(DBServiceRequestModel.id))
    total_result = await db.execute(total_query)
    total = total_result.scalar()

    return {
        "total_requests": total,
        "by_status": status_stats,
        "by_priority": priority_stats
    }