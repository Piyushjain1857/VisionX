from utils.db_manager import db_manager
from models.database import HistoryDB

class HistoryRepository:
    def create_history(self, history_data: dict):
        db = db_manager.get_db()
        try:
            new_history = HistoryDB(**history_data)
            db.add(new_history)
            db.commit()
            db.refresh(new_history)
            return new_history
        finally:
            db.close()

    def get_history_by_farmer(self, farmer_id: int):
        db = db_manager.get_db()
        try:
            return db.query(HistoryDB).filter(HistoryDB.farmer_id == farmer_id).all()
        finally:
            db.close()

history_repository = HistoryRepository()
