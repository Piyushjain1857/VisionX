from utils.db_manager import db_manager
from models.database import CropDB

class CropRepository:
    def create_crop(self, crop_data: dict):
        db = db_manager.get_db()
        try:
            new_crop = CropDB(**crop_data)
            db.add(new_crop)
            db.commit()
            db.refresh(new_crop)
            return new_crop
        finally:
            db.close()

    def get_crops_by_farmer(self, farmer_id: int):
        db = db_manager.get_db()
        try:
            return db.query(CropDB).filter(CropDB.farmer_id == farmer_id).all()
        finally:
            db.close()

crop_repository = CropRepository()
