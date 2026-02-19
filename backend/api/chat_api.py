from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from typing import List, Optional
from service.gemini_service import gemini_service
from service.weather_service import weather_service
from repository.user_repository import user_repository
from repository.history_repository import history_repository
from repository.crop_repository import crop_repository
from repository.discussion_repository import discussion_repository
from utils.security_manager import security_manager
import json

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/analyze")
async def analyze_crop(
    images: List[UploadFile] = File(None),
    crop_type: Optional[str] = Form(None),
    message: Optional[str] = Form(None),
    language: str = Form("en"),
    current_user: dict = Depends(security_manager.get_current_user)
):
    # 1. Fetch User details
    username = current_user.get("sub")
    user = user_repository.get_user_by_username(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # 2. Get Location & Weather
    location = user.city or user.state or "Unknown Location"
    weather_data = await weather_service.get_weather(user.city or user.state)
    
    # 3. Get History & Crops
    history_records = history_repository.get_history_by_farmer(user.id)
    history_context = [
        {
            "crop": h.crop,
            "year": h.year,
            "disease": h.disease_record,
            "treatment": h.treatment_record
        } for h in history_records[-5:]
    ]

    # If crop_type is missing, get from current crops
    if not crop_type or crop_type.strip() == "" or crop_type.lower() == "detect":
        user_crops = crop_repository.get_crops_by_farmer(user.id)
        if user_crops:
            crop_type = ", ".join([c.crop_name for c in user_crops])
        else:
            crop_type = "General (Not specified)"
    
    # 4. Read Images
    image_contents = []
    if images:
        for img in images:
            if img.filename:
                content = await img.read()
                image_contents.append(content)
        
    # 5. Call Gemini
    result = await gemini_service.analyze_crop_disease(
        images=image_contents,
        crop_type=crop_type,
        location=location,
        weather_data=weather_data,
        history=history_context,
        language=language,
        message=message
    )
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    
    # 6. Save to Discussion Table
    try:
        heading = f"{crop_type} - {result.get('diagnosis', 'Analysis')[:50]}"
        discussion_repository.create_discussion({
            "farmer_id": user.id,
            "heading": heading,
            "question": message or "Image-based Analysis",
            "answer": json.dumps(result)
        })
    except Exception as e:
        print(f"Error saving discussion: {e}")
        
    return result
