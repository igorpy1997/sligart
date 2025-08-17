from fastapi import APIRouter

# Импорты роутеров
from .developers import router as developers_router
from .projects import router as projects_router
from .technologies import router as technologies_router
from .service_requests import router as service_requests_router

admin_router = APIRouter(prefix="/admin", tags=["admin"])

admin_router.include_router(developers_router)
admin_router.include_router(projects_router)
admin_router.include_router(technologies_router)
admin_router.include_router(service_requests_router)

