from utils.db_manager import db_manager
from models.database import UserDB

class UserRepository:
    def get_user_by_username(self, username: str):
        db = db_manager.get_db()
        try:
            user = db.query(UserDB).filter(UserDB.username == username).first()
            return user
        finally:
            db.close()

    def create_user(self, username, hashed_password, role="Farmer"):
        db = db_manager.get_db()
        try:
            new_user = UserDB(
                username=username,
                password=hashed_password,
                role=role,
                is_active=True
            )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            return new_user.id
        finally:
            db.close()

    def get_all_farmers(self):
        db = db_manager.get_db()
        try:
            farmers = db.query(UserDB).filter(UserDB.role == "Farmer").all()
            return farmers
        finally:
            db.close()

    def get_user_by_id(self, user_id: int):
        db = db_manager.get_db()
        try:
            user = db.query(UserDB).filter(UserDB.id == user_id).first()
            return user
        finally:
            db.close()

    def update_profile(self, user_id: int, profile_data: dict):
        db = db_manager.get_db()
        try:
            user = db.query(UserDB).filter(UserDB.id == user_id).first()
            if user:
                for key, value in profile_data.items():
                    if hasattr(user, key):
                        setattr(user, key, value)
                db.commit()
                db.refresh(user)
                return user
            return None
        finally:
            db.close()

    def search_farmers(self, filters: dict):
        db = db_manager.get_db()
        try:
            query = db.query(UserDB).filter(UserDB.role == "Farmer")
            
            if filters.get("full_name"):
                query = query.filter(UserDB.full_name.ilike(f"%{filters['full_name']}%"))
            if filters.get("mobile"):
                query = query.filter(UserDB.mobile.ilike(f"%{filters['mobile']}%"))
            if filters.get("email"):
                query = query.filter(UserDB.username.ilike(f"%{filters['email']}%"))
            if filters.get("city"):
                query = query.filter(UserDB.city.ilike(f"%{filters['city']}%"))
            if filters.get("state"):
                query = query.filter(UserDB.state.ilike(f"%{filters['state']}%"))
                
            return query.order_by(UserDB.created_at.desc()).all()
        finally:
            db.close()

    def update_user_status(self, user_id: int, is_active: bool):
        db = db_manager.get_db()
        try:
            user = db.query(UserDB).filter(UserDB.id == user_id).first()
            if user:
                user.is_active = is_active
                db.commit()
                return True
            return False
        finally:
            db.close()

    def delete_user(self, user_id: int):
        db = db_manager.get_db()
        try:
            user = db.query(UserDB).filter(UserDB.id == user_id).first()
            if user:
                user.is_active = False
                db.commit()
                return True
            return False
        finally:
            db.close()

    def update_password(self, user_id: int, new_hashed_password: str):
        db = db_manager.get_db()
        try:
            user = db.query(UserDB).filter(UserDB.id == user_id).first()
            if user:
                user.password = new_hashed_password
                db.commit()
                return True
            return False
        finally:
            db.close()

user_repository = UserRepository()
