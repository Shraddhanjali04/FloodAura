"""
Live Map API router.
Provides endpoints for map features, location services, and real-time updates.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from .. import crud, schemas
from ..database import get_db
from ..services.flood_risk import flood_risk_service
from pydantic import BaseModel

router = APIRouter(
    prefix="/map",
    tags=["map"]
)


class LocationRequest(BaseModel):
    lat: float
    lng: float


class LocationSearchResponse(BaseModel):
    location_name: str
    latitude: float
    longitude: float
    risk_score: float
    severity: str
    found: bool


@router.get("/last-update")
async def get_last_update():
    """
    Get the timestamp of the last map data update.
    Used for displaying freshness of data on the frontend.
    """
    return {
        "timestamp": datetime.now().strftime("%I:%M:%S %p"),
        "last_updated": datetime.now().isoformat(),
        "status": "operational"
    }


@router.get("/search")
async def search_location(
    location: str = Query(..., description="Location name or address to search"),
    db: Session = Depends(get_db)
):
    """
    Search for a location and get flood risk information.
    
    **Query Parameters:**
    - location: Location name or address
    
    **Returns:**
    Location details with risk assessment and nearby flood events.
    """
    # For now, return mock geocoding results
    # In production, integrate with Google Geocoding API or similar
    
    # Search for flood events with similar location names
    flood_events = crud.get_flood_events(db, skip=0, limit=100)
    matching_events = [
        event for event in flood_events
        if location.lower() in event.location_name.lower()
    ]
    
    if matching_events:
        event = matching_events[0]
        return {
            "found": True,
            "location_name": event.location_name,
            "latitude": event.latitude,
            "longitude": event.longitude,
            "risk_score": event.risk_score,
            "severity": event.severity,
            "matching_events": len(matching_events)
        }
    
    return {
        "found": False,
        "query": location,
        "message": "Location not found. Try searching for a nearby area.",
        "suggestion": "Use the 'Locate Me' button to find your current location"
    }


@router.post("/locate")
async def locate_user(
    location: LocationRequest,
    db: Session = Depends(get_db)
):
    """
    Process user's current location and return flood risk info.
    
    **Request Body:**
    ```json
    {
        "lat": 40.7128,
        "lng": -74.0060
    }
    ```
    
    **Returns:**
    User location with calculated flood risk and nearby events.
    """
    # Calculate flood risk for user's location
    risk_data = await flood_risk_service.calculate_flood_risk(
        latitude=location.lat,
        longitude=location.lng
    )
    
    # Get nearby flood events
    nearby_events = crud.get_flood_events_by_location(
        db=db,
        latitude=location.lat,
        longitude=location.lng,
        radius_km=5.0
    )
    
    return {
        "latitude": location.lat,
        "longitude": location.lng,
        "risk_score": risk_data["risk_score"],
        "severity": risk_data["severity"],
        "rainfall_mm": risk_data["rainfall_mm"],
        "elevation_m": risk_data["elevation_m"],
        "nearby_events": len(nearby_events),
        "nearest_events": [
            {
                "id": event.id,
                "location_name": event.location_name,
                "severity": event.severity,
                "risk_score": event.risk_score,
                "distance_km": calculate_distance(
                    location.lat, location.lng,
                    event.latitude, event.longitude
                )
            }
            for event in nearby_events[:5]
        ]
    }


@router.get("/active-alerts")
async def get_active_map_alerts(
    db: Session = Depends(get_db)
):
    """
    Get all active flood alerts for map display.
    Returns high and critical severity events from the last 24 hours.
    """
    from datetime import datetime, timedelta
    
    # Get recent high-severity events
    all_events = crud.get_flood_events(db, skip=0, limit=500)
    
    # Filter for recent high/critical events
    cutoff_time = datetime.now() - timedelta(hours=24)
    active_alerts = [
        {
            "id": event.id,
            "location": event.location_name,
            "risk": event.severity,
            "risk_score": event.risk_score,
            "latitude": event.latitude,
            "longitude": event.longitude,
            "time": calculate_time_ago(event.timestamp),
            "rainfall_mm": event.rainfall_mm,
            "elevation_m": event.elevation_m
        }
        for event in all_events
        if event.severity in ["High", "Critical"]
        and event.timestamp >= cutoff_time
    ]
    
    return active_alerts


@router.get("/heatmap-data")
async def get_heatmap_data(
    db: Session = Depends(get_db)
):
    """
    Get data points for heatmap visualization on the map.
    Returns all flood events with their risk scores for overlay.
    """
    flood_events = crud.get_flood_events(db, skip=0, limit=1000)
    
    heatmap_points = [
        {
            "lat": event.latitude,
            "lng": event.longitude,
            "intensity": event.risk_score / 100,  # Normalize to 0-1
            "severity": event.severity,
            "location": event.location_name
        }
        for event in flood_events
    ]
    
    return {
        "points": heatmap_points,
        "total_points": len(heatmap_points),
        "last_updated": datetime.now().isoformat()
    }


@router.get("/forecast/{latitude}/{longitude}")
async def get_location_forecast(
    latitude: float,
    longitude: float,
    hours: int = Query(8, ge=1, le=48, description="Forecast hours")
):
    """
    Get hourly flood forecast for a specific location.
    
    **Parameters:**
    - latitude: Location latitude
    - longitude: Location longitude
    - hours: Number of hours to forecast (1-48)
    
    **Returns:**
    Hourly flood risk predictions.
    """
    # Calculate current risk
    risk_data = await flood_risk_service.calculate_flood_risk(
        latitude=latitude,
        longitude=longitude
    )
    
    # Generate hourly forecast (mock data for now)
    # In production, this would use weather forecast API
    from datetime import datetime, timedelta
    
    forecast = []
    base_time = datetime.now()
    base_risk = risk_data["risk_score"]
    
    for i in range(hours):
        # Simulate risk variation over time
        time_offset = i + 1
        risk_variation = (time_offset % 3) * 5  # Simple variation
        hourly_risk = min(100, max(0, base_risk + risk_variation - 10))
        
        forecast.append({
            "hour": (base_time + timedelta(hours=time_offset)).strftime("%I %p"),
            "timestamp": (base_time + timedelta(hours=time_offset)).isoformat(),
            "risk_score": round(hourly_risk, 1),
            "severity": flood_risk_service.calculate_severity(hourly_risk),
            "rainfall_mm": risk_data["rainfall_mm"] * (0.8 + (i % 3) * 0.2),
            "confidence": max(50, 95 - (i * 2))  # Confidence decreases over time
        })
    
    return {
        "latitude": latitude,
        "longitude": longitude,
        "current_risk": base_risk,
        "current_severity": risk_data["severity"],
        "forecast": forecast,
        "generated_at": datetime.now().isoformat()
    }


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate approximate distance between two coordinates in km.
    Uses simplified formula for small distances.
    """
    from math import radians, cos, sqrt
    
    # Convert to radians
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    
    # Simplified distance calculation
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    # Approximate distance using Pythagorean theorem
    # (works well for small distances)
    a = dlat ** 2 + (dlon * cos((lat1 + lat2) / 2)) ** 2
    distance = sqrt(a) * 6371  # Earth radius in km
    
    return round(distance, 2)


def calculate_time_ago(timestamp: datetime) -> str:
    """
    Calculate human-readable time difference.
    """
    from datetime import datetime
    
    if not timestamp:
        return "Unknown"
    
    now = datetime.now()
    diff = now - timestamp
    
    hours = diff.total_seconds() / 3600
    
    if hours < 1:
        minutes = int(diff.total_seconds() / 60)
        return f"{minutes} minutes"
    elif hours < 24:
        return f"{int(hours)} hours"
    else:
        days = int(hours / 24)
        return f"{days} days"
