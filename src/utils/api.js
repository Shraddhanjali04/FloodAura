// API utility functions for backend communication

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Generic fetch wrapper with error handling
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Alert API endpoints
export const alertsAPI = {
  // Get all active alerts
  getActive: () => fetchAPI('/alerts/active'),
  
  // Get alerts by location
  getByLocation: (lat, lng) => fetchAPI(`/alerts/location?lat=${lat}&lng=${lng}`),
  
  // Subscribe to alerts
  subscribe: (data) => fetchAPI('/alerts/subscribe', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Get alert history
  getHistory: (limit = 10) => fetchAPI(`/alerts/history?limit=${limit}`),
};

// Map API endpoints
export const mapAPI = {
  // Search location
  searchLocation: (query) => fetchAPI(`/map/search?location=${encodeURIComponent(query)}`),
  
  // Get flood risk data for bounds
  getRiskData: (bounds) => fetchAPI('/map/risk-data', {
    method: 'POST',
    body: JSON.stringify(bounds),
  }),
  
  // Get user location data
  locateUser: (lat, lng) => fetchAPI('/map/locate', {
    method: 'POST',
    body: JSON.stringify({ lat, lng }),
  }),
  
  // Get last update timestamp
  getLastUpdate: () => fetchAPI('/map/last-update'),
};

// Analytics API endpoints
export const analyticsAPI = {
  // Get prediction accuracy stats
  getAccuracy: () => fetchAPI('/analytics/accuracy'),
  
  // Get coverage statistics
  getCoverage: () => fetchAPI('/analytics/coverage'),
  
  // Get historical trends
  getTrends: (days = 30) => fetchAPI(`/analytics/trends?days=${days}`),
};

// WebSocket connection for real-time updates
export const createWebSocketConnection = (onMessage) => {
  const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws';
  const ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log('WebSocket connected');
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
    // Implement reconnection logic here if needed
  };

  return ws;
};

export default {
  alertsAPI,
  mapAPI,
  analyticsAPI,
  createWebSocketConnection,
};
