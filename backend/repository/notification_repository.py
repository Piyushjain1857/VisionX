from utils.db_manager import db_manager
from models.database import NotificationDB
from typing import List, Optional

class NotificationRepository:
    def create_notification(self, notification_data: dict):
        db = db_manager.get_db()
        try:
            new_notif = NotificationDB(**notification_data)
            db.add(new_notif)
            db.commit()
            db.refresh(new_notif)
            return new_notif
        finally:
            db.close()

    def get_notifications_for_user(self, user_id: int):
        db = db_manager.get_db()
        try:
            return db.query(NotificationDB).filter(
                (NotificationDB.farmer_id == user_id) | 
                (NotificationDB.farmer_id == None)
            ).order_by(NotificationDB.created_at.desc()).all()
        finally:
            db.close()

    def mark_as_read(self, notification_id: int):
        db = db_manager.get_db()
        try:
            notif = db.query(NotificationDB).filter(NotificationDB.id == notification_id).first()
            if notif:
                notif.is_read = True
                db.commit()
                return True
            return False
        finally:
            db.close()

notification_repository = NotificationRepository()
