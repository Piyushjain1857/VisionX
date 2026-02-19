from utils.db_manager import db_manager
from models.database import LandDB

class LandRepository:
    def create_land(self, land_data: dict):
        db = db_manager.get_db()
        try:
            new_land = LandDB(**land_data)
            db.add(new_land)
            db.commit()
            db.refresh(new_land)
            return new_land
        finally:
            db.close()

    def get_lands_by_farmer(self, farmer_id: int):
        db = db_manager.get_db()
        try:
            return db.query(LandDB).filter(LandDB.farmer_id == farmer_id).all()
        finally:
            db.close()

land_repository = LandRepository()
