from fastapi import APIRouter, Depends, HTTPException
from typing import List
from repository.discussion_repository import discussion_repository
from repository.user_repository import user_repository
from utils.security_manager import security_manager

router = APIRouter(prefix="/discussions", tags=["discussions"])

@router.get("/")
async def get_my_discussions(current_user: dict = Depends(security_manager.get_current_user)):
    username = current_user.get("sub")
    user = user_repository.get_user_by_username(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    discussions = discussion_repository.get_discussions_by_farmer(user.id)
    return discussions
