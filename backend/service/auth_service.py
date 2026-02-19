from repository.user_repository import user_repository
from utils.security_manager import security_manager
from fastapi import HTTPException, status

class AuthService:
    def signup(self, user_data):
        existing_user = user_repository.get_user_by_username(user_data.username)
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already registered")
        
        hashed_password = security_manager.get_password_hash(user_data.password)
        user_id = user_repository.create_user(user_data.username, hashed_password)
        return {"id": user_id, "username": user_data.username, "role": "Farmer"}

    def login(self, username, password):
        user = user_repository.get_user_by_username(username)
        if not user or not security_manager.verify_password(password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not user.is_active:
            raise HTTPException(status_code=403, detail="User account is blocked/pending approval")

        access_token = security_manager.create_access_token(
            data={"sub": user.username, "role": user.role}
        )
        return {"access_token": access_token, "token_type": "bearer", "role": user.role}

    def reset_password(self, username, new_password):
        user = user_repository.get_user_by_username(username)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        hashed_password = security_manager.get_password_hash(new_password)
        user_repository.update_password(user.id, hashed_password)
        return {"message": "Password updated successfully"}

auth_service = AuthService()
