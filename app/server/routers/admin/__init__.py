# app/server/routers/admin/__init__.py
from fastapi import APIRouter, Depends
from auth.dependencies import get_current_admin_user
from storages.psql.models.user_model import DBUserModel

from .developers import router as developers_router
from .projects import router as projects_router
from .technologies import router as technologies_router
from .service_requests import router as service_requests_router

# Create admin router with auth protection
admin_router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(get_current_admin_user)]  # Protect all admin routes
)

# Include all admin sub-routes
admin_router.include_router(developers_router)
admin_router.include_router(projects_router)
admin_router.include_router(technologies_router)
admin_router.include_router(service_requests_router)