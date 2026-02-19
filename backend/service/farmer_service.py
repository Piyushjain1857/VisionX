from repository.user_repository import user_repository
from repository.land_repository import land_repository
from repository.crop_repository import crop_repository
from repository.history_repository import history_repository
from repository.notification_repository import notification_repository
from fastapi import HTTPException

class FarmerService:
    def get_profile(self, username: str):
        user = user_repository.get_user_by_username(username)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    def update_profile(self, username: str, profile_data: dict):
        user = user_repository.get_user_by_username(username)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user_repository.update_profile(user.id, profile_data)

    def add_land(self, username: str, land_data: dict):
        user = user_repository.get_user_by_username(username)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        land_data['farmer_id'] = user.id
        return land_repository.create_land(land_data)

    def get_lands(self, username: str):
        user = user_repository.get_user_by_username(username)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return land_repository.get_lands_by_farmer(user.id)

    def add_crop(self, username: str, crop_data: dict):
        user = user_repository.get_user_by_username(username)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        crop_data['farmer_id'] = user.id
        return crop_repository.create_crop(crop_data)

    def get_crops(self, username: str):
        user = user_repository.get_user_by_username(username)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return crop_repository.get_crops_by_farmer(user.id)

    def add_history(self, username: str, history_data: dict):
        user = user_repository.get_user_by_username(username)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        history_data['farmer_id'] = user.id
        return history_repository.create_history(history_data)

    def get_history(self, username: str):
        user = user_repository.get_user_by_username(username)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return history_repository.get_history_by_farmer(user.id)

    def get_notifications(self, username: str):
        user = user_repository.get_user_by_username(username)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return notification_repository.get_notifications_for_user(user.id)

    def mark_notification_read(self, notification_id: int):
        return notification_repository.mark_as_read(notification_id)

    def get_dashboard_summary(self, username: str):
        user = user_repository.get_user_by_username(username)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        lands = land_repository.get_lands_by_farmer(user.id)
        crops = crop_repository.get_crops_by_farmer(user.id)
        notifications = notification_repository.get_notifications_for_user(user.id)
        
        total_land_area = sum(float(l.area_size or 0) for l in lands)
        active_crops_count = len(crops)
        unread_notifications_count = len([n for n in notifications if not n.is_read])
        
        return {
            "farmer_name": user.full_name,
            "total_lands": len(lands),
            "total_area": round(total_land_area, 2),
            "active_crops": active_crops_count,
            "unread_notifications": unread_notifications_count,
            "recent_notifications": notifications[:3],
            "weather": {
                "temp": 28,
                "condition": "Sunny",
                "humidity": 45,
                "wind_speed": 12
            }
        }

farmer_service = FarmerService()
