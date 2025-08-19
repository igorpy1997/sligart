# app/server/exception_handlers.py
import logging
import json
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Обработчик для 422 ошибок валидации"""
    logger.error(f"🚨 VALIDATION ERROR on {request.method} {request.url}")
    logger.error(f"📍 Path params: {request.path_params}")
    logger.error(f"🔍 Query params: {dict(request.query_params)}")

    # Читаем тело запроса
    try:
        body = await request.body()
        if body:
            try:
                body_json = json.loads(body.decode())
                logger.error(f"📦 Request body: {json.dumps(body_json, indent=2)}")
            except:
                logger.error(f"📦 Request body (raw): {body.decode()}")
    except Exception as e:
        logger.error(f"⚠️ Could not read request body: {e}")

    # Подробно логируем ошибки валидации
    logger.error("❌ Validation errors:")
    for error in exc.errors():
        logger.error(f"  - Field: {error['loc']}")
        logger.error(f"    Message: {error['msg']}")
        logger.error(f"    Type: {error['type']}")
        if 'input' in error:
            logger.error(f"    Input: {error['input']}")

    return JSONResponse(
        status_code=422,
        content={
            "detail": exc.errors(),
            "body": exc.body,
            "message": "Validation failed - check server logs for details"
        }
    )

async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Обработчик для HTTP ошибок"""
    logger.error(f"🚨 HTTP ERROR {exc.status_code} on {request.method} {request.url}")
    logger.error(f"📝 Detail: {exc.detail}")

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "status_code": exc.status_code
        }
    )

async def general_exception_handler(request: Request, exc: Exception):
    """Обработчик для всех остальных ошибок"""
    logger.error(f"💥 UNHANDLED EXCEPTION on {request.method} {request.url}")
    logger.exception("Full traceback:")

    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "message": str(exc),
            "type": type(exc).__name__
        }
    )