from utils.db_manager import db_manager
from models.database import DiscussionDB

class DiscussionRepository:
    def create_discussion(self, discussion_data: dict):
        db = db_manager.get_db()
        try:
            new_discussion = DiscussionDB(**discussion_data)
            db.add(new_discussion)
            db.commit()
            db.refresh(new_discussion)
            return new_discussion
        finally:
            db.close()

    def get_discussions_by_farmer(self, farmer_id: int):
        db = db_manager.get_db()
        try:
            return db.query(DiscussionDB).filter(DiscussionDB.farmer_id == farmer_id).order_by(DiscussionDB.created_at.desc()).all()
        finally:
            db.close()

discussion_repository = DiscussionRepository()
