from utils.db_manager import db_manager
from utils.security_manager import security_manager
from models.database import UserDB, LandDB
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_data():
    db_manager.drop_tables()
    db_manager.create_tables()
    db = db_manager.get_db()
    try:
        # 1. Create Admin User
        admin_email = "admin@agroai.com"
        admin_password = security_manager.get_password_hash("admin")
        print(" admin password:", admin_password)
        
        admin = db.query(UserDB).filter(UserDB.username == admin_email).first()
        if not admin:
            admin = UserDB(
                username=admin_email,
                password=admin_password,
                role="Admin",
                is_active=True
            )
            db.add(admin)
            logger.info(f"Admin user {admin_email} created.")
        else:
            logger.info("Admin user already exists.")

        # 2. Create Farmers
        farmers_data = [
            {"username": "9876543210", "full_name": "Rajesh Kumar", "location": "Karnal", "state": "Haryana", "city": "Karnal"},
            {"username": "9876543211", "full_name": "Suresh Singh", "location": "Hisar", "state": "Haryana", "city": "Hisar"},
            {"username": "9876543212", "full_name": "Amit Sharma", "location": "Rohtak", "state": "Haryana", "city": "Rohtak"}
        ]

        for f in farmers_data:
            password = security_manager.get_password_hash("password123")
            user = db.query(UserDB).filter(UserDB.username == f['username']).first()
            
            if not user:
                user = UserDB(
                    username=f['username'],
                    password=password,
                    role="Farmer",
                    full_name=f['full_name'],
                    location=f['location'],
                    state=f['state'],
                    city=f['city'],
                    is_active=True
                )
                db.add(user)
                db.flush() # To get user.id
                
                # Add Land info
                land = LandDB(
                    farmer_id=user.id,
                    land_name="Home Field",
                    area_size=5.5,
                    location=f['location'],
                    state=f['state'],
                    city=f['city']
                )
                db.add(land)
                logger.info(f"Farmer {f['username']} created.")
            else:
                logger.info(f"Farmer {f['username']} already exists.")

        db.commit()
        logger.info("Database seeding completed successfully.")

    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
