from __future__ import annotations

import contextlib
from typing import TYPE_CHECKING

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

if TYPE_CHECKING:
    from app.server.settings import Settings


class Base(DeclarativeBase):
    def __repr__(self) -> str:
        values = ", ".join(
            [f"{column.name}={getattr(self, column.name)}" for column in self.__table__.columns.values()],
        )
        return f"{self.__tablename__}({values})"


async def create_db_session_pool(settings: Settings) -> tuple[AsyncEngine, async_sessionmaker[AsyncSession]]:
    engine: AsyncEngine = create_async_engine(settings.psql_dsn(), max_overflow=10, pool_size=100)
    sessionmaker = async_sessionmaker(engine, expire_on_commit=False)
    return engine, sessionmaker


async def close_db(engine: AsyncEngine) -> None:
    with contextlib.suppress(Exception):
        await engine.dispose()
