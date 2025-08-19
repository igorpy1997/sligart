# app/server/middleware/logging_middleware.py
import logging
import time
import json
from typing import Callable
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

logger = logging.getLogger(__name__)

class LoggingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.time()

        # Логируем входящий запрос
        logger.info(f"🔵 [{request.method}] {request.url}")

        # Логируем headers (без чувствительных данных)
        headers_to_log = {
            key: value for key, value in request.headers.items()
            if key.lower() not in ['authorization', 'cookie']
        }
        logger.debug(f"📋 Headers: {headers_to_log}")

        # Логируем query parameters
        if request.query_params:
            logger.debug(f"🔍 Query params: {dict(request.query_params)}")

        # Пытаемся прочитать тело запроса для POST/PUT
        body = None
        if request.method in ["POST", "PUT", "PATCH"]:
            try:
                body = await request.body()
                if body:
                    # Пытаемся распарсить как JSON
                    try:
                        body_json = json.loads(body.decode())
                        # Скрываем пароли в логах
                        if isinstance(body_json, dict) and 'password' in body_json:
                            body_json['password'] = '***'
                        logger.info(f"📦 Request body: {json.dumps(body_json, indent=2)}")
                    except:
                        logger.info(f"📦 Request body (raw): {body.decode()[:200]}...")
            except Exception as e:
                logger.warning(f"⚠️ Could not read request body: {e}")

        try:
            # Выполняем запрос
            response = await call_next(request)

            # Вычисляем время выполнения
            process_time = time.time() - start_time

            # Логируем ответ
            if response.status_code >= 400:
                logger.error(f"🔴 [{request.method}] {request.url} -> {response.status_code} ({process_time:.3f}s)")
            else:
                logger.info(f"🟢 [{request.method}] {request.url} -> {response.status_code} ({process_time:.3f}s)")

            return response

        except Exception as e:
            process_time = time.time() - start_time
            logger.error(f"💥 [{request.method}] {request.url} -> ERROR: {str(e)} ({process_time:.3f}s)")
            logger.exception("Full exception traceback:")

            # Возвращаем 500 ошибку
            return JSONResponse(
                status_code=500,
                content={"detail": f"Internal server error: {str(e)}"}
            )