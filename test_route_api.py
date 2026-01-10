#!/usr/bin/env python3
"""Test script to debug route verdict API"""
import sys
import asyncio
import traceback
from app.routers.route_verdict import RouteRequest, get_route_verdict

async def test_route_verdict():
    """Test the route verdict function"""
    try:
        request = RouteRequest(
            point_a="Connaught Place, Delhi",
            point_b="India Gate, Delhi",
            vehicle_type="car"
        )
        
        print(f"Testing route verdict for {request.point_a} -> {request.point_b}")
        result = await get_route_verdict(request)
        print(f"\n✅ SUCCESS!")
        print(f"Route Status: {result.route_status}")
        print(f"Overall Score: {result.overall_score}")
        print(f"Recommendation: {result.recommendation}")
        return result
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        print(f"\nFull traceback:")
        traceback.print_exc()
        return None

if __name__ == "__main__":
    asyncio.run(test_route_verdict())
