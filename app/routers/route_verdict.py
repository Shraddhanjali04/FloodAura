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
    """Generate intelligent mock verdict data based on location and vehicle type"""
    import datetime
    import re
    
    # Analyze location names for flood-prone keywords
    route_text = f"{request.point_a} {request.point_b}".lower()
    
    # Enhanced location risk analysis with weighted scoring
    high_risk_keywords = {
        'underpass': 35, 'subway': 35, 'tunnel': 30,
        'low-lying': 30, 'lowland': 30, 'depression': 25,
        'river': 25, 'riverview': 25, 'riverside': 25,
        'canal': 25, 'nallah': 25, 'drain': 20,
        'lake': 20, 'pond': 20, 'wetland': 20,
        'flood': 40, 'waterlogged': 40, 'inundated': 35,
        'valley': 20, 'basin': 20, 'dell': 15
    }
    
    moderate_risk_keywords = {
        'bridge': 15, 'crossing': 12, 'junction': 10,
        'market': 12, 'station': 10, 'old': 8,
        'narrow': 10, 'congested': 12, 'bypass': -5
    }
    
    safe_keywords = {
        'elevated': -20, 'flyover': -25, 'expressway': -30,
        'highway': -15, 'metro': -20, 'hill': -25,
        'ridge': -20, 'skyway': -25, 'overpass': -20,
        'ring road': -15, 'outer ring': -20
    }
    
    # Calculate location risk score with weighted analysis
    location_risk = 0
    high_risk_count = 0
    
    for keyword, weight in high_risk_keywords.items():
        if keyword in route_text:
            location_risk += weight
            high_risk_count += 1
    
    for keyword, weight in moderate_risk_keywords.items():
        if keyword in route_text:
            location_risk += weight
    
    for keyword, weight in safe_keywords.items():
        if keyword in route_text:
            location_risk += weight
    
    # Ensure location risk is within bounds
    location_risk = max(0, min(60, location_risk))
    
    # Vehicle-specific ground clearance and capability
    vehicle_profiles = {
        'bike': {'base_score': 45, 'clearance': 'low', 'water_depth': 4},  # 4 inches
        'car': {'base_score': 65, 'clearance': 'medium', 'water_depth': 8},  # 8 inches
        'suv': {'base_score': 80, 'clearance': 'high', 'water_depth': 15}   # 15 inches
    }
    
    vehicle_type = request.vehicle_type.lower()
    profile = vehicle_profiles.get(vehicle_type, vehicle_profiles['car'])
    base_score = profile['base_score']
    
    # Seasonal analysis - Indian monsoon patterns
    month = datetime.datetime.now().month
    day_of_month = datetime.datetime.now().day
    hour = datetime.datetime.now().hour
    
    # Peak monsoon: July-August, Pre-monsoon: June, Post-monsoon: September
    if month in [7, 8]:
        season_factor = 1.5  # Peak monsoon
        rainfall_status = "high"
        rainfall_base = 60
    elif month == 6:
        season_factor = 1.2  # Pre-monsoon
        rainfall_status = "moderate"
        rainfall_base = 40
    elif month == 9:
        season_factor = 1.1  # Post-monsoon
        rainfall_status = "moderate"
        rainfall_base = 35
    else:
        season_factor = 0.6  # Non-monsoon
        rainfall_status = "low"
        rainfall_base = 15
    
    # Adjust for time of day (afternoon showers common in monsoon)
    if 14 <= hour <= 18 and month in [6, 7, 8, 9]:
        time_rainfall_boost = 10
    else:
        time_rainfall_boost = 0
    
    # Calculate rainfall impact (0-100)
    rainfall_impact = min(100, int(rainfall_base * season_factor) + time_rainfall_boost)
    
    # Calculate waterlogging impact based on multiple factors
    # Base waterlogging from location + rainfall contribution + vehicle vulnerability
    waterlog_base = location_risk * 1.5  # Location is primary factor
    waterlog_rain_contribution = (rainfall_impact * 0.4)  # Rainfall contributes
    waterlog_vehicle_penalty = (100 - base_score) * 0.3  # Lower vehicle capability = higher risk
    
    waterlog_impact = int(min(100, waterlog_base + waterlog_rain_contribution + waterlog_vehicle_penalty))
    
    # Determine waterlogging status and description
    if waterlog_impact > 70:
        waterlog_status = "high"
        waterlog_desc = f"Severe waterlogging likely along route. Water depth may exceed {profile['water_depth']} inches (unsafe for {vehicle_type.upper()})"
    elif waterlog_impact > 40:
        waterlog_status = "moderate"
        waterlog_desc = f"Moderate waterlogging possible in low-lying sections. Water depth 4-{profile['water_depth']} inches expected"
    else:
        waterlog_status = "low"
        waterlog_desc = f"Well-drained route with minimal waterlogging risk. Safe for {vehicle_type.upper()}"
    
    # Enhanced traffic analysis
    is_weekday = datetime.datetime.now().weekday() < 5
    is_peak_morning = 7 <= hour <= 10
    is_peak_evening = 17 <= hour <= 20
    is_peak_hour = (is_peak_morning or is_peak_evening) and is_weekday
    
    # Traffic impact considering weather
    if is_peak_hour:
        traffic_base = 45
        traffic_status = "high"
        traffic_desc = "Heavy traffic during peak hours"
    elif is_weekday and 10 < hour < 17:
        traffic_base = 25
        traffic_status = "moderate"
        traffic_desc = "Moderate traffic expected"
    else:
        traffic_base = 10
        traffic_status = "low"
        traffic_desc = "Light traffic, off-peak hours"
    
    # Rain increases traffic congestion
    traffic_weather_multiplier = 1.4 if rainfall_impact > 50 else 1.0
    traffic_impact = int(min(100, traffic_base * traffic_weather_multiplier))
    
    if traffic_weather_multiplier > 1:
        traffic_desc += ". Rain will increase congestion significantly"
    
    # Vehicle suitability analysis
    if waterlog_impact > 70:
        if vehicle_type == 'suv':
            vehicle_suit_status = "moderate"
            vehicle_suit_desc = f"SUV suitable but exercise caution. Water may reach {profile['water_depth']} inch clearance limit"
            vehicle_impact = 25
        elif vehicle_type == 'car':
            vehicle_suit_status = "unsuitable"
            vehicle_suit_desc = f"Car unsuitable for severe waterlogging. Water will exceed {profile['water_depth']} inch clearance"
            vehicle_impact = 65
        else:  # bike
            vehicle_suit_status = "unsuitable"
            vehicle_suit_desc = f"Bike highly unsafe in flooded conditions. Risk of skidding and engine damage"
            vehicle_impact = 80
    elif waterlog_impact > 40:
        if vehicle_type == 'suv':
            vehicle_suit_status = "suitable"
            vehicle_suit_desc = f"SUV well-suited with {profile['water_depth']} inch ground clearance"
            vehicle_impact = 15
        elif vehicle_type == 'car':
            vehicle_suit_status = "moderate"
            vehicle_suit_desc = f"Car can manage but avoid deep water (>{profile['water_depth']} inches)"
            vehicle_impact = 35
        else:  # bike
            vehicle_suit_status = "unsuitable"
            vehicle_suit_desc = f"Bike not recommended. High risk of skidding on wet roads"
            vehicle_impact = 55
    else:
        if vehicle_type == 'suv':
            vehicle_suit_status = "suitable"
            vehicle_suit_desc = f"SUV excellent for current conditions"
            vehicle_impact = 10
        elif vehicle_type == 'car':
            vehicle_suit_status = "suitable"
            vehicle_suit_desc = f"Car suitable for current conditions"
            vehicle_impact = 15
        else:  # bike
            vehicle_suit_status = "moderate"
            vehicle_suit_desc = f"Bike manageable but maintain safe speed on wet roads"
            vehicle_impact = 25
    
    # Calculate comprehensive risk score (weighted formula)
    # Weights: Waterlogging (50%), Rainfall (25%), Traffic (10%), Vehicle (15%)
    comprehensive_risk = (
        waterlog_impact * 0.50 +
        rainfall_impact * 0.25 +
        traffic_impact * 0.10 +
        vehicle_impact * 0.15
    )
    
    # Final safety score (inverse of risk)
    final_score = int(max(0, min(100, 100 - comprehensive_risk)))
    
    # Detailed rainfall description
    if month in [7, 8]:
        rainfall_desc = f"Peak monsoon season. Heavy rainfall expected. Route from {request.point_a} to {request.point_b} at high risk of flooding"
    elif month == 6:
        rainfall_desc = f"Pre-monsoon period. Intermittent heavy showers possible between {request.point_a} and {request.point_b}"
    elif month == 9:
        rainfall_desc = f"Post-monsoon season. Occasional rainfall expected. Ground saturation may cause waterlogging"
    else:
        rainfall_desc = f"Non-monsoon season. Minimal rainfall expected on route from {request.point_a} to {request.point_b}"
    
    # Determine route status with more granular thresholds
    if final_score >= 80:
        route_status = "safe"
        recommendation = f"✅ SAFE: Route is safe for {vehicle_type.upper()}. {traffic_desc}. Normal travel time expected."
    elif final_score >= 60:
        route_status = "moderate_risk"
        recommendation = f"⚠️ MODERATE RISK: {vehicle_type.upper()} can proceed with caution. {waterlog_desc.split('.')[0]}. Monitor weather updates closely and avoid stopping in low areas."
    elif final_score >= 40:
        route_status = "high_risk"
        recommendation = f"🚨 HIGH RISK: Not recommended for {vehicle_type.upper()}. {waterlog_desc.split('.')[0]}. Significant delays and safety hazards. Consider postponing or use alternative route."
    else:
        route_status = "unsafe"
        recommendation = f"❌ UNSAFE: DO NOT TRAVEL. Severe conditions for {vehicle_type.upper()}. {waterlog_desc.split('.')[0]}. Risk of vehicle damage and personal safety. Wait for conditions to improve (min 2-3 hours)."
    
    # Calculate realistic estimated time based on conditions
    # Base time calculation from location string parsing
    base_time = 30  # Default 30 minutes
    
    # Increase base time for longer distances (simple heuristic)
    if len(request.point_a) + len(request.point_b) > 40:
        base_time = 50
    
    # Add delays based on conditions
    traffic_delay = int(traffic_impact * 0.3) if traffic_impact > 30 else 0
    weather_delay = int((rainfall_impact + waterlog_impact) * 0.2) if waterlog_impact > 40 else 0
    
    total_time = base_time + traffic_delay + weather_delay
    
    if final_score < 40:
        estimated_time = f"{total_time + 20}-{total_time + 40} minutes (severe delays, crawling traffic)"
    elif final_score < 60:
        estimated_time = f"{total_time + 10}-{total_time + 20} minutes (significant delays expected)"
    elif final_score < 80:
        estimated_time = f"{total_time}-{total_time + 10} minutes (minor delays possible)"
    else:
        estimated_time = f"{base_time}-{base_time + 5} minutes (normal conditions)"
    
    # Intelligent alternative route suggestions
    alternative = None
    if final_score < 50:
        if 'underpass' in route_text or 'subway' in route_text:
            alternative = "🔄 CRITICAL: Avoid underpass - completely flooded. Use elevated bypass or ring road immediately"
        elif 'river' in route_text or 'canal' in route_text:
            alternative = f"🔄 Use bridge crossing upstream. Avoid riverside route near {request.point_a}-{request.point_b}"
        elif 'expressway' not in route_text and 'highway' not in route_text:
            alternative = f"🔄 Recommended: Take elevated expressway or outer ring road for better drainage"
        else:
            alternative = "🔄 No safe alternative available. Wait 2-3 hours for water to recede or postpone travel"
    elif final_score < 70:
        if high_risk_count > 0:
            alternative = f"🔄 Consider alternate route avoiding low-lying areas if possible"
    
    # Next update timing based on severity
    if final_score < 50:
        next_update = "15 minutes"  # Critical - frequent updates
    elif final_score < 70:
        next_update = "30 minutes"  # Moderate - regular updates
    else:
        next_update = "1 hour"  # Safe - normal updates
    
    return RouteVerdictResponse(
        route_status=route_status,
        overall_score=final_score,
        recommendation=recommendation,
        factors={
            "rainfall": {
                "status": rainfall_status,
                "description": rainfall_desc,
                "impact": rainfall_impact
            },
            "waterlogging": {
                "status": waterlog_status,
                "description": waterlog_desc,
                "impact": waterlog_impact
            },
            "traffic": {
                "status": traffic_status,
                "description": traffic_desc,
                "impact": traffic_impact
            },
            "vehicle_suitability": {
                "status": vehicle_suit_status,
                "description": vehicle_suit_desc,
                "impact": vehicle_impact
            }
        },
        estimated_time=estimated_time,
        alternative_route=alternative,
        next_update=next_update
    )
