import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, HeatmapLayer } from '@react-google-maps/api';

const libraries = ['visualization'];

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

// Center on India
const center = {
  lat: 20.5937,
  lng: 78.9629
};

const mapOptions = {
  zoom: 5,
  center: center,
  mapTypeControl: true,
  streetViewControl: false,
  fullscreenControl: false,
  zoomControl: false, // We'll use custom controls
  styles: [
    {
      featureType: 'all',
      elementType: 'geometry',
      stylers: [{ color: '#1a2332' }]
    },
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#8a9aa8' }]
    },
    {
      featureType: 'all',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#1a2332' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#0f1724' }]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#4e6d70' }]
    }
  ]
};

const GoogleMapComponent = ({ onMapLoad, weatherRiskData = [], userLocation = null, searchLocation = null }) => {
  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const onLoad = useCallback((map) => {
    setMap(map);
    if (onMapLoad) onMapLoad(map);
  }, [onMapLoad]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Center map on user location or search location when they change
  useEffect(() => {
    if (map) {
      if (searchLocation) {
        map.panTo(searchLocation);
        map.setZoom(12);
      } else if (userLocation) {
        map.panTo(userLocation);
        map.setZoom(12);
      }
    }
  }, [map, userLocation, searchLocation]);

  // Convert weather risk data to heatmap format
  const getHeatmapData = () => {
    if (!window.google || !weatherRiskData || weatherRiskData.length === 0) return [];
    
    return weatherRiskData.map(point => ({
      location: new window.google.maps.LatLng(point.lat, point.lng),
      weight: point.risk_score / 100 // Normalize risk score to 0-1
    }));
  };

  // Get marker color based on risk level
  const getMarkerIcon = (riskLevel) => {
    const colors = {
      'Low': 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      'Medium': 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
      'Moderate': 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
      'High': 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
      'Critical': 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'
    };
    return colors[riskLevel] || 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
  };

  const heatmapData = getHeatmapData();

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}
      libraries={libraries}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={5}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* Heatmap Layer for Weather Risk */}
        {heatmapData.length > 0 && (
          <HeatmapLayer
            data={heatmapData}
            options={{
              radius: 30,
              opacity: 0.6,
              gradient: [
                'rgba(0, 255, 0, 0)',
                'rgba(0, 255, 0, 1)',
                'rgba(255, 255, 0, 1)',
                'rgba(255, 165, 0, 1)',
                'rgba(255, 0, 0, 1)',
                'rgba(139, 0, 0, 1)'
              ]
            }}
          />
        )}

        {/* Weather Risk Markers */}
        {weatherRiskData && weatherRiskData.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            icon={getMarkerIcon(location.risk_level)}
            onClick={() => setSelectedMarker(location)}
          />
        ))}

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: window.google ? new window.google.maps.Size(40, 40) : null
            }}
            title="Your Location"
          />
        )}

        {/* Search Location Marker */}
        {searchLocation && (
          <Marker
            position={searchLocation}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }}
            title="Search Location"
            onClick={() => setSelectedMarker(searchLocation)}
          />
        )}

        {/* Info Window for selected marker */}
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2">
              <h3 className="font-bold text-lg mb-1">{selectedMarker.location_name || 'Location'}</h3>
              <p className="text-sm mb-1">
                <strong>Risk Level:</strong> <span className={
                  selectedMarker.risk_level === 'High' ? 'text-red-600' :
                  selectedMarker.risk_level === 'Medium' ? 'text-yellow-600' :
                  'text-green-600'
                }>{selectedMarker.risk_level || 'Unknown'}</span>
              </p>
              <p className="text-sm mb-1">
                <strong>Risk Score:</strong> {selectedMarker.risk_score || 0}/100
              </p>
              {selectedMarker.rainfall_mm && (
                <p className="text-sm mb-1">
                  <strong>Rainfall:</strong> {selectedMarker.rainfall_mm}mm
                </p>
              )}
              {selectedMarker.description && (
                <p className="text-xs mt-2 text-gray-600">{selectedMarker.description}</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
