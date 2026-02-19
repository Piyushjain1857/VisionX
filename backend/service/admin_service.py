from repository.user_repository import user_repository
from repository.notification_repository import notification_repository
from service.gemini_service import gemini_service
from service.weather_service import weather_service
from utils.security_manager import security_manager
from fastapi import HTTPException
from typing import List, Optional

class AdminService:
    def list_farmers(self, filters: dict):
        return user_repository.search_farmers(filters)

    def create_farmer(self, farmer_data: dict):
        # Check if user already exists
        existing_user = user_repository.get_user_by_username(farmer_data["username"])
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")
        
        hashed_password = security_manager.get_password_hash(farmer_data["password"])
        user_id = user_repository.create_user(
            username=farmer_data["username"],
            hashed_password=hashed_password,
            role="Farmer"
        )
        
        # Update other profile details
        profile_data = {k: v for k, v in farmer_data.items() if k not in ["username", "password"]}
        if profile_data:
            user_repository.update_profile(user_id, profile_data)
        
        return user_repository.get_user_by_id(user_id)

    def update_farmer(self, farmer_id: int, farmer_data: dict):
        user = user_repository.update_profile(farmer_id, farmer_data)
        if not user:
            raise HTTPException(status_code=404, detail="Farmer not found")
        return user

    def delete_farmer(self, farmer_id: int):
        success = user_repository.delete_user(farmer_id)
        if not success:
            raise HTTPException(status_code=404, detail="Farmer not found")
        return {"message": "Farmer inactivated successfully"}

    def toggle_farmer_status(self, farmer_id: int, is_active: bool):
        success = user_repository.update_user_status(farmer_id, is_active)
        if not success:
            raise HTTPException(status_code=404, detail="Farmer not found")
        return {"message": f"Farmer {'activated' if is_active else 'blocked'} successfully"}

    async def broadcast_alert(self, state: str, city: str, alert_type: str, language: str = "English"):
        print(f"[LOG] Starting broadcast alert: Type={alert_type}, Location={city}, {state}, Language={language}")
        
        # 1. Find farmers in the location
        filters = {"state": state, "city": city}
        farmers = user_repository.search_farmers(filters)
        
        if not farmers:
            print(f"[LOG] No farmers found in {city}, trying state {state}")
            filters = {"state": state}
            farmers = user_repository.search_farmers(filters)
            
        if not farmers:
            print(f"[LOG] No farmers found in state {state}")
            raise HTTPException(status_code=404, detail="No farmers found in the specified location")

        print(f"[LOG] Found {len(farmers)} farmers for broadcast")

        # 2. Get context for Gemini (weather for the city)
        weather_data = await weather_service.get_weather(city)
        print(f"[LOG] Weather context for {city}: {weather_data}")
        
        # 3. Use Gemini to generate an alert message in the specified language
        prompt = f"""
        You are an expert agricultural advisor. Generate a professional {alert_type} alert message for farmers.
        Location: {city}, {state}
        Weather Context: {weather_data}
        Target Language: {language}

        CRITICAL REQUIREMENT: The entire content (Title and Message) MUST be written in {language}. 
        Do NOT use any English words in the title or message if the target language is Hindi or Marathi.
        
        The alert should include:
        1. A catchy Title.
        2. A concise message about the {alert_type} risks.
        3. 2-3 specific actionable advice for farmers.
        
        Return the result STRICTLY as a JSON object with these exact keys:
        {{
            "title": "Alert Title in {language}",
            "message": "Full alert message with advice in {language}"
        }}
        """
        
        print(f"[LOG] Sending prompt to Gemini in {language}...")
        try:
            response = await gemini_service.model.generate_content_async(prompt)
            text = response.text
            print(f"[LOG] Raw AI Response: {text}")

            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            
            import json
            alert_json = json.loads(text)
            print(f"[LOG] Parsed Alert: {alert_json}")
        except Exception as e:
            print(f"[LOG] ERROR in AI generation: {str(e)}")
            # Fallback if AI fails
            fallbacks = {
                "Hindi": {
                    "title": f"{city} के लिए महत्वपूर्ण {alert_type} चेतावनी",
                    "message": f"कृपया अपने क्षेत्र में संभावित {alert_type.lower()} मुद्दों के संबंध में सलाह दी जाती है। विस्तृत मार्गदर्शन के लिए स्थानीय अधिकारियों से संपर्क करें।"
                },
                "Marathi": {
                    "title": f"{city} साठी महत्त्वाची {alert_type} चेतावणी",
                    "message": f"कृपया आपल्या भागातील संभाव्य {alert_type.lower()} समस्यांबाबत सावध रहा. तपशीलवार मार्गदर्शनासाठी स्थानिक अधिकाऱ्यांशी संपर्क साधा."
                },
                "English": {
                    "title": f"Important {alert_type} Alert for {city}",
                    "message": f"Please be advised regarding potential {alert_type.lower()} issues in your area. Contact local authorities for detailed guidance."
                }
            }
            alert_json = fallbacks.get(language, fallbacks["English"])
            print(f"[LOG] Using fallback alert for {language}")

        # 4. Save notifications
        created_count = 0
        for farmer in farmers:
            notification_data = {
                "farmer_id": farmer.id,
                "title": alert_json["title"],
                "message": alert_json["message"],
                "type": alert_type,
                "state": state,
                "city": city,
                "is_read": False
            }
            notification_repository.create_notification(notification_data)
            created_count += 1
            
        print(f"[LOG] Successfully saved {created_count} notifications in {language}")
        return {"message": f"Successfully broadcasted {alert_type} alert to {created_count} farmers in {language}", "content": alert_json}

    def get_farmer_details(self, farmer_id: int):
        user = user_repository.get_user_by_id(farmer_id)
        if not user:
            raise HTTPException(status_code=404, detail="Farmer not found")
        return user

admin_service = AdminService()
