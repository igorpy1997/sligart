# app/server/main.py (updated with format prices router)
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import test
from routers.admin import admin_router
from settings import Settings
from storages.psql.base import create_db_session_pool, close_db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    logger.info("🚀 Starting FastAPI application...")

    # Initialize settings
    settings = Settings()

    # Create database session pool
    logger.info("📊 Creating database session pool...")
    engine, db_session = await create_db_session_pool(settings)
    app.state.db_session = db_session
    app.state.engine = engine

    logger.info("✅ Database session pool created successfully")
    logger.info("🌐 FastAPI application started successfully")

    yield

    # Cleanup
    logger.info("🔄 Shutting down FastAPI application...")
    await close_db(engine)
    logger.info("✅ FastAPI application shut down successfully")


def create_app() -> FastAPI:
    """Create and configure FastAPI application."""
    app = FastAPI(
        title="KeyCRM Integration API",
        description="API для інтеграції з KeyCRM системою + импорт студентов + розрахунок платежів",
        version="2.0.0",
        lifespan=lifespan
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # В продакшені вказати конкретні домени
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(test.router, prefix="/api")  # Добавь префикс тут
    app.include_router(admin_router, prefix="/api")  # Добавь эту строку

    @app.get("/health")
    async def health_check():
        return {
            "status": "ok",
            "message": "API is running",
        }

    return app


# Create the app instance
app = create_app()