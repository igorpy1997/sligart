# app/server/main.py
import logging
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from routers import test, public
from routers.auth import router as auth_router
from routers.admin import admin_router
from settings import Settings
from storages.psql.base import create_db_session_pool, close_db
from middleware.logging_middleware import LoggingMiddleware
from exception_handlers import (
    validation_exception_handler,
    http_exception_handler,
    general_exception_handler
)

# Настройка логирования
logging.basicConfig(
    level=logging.DEBUG,  # Изменил на DEBUG для более подробных логов
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),  # Выводим в stdout
        # Можно добавить FileHandler для записи в файл
        # logging.FileHandler('app.log')
    ]
)

# Настройка уровней для разных модулей
logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)  # SQL запросы
logging.getLogger("uvicorn.access").setLevel(logging.INFO)
logging.getLogger("fastapi").setLevel(logging.DEBUG)

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    logger.info("🚀 Starting FastAPI application...")

    # Initialize settings
    settings = Settings()

    # Create database session pool
    logger.info("📊 Creating database session pool...")
    try:
        engine, db_session = await create_db_session_pool(settings)
        app.state.db_session = db_session
        app.state.engine = engine
        logger.info("✅ Database session pool created successfully")
    except Exception as e:
        logger.error(f"❌ Failed to create database session pool: {e}")
        logger.exception("Database connection error:")
        raise

    logger.info("🌐 FastAPI application started successfully")

    yield

    # Cleanup
    logger.info("🔄 Shutting down FastAPI application...")
    try:
        await close_db(engine)
        logger.info("✅ FastAPI application shut down successfully")
    except Exception as e:
        logger.error(f"❌ Error during shutdown: {e}")

def create_app() -> FastAPI:
    """Create and configure FastAPI application."""
    app = FastAPI(
        title="Portfolio CRM API",
        description="API для управления портфолио + CRM система с авторизацией",
        version="2.0.0",
        lifespan=lifespan,
        debug=True  # Включаем debug режим
    )

    # Добавляем middleware для логирования (ПЕРВЫМ!)
    app.add_middleware(LoggingMiddleware)

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # В продакшені указать конкретные домены
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Добавляем обработчики исключений
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)

    # Include routers
    logger.info("📋 Registering routers...")
    app.include_router(test.router, prefix="/api")
    app.include_router(auth_router, prefix="/api")  # Auth routes
    app.include_router(admin_router, prefix="/api")  # Protected admin routes
    app.include_router(public.router, prefix="/api")
    logger.info("✅ All routers registered")

    @app.get("/health")
    async def health_check():
        logger.info("🏥 Health check requested")
        return {
            "status": "ok",
            "message": "API is running",
        }

    # Логируем все зарегистрированные роуты при старте
    @app.on_event("startup")
    async def log_routes():
        logger.info("📍 Registered routes:")
        for route in app.routes:
            if hasattr(route, 'methods') and hasattr(route, 'path'):
                logger.info(f"  {route.methods} {route.path}")

    return app

# Create the app instance
app = create_app()

# Дополнительная функция для дебага
@app.middleware("http")
async def debug_middleware(request, call_next):
    """Дополнительный middleware для дебага"""
    if request.url.path.startswith("/api/admin"):
        logger.debug(f"🔐 Admin route accessed: {request.url}")
        logger.debug(f"🎫 Authorization header: {'Authorization' in request.headers}")

    response = await call_next(request)
    return response