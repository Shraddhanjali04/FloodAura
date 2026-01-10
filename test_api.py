import httpx
import asyncio

async def test_api():
    try:
        url = "https://api.openweathermap.org/data/2.5/weather"
        params = {"lat": 28, "lon": 77, "appid": "test"}
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10)
            
            if response.status_code == 401:
                print("✅ OpenWeatherMap API is ONLINE")
                print("   (Got 401 - API key invalid, but server is responding)")
            elif response.status_code == 200:
                print("✅ OpenWeatherMap API is ONLINE and working")
            else:
                print(f"⚠️  API responded with status: {response.status_code}")
                
    except httpx.ConnectError:
        print("❌ OpenWeatherMap API is OFFLINE or unreachable")
    except Exception as e:
        print(f"❌ Error: {e}")

asyncio.run(test_api())
