import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Plus, Minus, Maximize2, Clock, Target } from 'lucide-react';
import apiService from '../services/api';

const LiveMap = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Fetch active alerts from backend
  const fetchActiveAlerts = useCallback(async () => {
    try {
      const data = await apiService.getActiveAlerts();
      setActiveAlerts(data);
      setApiConnected(true);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setApiConnected(false);
      // Fallback to mock data for development
      setActiveAlerts([
        { id: 1, location: 'Downtown', risk: 'High', time: '2 hours', risk_score: 75 },
        { id: 2, location: 'East Side', risk: 'Medium', time: '4 hours', risk_score: 45 }
      ]);
    }
  }, []);

  // Fetch last updated time
  const fetchLastUpdated = useCallback(async () => {
    try {
      const data = await apiService.getLastUpdate();
      setLastUpdated(data.timestamp);
    } catch (error) {
      // Fallback to current time
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchActiveAlerts();
    fetchLastUpdated();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchActiveAlerts();
      fetchLastUpdated();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchActiveAlerts, fetchLastUpdated]);

  // Handle location search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    try {
      const data = await apiService.searchLocation(searchQuery);
      
      if (data.found) {
        console.log('Location found:', data);
        alert(`Found: ${data.location_name}\nRisk Level: ${data.severity}\nRisk Score: ${data.risk_score}`);
        // TODO: Center map on location
      } else {
        alert('Location not found. Try searching for a nearby area or use "Locate Me"');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Unable to search location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle locate me button
  const handleLocateMe = async () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          
          try {
            const data = await apiService.sendUserLocation(latitude, longitude);
            console.log('Location data:', data);
            
            // Show risk information
            alert(
              `Your Location Risk Assessment:\n\n` +
              `Risk Level: ${data.severity}\n` +
              `Risk Score: ${data.risk_score}/100\n` +
              `Rainfall: ${data.rainfall_mm}mm\n` +
              `Elevation: ${data.elevation_m}m\n` +
              `Nearby Events: ${data.nearby_events}`
            );
            
            // Fetch nearby alerts
            if (data.nearby_events > 0) {
              const nearbyAlerts = await apiService.getNearbyAlerts(latitude, longitude, 10);
              console.log('Nearby alerts:', nearbyAlerts);
            }
          } catch (error) {
            console.error('Error sending location:', error);
            alert('Location received but unable to fetch risk data');
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to access your location. Please enable location services.');
          setIsLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setIsLoading(false);
    }
  };

  // Map control handlers (ready for Mapbox/Leaflet integration)
  const handleZoomIn = () => {
    // TODO: Integrate with map library
    console.log('Zoom in');
  };

  const handleZoomOut = () => {
    // TODO: Integrate with map library
    console.log('Zoom out');
  };

  const handleFullscreen = () => {
    // TODO: Integrate with map library
    console.log('Toggle fullscreen');
  };

  const getRiskColor = (risk) => {
    const riskLower = risk?.toLowerCase();
    if (riskLower === 'critical') return 'border-purple-500';
    if (riskLower === 'high') return 'border-red-500';
    if (riskLower === 'medium' || riskLower === 'moderate') return 'border-yellow-500';
    if (riskLower === 'low') return 'border-green-500';
    return 'border-gray-500';
  };

  return (
    <div className="min-h-screen pt-20 bg-flood-darker">
      <div className="h-[calc(100vh-5rem)]">
        {/* Page Header */}
        <div className="bg-flood-darker px-8 py-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-flood-cyan mb-2">Live Flood Map</h1>
              <p className="text-gray-400">Real-time street-level flood risk monitoring</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-400">
                {apiConnected ? 'API Connected' : 'API Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar Section */}
        <div className="bg-flood-darker px-8 py-4 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-flood-navy/40 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-flood-cyan transition-colors"
              />
            </form>
            
            <button
              onClick={handleLocateMe}
              disabled={isLoading}
              className="bg-flood-cyan hover:bg-[#00BFFF] text-flood-navy px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow-cyan-glow disabled:opacity-50 whitespace-nowrap"
            >
              <Target className="w-5 h-5" />
              Locate Me
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex h-[calc(100vh-16.5rem)]">
          {/* Map Container */}
          <div className="flex-1 relative bg-flood-navy/20">
            {/* Map Placeholder */}
            <div className="absolute inset-0 bg-[#0a1628]">
              <div className="flex items-center justify-center h-full">
                <div className="text-center opacity-20">
                  <MapPin className="w-16 h-16 text-flood-cyan mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">Map will load here</p>
                </div>
              </div>
            </div>

            {/* Map Controls - Right Side */}
            <div className="absolute right-6 top-6 flex flex-col gap-1">
              <button
                onClick={handleZoomIn}
                className="bg-flood-navy/95 backdrop-blur-sm border border-gray-800 w-10 h-10 rounded-md hover:border-flood-cyan/50 transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleZoomOut}
                className="bg-flood-navy/95 backdrop-blur-sm border border-gray-800 w-10 h-10 rounded-md hover:border-flood-cyan/50 transition-colors flex items-center justify-center"
              >
                <Minus className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleFullscreen}
                className="bg-flood-navy/95 backdrop-blur-sm border border-gray-800 w-10 h-10 rounded-md hover:border-flood-cyan/50 transition-colors flex items-center justify-center"
              >
                <Target className="w-5 h-5 text-white" />
              </button>
              <button
                className="bg-flood-navy/95 backdrop-blur-sm border border-gray-800 w-10 h-10 rounded-md hover:border-flood-cyan/50 transition-colors flex items-center justify-center"
              >
                <Maximize2 className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Mapbox Attribution */}
            <div className="absolute left-6 bottom-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-flood-navy/95 backdrop-blur-sm rounded px-2 py-1">
                  <span className="text-white text-xs font-semibold">mapbox</span>
                </div>
              </div>
              <div className="bg-flood-navy/95 backdrop-blur-sm border border-gray-800 rounded-lg px-4 py-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-xs">Last updated: {lastUpdated || '9:31:13 PM'}</span>
              </div>
            </div>

            {/* Risk Legend - Bottom Center */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-flood-navy/95 backdrop-blur-sm border border-gray-800 rounded-lg px-6 py-3">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-300 text-xs">Low Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-300 text-xs">Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-gray-300 text-xs">High Risk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 bg-flood-darker border-l border-gray-800 overflow-y-auto">
            {/* Active Alerts Section */}
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-white font-bold text-lg mb-4">Active Alerts</h2>
              
              <div className="space-y-3">
                {activeAlerts.length > 0 ? (
                  activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`bg-flood-navy/40 border-l-4 ${getRiskColor(alert.risk)} rounded-r-lg p-4 hover:bg-flood-navy/60 transition-colors cursor-pointer`}
                    >
                      <div className="flex items-start gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${
                          alert.risk === 'High' ? 'bg-red-500' :
                          alert.risk === 'Moderate' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm">
                            {alert.risk} Risk - {alert.location}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">Expected in {alert.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No active alerts</p>
                  </div>
                )}
              </div>
            </div>

            {/* Map Legend Section */}
            <div className="p-6">
              <h3 className="text-white font-bold text-lg mb-4">Map Legend</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-white text-sm font-semibold mb-1">Risk Levels</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Color-coded by predicted water depth and impact
                  </p>
                </div>
                
                <div>
                  <h4 className="text-white text-sm font-semibold mb-1">Confidence</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Circle opacity indicates prediction confidence
                  </p>
                </div>
                
                <div>
                  <h4 className="text-white text-sm font-semibold mb-1">Time Window</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Hover for detailed forecast timeline
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
