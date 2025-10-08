"""
Alerts API router.
Provides endpoints for alert management and active alerts.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from .. import crud, schemas
from ..database import get_db

router = APIRouter(
    prefix="/alerts",
    tags=["alerts"]
)


@router.get("/active")
async def get_active_alerts(
    severity: Optional[str] = Query(None, description="Filter by severity"),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Get active flood alerts.
    Returns recent high-severity flood events for alert display.
    
    **Query Parameters:**
    - severity: Filter by severity level (optional)
    - limit: Maximum number of alerts (default: 50)
    
    **Returns:**
    List of active alerts with location and risk information.
    """
    # Get recent flood events (last 48 hours)
    cutoff_time = datetime.now() - timedelta(hours=48)
    
    # Get all recent events
    all_events = crud.get_flood_events(db, skip=0, limit=500, severity=severity)
    
    # Filter for recent events
    active_alerts = []
    for event in all_events:
        if event.timestamp >= cutoff_time:
            # Calculate estimated time window
            time_ago = datetime.now() - event.timestamp
            hours_ago = int(time_ago.total_seconds() / 3600)
            
            # Forecast window (estimated time until peak flooding)
            forecast_hours = max(1, 8 - hours_ago)
            
            active_alerts.append({
                "id": event.id,
                "location": event.location_name,
                "risk": event.severity,
                "risk_score": event.risk_score,
                "latitude": event.latitude,
                "longitude": event.longitude,
                "time": f"{forecast_hours} hours" if forecast_hours > 1 else f"{forecast_hours * 60} minutes",
                "rainfall_mm": event.rainfall_mm,
                "elevation_m": event.elevation_m,
                "description": event.description or f"{event.severity} risk flooding expected",
                "timestamp": event.timestamp.isoformat() if event.timestamp else None
            })
    
    # Sort by risk score (highest first)
    active_alerts.sort(key=lambda x: x["risk_score"], reverse=True)
    
    return active_alerts[:limit]


@router.get("/history")
async def get_alert_history(
    days: int = Query(7, ge=1, le=30, description="Number of days of history"),
    db: Session = Depends(get_db)
):
    """
    Get historical alerts for analysis and reporting.
    
    **Query Parameters:**
    - days: Number of days to look back (1-30)
    
    **Returns:**
    Historical alert data with statistics.
    """
    cutoff_time = datetime.now() - timedelta(days=days)
    
    all_events = crud.get_flood_events(db, skip=0, limit=1000)
    historical_events = [
        event for event in all_events
        if event.timestamp >= cutoff_time
    ]
    
    # Calculate statistics
    total_alerts = len(historical_events)
    severity_counts = {
        "Critical": sum(1 for e in historical_events if e.severity == "Critical"),
        "High": sum(1 for e in historical_events if e.severity == "High"),
        "Medium": sum(1 for e in historical_events if e.severity == "Medium"),
        "Low": sum(1 for e in historical_events if e.severity == "Low")
    }
    
    avg_risk_score = sum(e.risk_score for e in historical_events) / total_alerts if total_alerts > 0 else 0
    
    return {
        "period_days": days,
        "total_alerts": total_alerts,
        "severity_breakdown": severity_counts,
        "average_risk_score": round(avg_risk_score, 2),
        "alerts": [
            {
                "id": event.id,
                "location": event.location_name,
                "severity": event.severity,
                "risk_score": event.risk_score,
                "timestamp": event.timestamp.isoformat() if event.timestamp else None
            }
            for event in historical_events[:50]  # Limit to 50 most recent
        ]
    }


@router.get("/statistics")
async def get_alert_statistics(
    db: Session = Depends(get_db)
):
    """
    Get overall alert system statistics.
    
    **Returns:**
    System-wide statistics for dashboard display.
    """
    # Get all flood events
    all_events = crud.get_flood_events(db, skip=0, limit=10000)
    
    # Calculate various statistics
    total_events = len(all_events)
    
    # Recent activity (last 24 hours)
    cutoff_24h = datetime.now() - timedelta(hours=24)
    recent_events = [e for e in all_events if e.timestamp >= cutoff_24h]
    
    # Severity distribution
    severity_distribution = {
        "Critical": sum(1 for e in all_events if e.severity == "Critical"),
        "High": sum(1 for e in all_events if e.severity == "High"),
        "Medium": sum(1 for e in all_events if e.severity == "Medium"),
        "Low": sum(1 for e in all_events if e.severity == "Low")
    }
    
    # Average risk score
    avg_risk = sum(e.risk_score for e in all_events) / total_events if total_events > 0 else 0
    
    # Most affected locations
    location_counts = {}
    for event in all_events:
        location_counts[event.location_name] = location_counts.get(event.location_name, 0) + 1
    
    top_locations = sorted(location_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return {
        "total_events": total_events,
        "events_last_24h": len(recent_events),
        "average_risk_score": round(avg_risk, 2),
        "severity_distribution": severity_distribution,
        "most_affected_locations": [
            {"location": loc, "count": count}
            for loc, count in top_locations
        ],
        "system_status": "operational",
        "last_updated": datetime.now().isoformat()
    }


@router.get("/nearby-alerts")
async def get_nearby_alerts(
    latitude: float = Query(..., description="User latitude"),
    longitude: float = Query(..., description="User longitude"),
    radius_km: float = Query(10.0, ge=0.1, le=50, description="Search radius in km"),
    db: Session = Depends(get_db)
):
    """
    Get active alerts near a specific location.
    Used for location-based notifications.
    
    **Query Parameters:**
    - latitude: User's latitude
    - longitude: User's longitude
    - radius_km: Search radius in kilometers
    
    **Returns:**
    Nearby active alerts within the specified radius.
    """
    # Get nearby flood events
    nearby_events = crud.get_flood_events_by_location(
        db=db,
        latitude=latitude,
        longitude=longitude,
        radius_km=radius_km
    )
    
    # Filter for recent events (last 48 hours)
    cutoff_time = datetime.now() - timedelta(hours=48)
    
    nearby_alerts = []
    for event in nearby_events:
        if event.timestamp >= cutoff_time and event.severity in ["High", "Critical"]:
            time_ago = datetime.now() - event.timestamp
            hours_ago = int(time_ago.total_seconds() / 3600)
            forecast_hours = max(1, 8 - hours_ago)
            
            nearby_alerts.append({
                "id": event.id,
                "location": event.location_name,
                "risk": event.severity,
                "risk_score": event.risk_score,
                "latitude": event.latitude,
                "longitude": event.longitude,
                "time": f"{forecast_hours} hours",
                "description": f"{event.severity} flood risk in your area",
                "rainfall_mm": event.rainfall_mm,
                "elevation_m": event.elevation_m
            })
    
    return {
        "user_location": {
            "latitude": latitude,
            "longitude": longitude
        },
        "search_radius_km": radius_km,
        "alerts_found": len(nearby_alerts),
        "alerts": nearby_alerts
    }
