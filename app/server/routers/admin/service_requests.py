from fastapi import APIRouter, HTTPException, Query, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
import json

from storages.psql.models.service_request_model import DBServiceRequestModel

router = APIRouter(prefix="/service-requests", tags=["admin-service-requests"])


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
):
    async with request.app.state.db_session() as db:
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

        # Get total count first
        count_query = select(func.count(DBServiceRequestModel.id))
        if status:
            count_query = count_query.where(DBServiceRequestModel.status == status)
        if priority:
            count_query = count_query.where(DBServiceRequestModel.priority == priority)
        if project_type:
            count_query = count_query.where(DBServiceRequestModel.project_type == project_type)

        count_result = await db.execute(count_query)
        total = count_result.scalar()

        # Pagination
        query = query.offset(_start).limit(_end - _start)

        result = await db.execute(query)
        service_requests = result.scalars().all()

        # Convert to dicts
        requests_data = [service_request_to_dict(sr) for sr in service_requests]

        # Calculate end index for Content-Range
        actual_end = min(_start + len(requests_data) - 1, total - 1) if requests_data else _start - 1

        return Response(
            content=json.dumps(requests_data),
            headers={
                "Content-Range": f"items {_start}-{actual_end}/{total}",
                "Access-Control-Expose-Headers": "Content-Range"
            },
            media_type="application/json"
        )

@router.get("/{request_id}")
async def get_service_request(request_id: int, request: Request):
    async with request.app.state.db_session() as db:
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
        request: Request
):
    """Обновить статус, приоритет, заметки или назначить разработчика"""
    async with request.app.state.db_session() as db:
        query = select(DBServiceRequestModel).where(DBServiceRequestModel.id == request_id)
        result = await db.execute(query)
        db_service_request = result.scalar_one_or_none()

        if not db_service_request:
            raise HTTPException(status_code=404, detail="Service request not found")

        # Update fields
        for field, value in service_request.dict(exclude_unset=True).items():
            setattr(db_service_request, field, value)

        await db.commit()

        return {"message": "Service request deleted"}

# Дополнительные endpoints для статистики
@router.get("/stats/overview")
async def get_requests_stats(request: Request):
    """Получить общую статистику по заявкам"""
    async with request.app.state.db_session() as db:
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
        }()
        await db.refresh(db_service_request)
        return service_request_to_dict(db_service_request)

@router.delete("/{request_id}")
async def delete_service_request(request_id: int, request: Request):
    """Удалить заявку (только для спама/тестовых заявок)"""
    async with request.app.state.db_session() as db:
        query = select(DBServiceRequestModel).where(DBServiceRequestModel.id == request_id)
        result = await db.execute(query)
        db_service_request = result.scalar_one_or_none()

        if not db_service_request:
            raise HTTPException(status_code=404, detail="Service request not found")

        await db.delete(db_service_request)
        await db.commit

# Добавь в конец app/server/routers/admin/service_requests.py:

@router.delete("")
async def delete_many_service_requests(
        request: Request,
        ids: str = Query(..., description="Comma-separated list of IDs")
):
    """Массовое удаление заявок"""
    async with request.app.state.db_session() as db:
        # Парсим IDs
        try:
            request_ids = [int(id.strip()) for id in ids.split(',')]
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid IDs format")

        # Получаем заявки
        query = select(DBServiceRequestModel).where(DBServiceRequestModel.id.in_(request_ids))
        result = await db.execute(query)
        service_requests = result.scalars().all()

        if not service_requests:
            raise HTTPException(status_code=404, detail="No service requests found")

        # Удаляем заявки
        for service_request in service_requests:
            await db.delete(service_request)

        await db.commit()

        return {
            "message": f"Deleted {len(service_requests)} service requests",
            "deleted_ids": [req.id for req in service_requests]
        }