from fastapi import APIRouter, Depends, Query
from models.schemas import User, UserCreate
from service.admin_service import admin_service
from utils.security_manager import security_manager
from typing import List, Optional

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/farmers", response_model=List[User])
async def list_farmers(
    full_name: Optional[str] = Query(None),
    mobile: Optional[str] = Query(None),
    email: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    # current_user: dict = Depends(security_manager.get_current_user)
):
    # In a real app, we would verify if current_user has "Admin" role
    filters = {
        "full_name": full_name,
        "mobile": mobile,
        "email": email,
        "city": city,
        "state": state
    }
    return admin_service.list_farmers(filters)

@router.post("/farmers", response_model=User)
async def create_farmer(farmer_data: UserCreate):
    return admin_service.create_farmer(farmer_data.dict())

@router.get("/farmers/{farmer_id}", response_model=User)
async def get_farmer_details(farmer_id: int):
    return admin_service.get_farmer_details(farmer_id)

@router.put("/farmers/{farmer_id}", response_model=User)
async def update_farmer(farmer_id: int, farmer_data: dict):
    return admin_service.update_farmer(farmer_id, farmer_data)

@router.delete("/farmers/{farmer_id}")
async def delete_farmer(farmer_id: int):
    return admin_service.delete_farmer(farmer_id)

@router.patch("/farmers/{farmer_id}/status")
async def toggle_farmer_status(farmer_id: int, is_active: bool):
    return admin_service.toggle_farmer_status(farmer_id, is_active)

@router.post("/broadcast")
async def broadcast_alert(
    state: str = Query(...),
    city: str = Query(...),
    type: str = Query(...), # Weather or Disease
    language: str = Query("English") # English, Hindi, Marathi
):
    return await admin_service.broadcast_alert(state, city, type, language)
