# app/server/routers/auth.py
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from auth.dependencies import (
    authenticate_user,
    create_access_token,
    get_current_active_user,
)
from storages.psql.models.user_model import DBUserModel
from settings import Settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

security = HTTPBearer()


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool
    is_admin: bool


async def get_db_session(request: Request) -> AsyncSession:
    """Get database session from app state."""
    db_session = request.app.state.db_session
    async with db_session() as session:
        try:
            yield session
        finally:
            await session.close()


@router.post("/login", response_model=LoginResponse)
async def login(
        login_data: LoginRequest,
        request: Request,
        db: AsyncSession = Depends(get_db_session),
):
    """Login endpoint to get JWT token."""
    settings = Settings()

    user = await authenticate_user(db, login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is inactive"
        )

    access_token_expires = timedelta(hours=24)
    access_token = create_access_token(
        data={"sub": user.username},
        settings=settings,
        expires_delta=access_token_expires
    )

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user={
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_active": user.is_active,
            "is_admin": user.is_admin
        }
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
        current_user: DBUserModel = Depends(get_current_active_user)
):
    """Get current user information."""
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        is_active=current_user.is_active,
        is_admin=current_user.is_admin
    )


@router.post("/logout")
async def logout():
    """Logout endpoint (client should remove token from localStorage)."""
    return {"message": "Successfully logged out"}


@router.get("/verify")
async def verify_token(
        current_user: DBUserModel = Depends(get_current_active_user)
):
    """Verify if token is valid."""
    return {"valid": True, "username": current_user.username}