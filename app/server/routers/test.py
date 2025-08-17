from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/test", tags=["test"])  # Добавь /api

class TestResponse(BaseModel):
    message: str
    status: str
    data: dict

class Developer(BaseModel):
    id: int
    name: str
    skills: List[str]

# Простой GET
@router.get("/ping", response_model=TestResponse)
async def ping():
    return TestResponse(
        message="pong from FastAPI!",
        status="success",
        data={"timestamp": "2025-08-17"}
    )

# GET с данными
@router.get("/developers", response_model=List[Developer])
async def get_developers():
    return [
        Developer(id=1, name="Ihor", skills=["React", "FastAPI", "Python"]),
        Developer(id=2, name="Alex", skills=["Vue", "Node.js", "JavaScript"]),
    ]

# POST для теста
@router.post("/developers", response_model=Developer)
async def create_developer(developer: Developer):
    developer.id = 999  # Типа создали
    return developer