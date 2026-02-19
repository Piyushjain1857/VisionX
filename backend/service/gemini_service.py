import google.generativeai as genai
from typing import List, Optional
import json
import logging
from config import settings

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel(self.model_name)
        else:
            self.model = None
            logger.warning("GEMINI_API_KEY not found in settings.")

    async def analyze_crop_disease(
        self, 
        images: List[bytes], 
        crop_type: str, 
        location: str, 
        weather_data: dict, 
        history: List[dict],
        language: str = "en",
        message: Optional[str] = None
    ):
        if not self.model:
            return {"error": "Gemini API key not configured"}

        # Prepare context strings
        history_str = json.dumps(history, indent=2) if history else "No previous history found."
        weather_str = json.dumps(weather_data, indent=2) if weather_data else "Weather data unavailable."
        
        # Determine language priority
        lang_instruction = f"Respond in {language}."
        if message:
            lang_instruction = "Identify the language of the farmer's question and respond in that same language (Hindi or English)."

        farmer_query = f"Farmer's Question: {message}" if message else "Task: General health check based on images."

        prompt = f"""
        You are an expert Agricultural Scientist / AI Agronomist specializing in crop diseases.
        
        CONTEXT:
        - Crop Type: {crop_type}
        - Farmer's Location: {location}
        - Current Weather: {weather_str}
        - Farm History: {history_str}
        
        {farmer_query}
        
        TASK:
        1. Analyze the attached crop leaf images (if any).
        2. Identify any diseases present.
        3. Assess severity and spread risk.
        4. Provide expert reasoning and specific recommendations.
        5. If there are no images, answer the farmer's question based on the context and crop knowledge.
        
        OUTPUT FORMAT (Strict JSON):
        {{
          "diagnosis": "Summary of current state",
          "diseases": ["list", "of", "detected", "issues"],
          "severity": "Low/Medium/High",
          "spread_risk": "Low/Medium/High",
          "confidence_score": 0.95,
          "reasoning": "Detailed explanation",
          "advisory": {{
            "chemical_solution": {{ "name": "...", "dosage": "..." }},
            "bio_organic_solution": "...",
            "organic_treatment": "...",
            "fertilizer_support": "...",
            "preventive_care": "..."
          }}
        }}
        
        LANGUAGE: {lang_instruction}
        Keep JSON keys in English. All text values MUST be in the detected/requested language.
        """

        # Prepare contents for Gemini
        contents = [prompt]
        for img_bytes in images:
            contents.append({"mime_type": "image/jpeg", "data": img_bytes})

        try:
            response = self.model.generate_content(contents)
            # Find the JSON block in the response
            text = response.text
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            
            return json.loads(text)
        except Exception as e:
            logger.error(f"Error calling Gemini: {e}")
            return {"error": str(e)}

gemini_service = GeminiService()
