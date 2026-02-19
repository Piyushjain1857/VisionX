import httpx
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class WeatherService:
    async def get_weather(self, city: str) -> dict:
        """
        Fetch weather data for a given city using wttr.in (no key required for demo).
        """
        if not city:
            return {"status": "error", "message": "No city provided"}
            
        try:
            url = f"https://wttr.in/{city}?format=j1"
            async with httpx.AsyncClient() as client:
                response = await client.get(url, timeout=10.0)
                if response.status_code == 200:
                    data = response.json()
                    current = data['current_condition'][0]
                    return {
                        "temperature": current['temp_C'],
                        "humidity": current['humidity'],
                        "rainfall": current['precipMM'],
                        "condition": current['weatherDesc'][0]['value'],
                        "wind_speed": current['windspeedKmph']
                    }
                else:
                    return {"status": "error", "message": f"Failed to fetch weather: {response.status_code}"}
        except Exception as e:
            logger.error(f"Weather error: {e}")
            # Mock data as fallback
            return {
                "temperature": "30",
                "humidity": "65",
                "rainfall": "0.5",
                "condition": "Partly Cloudy",
                "wind_speed": "12"
            }

weather_service = WeatherService()
