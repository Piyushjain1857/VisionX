from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from pydantic import BaseModel
from typing import List, Optional
import random

router = APIRouter(prefix="/diagnosis", tags=["Diagnosis"])

class DailyAction(BaseModel):
    day: str
    title: str
    tasks: List[str]
    voice_note: Optional[str] = None
    reminder: Optional[str] = None

class ActionPlanResponse(BaseModel):
    disease_name: str
    crop: str
    location: str
    weather: str
    plan: List[DailyAction]
    recovery_percentage: Optional[int] = None
    voice_support_available: bool = True

@router.post("/analyze", response_model=ActionPlanResponse)
async def analyze_crop(file: UploadFile = File(...), lang: str = Form("en")):
    # In a real app, we would process the image here.
    # For now, we return the mock structure as requested in the prompt.
    
    # Simulate processing time
    # import time
    # time.sleep(1)

    if lang == "hi":
        mock_plan = [
            DailyAction(
                day="दिन 1",
                title="तत्काल नियंत्रण",
                tasks=[
                    "दृष्टतः संक्रमित पत्तियों को हटा दें",
                    "कवकनाशी एक्स (2 मिली प्रति लीटर पानी) का छिड़काव करें",
                    "सुबह-सुबह स्प्रे करें",
                    "दस्ताने और मास्क पहनें"
                ],
                voice_note="क्या स्प्रे पूरा हो गया?",
                reminder="क्या स्प्रे पूरा हो गया?"
            ),
            DailyAction(
                day="दिन 2",
                title="मिट्टी की निगरानी",
                tasks=[
                    "अधिक पानी देने से बचें",
                    "जल निकासी की स्थिति की जाँच करें",
                    "जैविक खाद (हल्की परत) लगाएं"
                ]
            ),
            DailyAction(
                day="दिन 3",
                title="निवारक स्प्रे",
                tasks=[
                    "नीम आधारित जैव कीटनाशक का प्रयोग करें",
                    "सिंचाई से 12 घंटे का अंतर बनाए रखें"
                ]
            ),
            DailyAction(
                day="दिन 4",
                title="क्षेत्र अवलोकन",
                tasks=[
                    "प्रगति की जाँच के लिए नई छवि कैप्चर करें",
                    "एआई स्थिति की तुलना करता है"
                ]
            ),
            DailyAction(
                day="दिन 5",
                title="पोषक तत्व बूस्ट",
                tasks=[
                    "पोटैशियम युक्त खाद डालें",
                    "नाइट्रोजन भारी उर्वरक से बचें"
                ]
            ),
            DailyAction(
                day="दिन 6",
                title="द्वितीयक निरीक्षण",
                tasks=[
                    "निचली पत्तियों का निरीक्षण करें",
                    "नए प्रभावित क्षेत्रों को हटा दें"
                ]
            ),
            DailyAction(
                day="दिन 7",
                title="अंतिम मूल्यांकन",
                tasks=[
                    "अद्यतन छवि अपलोड करें",
                    "सिस्टम रिकवरी % का मूल्यांकन करता है",
                    "योजना जारी रखने या रोकने का सुझाव दें"
                ]
            )
        ]

        return ActionPlanResponse(
            disease_name="लीफ ब्लाइट (झुलसा रोग)",
            crop="टमाटर",
            location="हरियाणा",
            weather="आर्द्र, 28°C",
            plan=mock_plan,
            recovery_percentage=85
        )

    mock_plan = [
        DailyAction(
            day="Day 1",
            title="Immediate Control",
            tasks=[
                "Remove visibly infected leaves",
                "Spray Fungicide X (2ml per liter of water)",
                "Spray during early morning",
                "Wear gloves and mask"
            ],
            voice_note="Spray completed?",
            reminder="Spray completed?"
        ),
        DailyAction(
            day="Day 2",
            title="Soil Monitoring",
            tasks=[
                "Avoid overwatering",
                "Check drainage condition",
                "Apply organic compost (light layer)"
            ]
        ),
        DailyAction(
            day="Day 3",
            title="Preventive Spray",
            tasks=[
                "Apply Neem-based biopesticide",
                "Maintain 12-hour gap from irrigation"
            ]
        ),
        DailyAction(
            day="Day 4",
            title="Field Observation",
            tasks=[
                "Capture new image for progress check",
                "AI compares before-after condition"
            ]
        ),
        DailyAction(
            day="Day 5",
            title="Nutrient Boost",
            tasks=[
                "Add potassium-rich fertilizer",
                "Avoid nitrogen-heavy fertilizers"
            ]
        ),
        DailyAction(
            day="Day 6",
            title="Secondary Inspection",
            tasks=[
                "Inspect lower leaves",
                "Remove newly affected areas"
            ]
        ),
        DailyAction(
            day="Day 7",
            title="Final Assessment",
            tasks=[
                "Upload updated image",
                "System evaluates recovery %",
                "Suggest continuation or stop plan"
            ]
        )
    ]

    return ActionPlanResponse(
        disease_name="Leaf Blight",
        crop="Tomato",
        location="Haryana",
        weather="Humid, 28°C",
        plan=mock_plan,
        recovery_percentage=85
    )
