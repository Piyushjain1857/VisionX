from fastapi import APIRouter, Depends, HTTPException
from models.schemas import User, LandCreate, Land, CropCreate, Crop, HistoryCreate, History
from service.farmer_service import farmer_service
from utils.security_manager import security_manager
from typing import List

router = APIRouter(prefix="/farmer", tags=["Farmer"])

@router.get("/profile", response_model=User)
async def get_profile(current_user: dict = Depends(security_manager.get_current_user)):
    return farmer_service.get_profile(current_user["sub"])

@router.put("/profile", response_model=User)
async def update_profile(profile_data: dict, current_user: dict = Depends(security_manager.get_current_user)):
    return farmer_service.update_profile(current_user["sub"], profile_data)

@router.post("/land", response_model=Land)
async def add_land(land_data: LandCreate, current_user: dict = Depends(security_manager.get_current_user)):
    return farmer_service.add_land(current_user["sub"], land_data.dict())

@router.get("/land", response_model=List[Land])
async def get_lands(current_user: dict = Depends(security_manager.get_current_user)):
    return farmer_service.get_lands(current_user["sub"])

@router.post("/crops", response_model=Crop)
async def add_crop(crop_data: CropCreate, current_user: dict = Depends(security_manager.get_current_user)):
    return farmer_service.add_crop(current_user["sub"], crop_data.dict())

@router.get("/crops", response_model=List[Crop])
async def get_crops(current_user: dict = Depends(security_manager.get_current_user)):
    return farmer_service.get_crops(current_user["sub"])

@router.post("/history", response_model=History)
async def add_history(history_data: HistoryCreate, current_user: dict = Depends(security_manager.get_current_user)):
    return farmer_service.add_history(current_user["sub"], history_data.dict())

@router.get("/history", response_model=List[History])
async def get_history(current_user: dict = Depends(security_manager.get_current_user)):
    return farmer_service.get_history(current_user["sub"])

@router.get("/notifications")
async def get_notifications(current_user: dict = Depends(security_manager.get_current_user)):
    return farmer_service.get_notifications(current_user["sub"])

@router.patch("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: int):
    return farmer_service.mark_notification_read(notification_id)

@router.get("/dashboard-summary")
async def get_dashboard_summary(current_user: dict = Depends(security_manager.get_current_user)):
    return farmer_service.get_dashboard_summary(current_user["sub"])
