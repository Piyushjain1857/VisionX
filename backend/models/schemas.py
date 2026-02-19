from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class UserBase(BaseModel):
    username: str # Mobile or Email
    role: str = "Farmer"
    full_name: Optional[str] = None
    location: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    mobile: Optional[str] = None
    photo_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    is_active: bool = True

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class LandBase(BaseModel):
    land_name: Optional[str] = None
    area_size: float
    location: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None

class LandCreate(LandBase):
    pass

class Land(LandBase):
    id: int
    farmer_id: int
    class Config:
        from_attributes = True

class FieldBase(BaseModel):
    land_id: int
    name: str
    area: float

class CropBase(BaseModel):
    land_id: int
    crop_name: str
    variety: Optional[str] = None
    planted_date: date
    estimated_harvest_date: Optional[date] = None

class CropCreate(CropBase):
    pass

class Crop(CropBase):
    id: int
    farmer_id: int
    class Config:
        from_attributes = True

class HistoryBase(BaseModel):
    land_id: int
    crop: str
    year: int
    yield_amount: float
    disease_record: Optional[str] = None
    treatment_record: Optional[str] = None
    notes: Optional[str] = None

class HistoryCreate(HistoryBase):
    pass

class History(HistoryBase):
    id: int
    farmer_id: int
    class Config:
        from_attributes = True
class NotificationBase(BaseModel):
    title: str
    message: str
    type: str
    state: Optional[str] = None
    city: Optional[str] = None
    crop: Optional[str] = None

class NotificationCreate(NotificationBase):
    pass

class Notification(NotificationBase):
    id: int
    farmer_id: Optional[int] = None
    is_read: bool
    created_at: date # Or datetime if preferred, schemas often simplify to date if needed

    class Config:
        from_attributes = True
