from fastapi import APIRouter, Depends, HTTPException
from models.schemas import UserCreate, UserLogin, Token
from service.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup")
def signup(user: UserCreate):
    return auth_service.signup(user)

@router.post("/login", response_model=Token)
def login(user: UserLogin):
    return auth_service.login(user.username, user.password)

@router.post("/reset-password")
def reset_password(data: dict):
    if "username" not in data or "new_password" not in data:
        raise HTTPException(status_code=400, detail="Missing username or new_password")
    return auth_service.reset_password(data["username"], data["new_password"])
