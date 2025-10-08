from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Import Google Generative AI
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    logger.warning("Google Generative AI library not installed")

class RouteRequest(BaseModel):
    point_a: str
    point_b: str
    vehicle_type: str

class RouteVerdictResponse(BaseModel):
    route_status: str
    overall_score: int
    recommendation: str
    factors: Dict[str, Any]
    estimated_time: str
    alternative_route: Optional[str] = None
    next_update: str

@router.post("/route-verdict", response_model=RouteVerdictResponse)
async def get_route_verdict(request: RouteRequest):
    """
    Analyze route from Point A to Point B considering weather conditions,
    waterlogging risk, traffic, and vehicle type using Gemini AI.
    """
    try:
        # Configure Gemini AI
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        
        if not GEMINI_AVAILABLE or not gemini_api_key:
            logger.warning("Gemini AI not available, using mock data")
            return generate_mock_verdict(request)
        
        genai.configure(api_key=gemini_api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        # Create prompt for Gemini
        prompt = f"""
        Analyze the route from {request.point_a} to {request.point_b} for a {request.vehicle_type}.
        
        Consider the following factors:
        1. Current and predicted rainfall in the area
        2. Waterlogging risk based on terrain and drainage
        3. Traffic conditions
        4. Vehicle suitability for weather conditions
        
        Provide a detailed route verdict in the following JSON format:
        {{
            "route_status": "safe|moderate_risk|high_risk|unsafe",
            "overall_score": <number 0-100>,
            "recommendation": "<brief recommendation>",
            "factors": {{
                "rainfall": {{
                    "status": "low|moderate|high",
                    "description": "<description>",
                    "impact": <percentage 0-100>
                }},
                "waterlogging": {{
                    "status": "low|moderate|high",
                    "description": "<description>",
                    "impact": <percentage 0-100>
                }},
                "traffic": {{
                    "status": "low|moderate|high",
                    "description": "<description>",
                    "impact": <percentage 0-100>
                }},
                "vehicle_suitability": {{
                    "status": "suitable|moderate|unsuitable",
                    "description": "<description>",
                    "impact": <percentage 0-100>
                }}
            }},
            "estimated_time": "<time estimate>",
            "alternative_route": "<alternative if needed>",
            "next_update": "1 hour"
        }}
        
        Base your analysis on real weather patterns for the Indian region.
        """
        
        # Generate response
        response = model.generate_content(prompt)
        
        # Parse response (assuming it returns JSON-like text)
        import json
        try:
            # Try to extract JSON from response
            response_text = response.text
            # Remove markdown code blocks if present
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0]
            
            verdict_data = json.loads(response_text.strip())
            return RouteVerdictResponse(**verdict_data)
        except (json.JSONDecodeError, KeyError) as e:
            logger.error(f"Failed to parse Gemini response: {e}")
            logger.error(f"Response text: {response.text}")
            return generate_mock_verdict(request)
            
    except Exception as e:
        logger.error(f"Error generating route verdict: {str(e)}")
        # Return mock data as fallback
        return generate_mock_verdict(request)

def generate_mock_verdict(request: RouteRequest) -> RouteVerdictResponse:
    """Generate mock verdict data for development/fallback"""
    
    # Simulate different risk levels based on vehicle type
    vehicle_scores = {
        'bike': 55,
        'car': 70,
        'suv': 85
    }
    
    base_score = vehicle_scores.get(request.vehicle_type, 70)
    
    # Determine route status based on score
    if base_score >= 80:
        route_status = "safe"
        recommendation = "Route is safe to travel. Normal precautions apply."
    elif base_score >= 60:
        route_status = "moderate_risk"
        recommendation = "Proceed with caution. Monitor weather updates."
    elif base_score >= 40:
        route_status = "high_risk"
        recommendation = "High risk conditions. Consider postponing travel."
    else:
        route_status = "unsafe"
        recommendation = "Travel not recommended. Wait for conditions to improve."
    
    return RouteVerdictResponse(
        route_status=route_status,
        overall_score=base_score,
        recommendation=recommendation,
        factors={
            "rainfall": {
                "status": "moderate",
                "description": f"Moderate rainfall expected along route from {request.point_a} to {request.point_b}",
                "impact": 35
            },
            "waterlogging": {
                "status": "moderate" if base_score > 50 else "high",
                "description": "Some low-lying areas may experience waterlogging",
                "impact": 45 if base_score > 50 else 65
            },
            "traffic": {
                "status": "low",
                "description": "Light to moderate traffic expected",
                "impact": 20
            },
            "vehicle_suitability": {
                "status": "suitable" if base_score > 60 else "moderate",
                "description": f"{request.vehicle_type.upper()} is {'suitable' if base_score > 60 else 'moderately suitable'} for current conditions",
                "impact": 15 if base_score > 60 else 35
            }
        },
        estimated_time="45-60 minutes",
        alternative_route="Consider NH-48 via outer ring road for better drainage" if base_score < 70 else None,
        next_update="1 hour"
    )
