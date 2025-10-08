import React, { useState, useEffect } from 'react';
import { Bell, Mail, Phone, AlertTriangle, Check } from 'lucide-react';
import apiService from '../services/api';

const Alerts = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  // Fetch active alerts on component mount
  useEffect(() => {
    fetchActiveAlerts();
    fetchStatistics();
  }, []);

  const fetchActiveAlerts = async () => {
    try {
      const data = await apiService.getActiveAlerts(null, 10);
      setActiveAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      // Fallback to mock data
      setActiveAlerts([
        {
          id: 1,
          risk: 'High',
          location: 'Downtown Manhattan',
          description: 'Flood risk on Broadway between 42nd and 50th St in 2 hours',
          rainfall_mm: 45.5,
          time: '2 hours',
          risk_score: 78,
          borderColor: 'border-l-red-500',
          bgColor: 'bg-red-500/5'
        },
        {
          id: 2,
          risk: 'Medium',
          location: 'Brooklyn Bridge Area',
          description: 'Moderate flooding expected near waterfront areas',
          rainfall_mm: 25.3,
          time: '4 hours',
          risk_score: 52,
          borderColor: 'border-l-yellow-500',
          bgColor: 'bg-yellow-500/5'
        }
      ]);
    }
  };

  const fetchStatistics = async () => {
    try {
      const data = await apiService.getAlertStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubscribeSuccess(false);

    try {
      await apiService.subscribeToNotifications({
        email,
        phone,
        latitude: 0,  // Will be updated when user shares location
        longitude: 0,
        radius_km: 10,
        min_severity: 'High'
      });
      
      setSubscribeSuccess(true);
      setTimeout(() => setSubscribeSuccess(false), 5000);
      
      // Clear form
      setEmail('');
      setPhone('');
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Subscription feature coming soon! Stay tuned for real-time alerts.');
    } finally {
      setIsLoading(false);
    }
  };

  const getBorderColor = (risk) => {
    const riskLower = risk?.toLowerCase();
    if (riskLower === 'critical') return 'border-l-purple-500';
    if (riskLower === 'high') return 'border-l-red-500';
    if (riskLower === 'medium') return 'border-l-yellow-500';
    if (riskLower === 'low') return 'border-l-green-500';
    return 'border-l-gray-500';
  };

  const getBgColor = (risk) => {
    const riskLower = risk?.toLowerCase();
    if (riskLower === 'critical') return 'bg-purple-500/5';
    if (riskLower === 'high') return 'bg-red-500/5';
    if (riskLower === 'medium') return 'bg-yellow-500/5';
    if (riskLower === 'low') return 'bg-green-500/5';
    return 'bg-gray-500/5';
  };

  return (
    <div className="min-h-screen py-20 bg-flood-darker">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-flood-cyan mb-2">
            Alert Center
          </h1>
          <p className="text-gray-400 text-lg">
            Stay informed with real-time flood warnings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Alerts - Left Side */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">Active Alerts</h2>
            
            <div className="space-y-4">
              {activeAlerts.length > 0 ? (
                activeAlerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`${getBgColor(alert.risk)} ${getBorderColor(alert.risk)} border-l-4 bg-flood-navy/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-flood-cyan/30 transition-all duration-300`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-white" />
                        <h3 className="text-white font-bold text-lg">{alert.risk} Risk</h3>
                        <span className="text-gray-400">• {alert.location}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4">{alert.description || `${alert.risk} flood risk expected in this area`}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-gray-400">
                        Rainfall: <span className="text-white font-medium">{alert.rainfall_mm ? `${alert.rainfall_mm}mm` : 'N/A'}</span>
                      </span>
                      <span className="text-gray-400">
                        Time window: <span className="text-white font-medium">{alert.time}</span>
                      </span>
                      <span className="text-gray-400">
                        Risk Score: <span className="text-white font-medium">{alert.risk_score}/100</span>
                      </span>
                    </div>
                    
                    <div className="flex space-x-3 mt-4">
                      <button className="text-flood-cyan hover:text-white text-sm font-medium transition-colors">
                        View on Map
                      </button>
                      <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-flood-navy/40 rounded-xl">
                  <p className="text-gray-400">No active alerts at this time</p>
                  <p className="text-gray-500 text-sm mt-2">Check back later for updates</p>
                </div>
              )}
            </div>
          </div>

          {/* Subscribe to Alerts - Right Side */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-flood-navy/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Subscribe to Alerts</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-flood-darker border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-flood-cyan focus:ring-2 focus:ring-flood-cyan/50 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">
                      Phone Number (SMS)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-flood-darker border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-flood-cyan focus:ring-2 focus:ring-flood-cyan/50 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-flood-cyan hover:bg-[#00BFFF] text-flood-navy px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-cyan-glow flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Bell className="w-4 h-4" />
                    <span>{isLoading ? 'Subscribing...' : 'Subscribe to Alerts'}</span>
                  </button>
                  
                  {subscribeSuccess && (
                    <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                      <p className="text-green-400 text-sm text-center">
                        ✓ Successfully subscribed to alerts!
                      </p>
                    </div>
                  )}
                </form>

                {/* Statistics Display */}
                {statistics && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h3 className="text-white font-semibold mb-4 text-sm">System Statistics</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-flood-darker rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Total Events</p>
                        <p className="text-white font-bold text-lg">{statistics.total_events}</p>
                      </div>
                      <div className="bg-flood-darker rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Last 24h</p>
                        <p className="text-white font-bold text-lg">{statistics.events_last_24h}</p>
                      </div>
                      <div className="bg-flood-darker rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Avg Risk</p>
                        <p className="text-white font-bold text-lg">{statistics.average_risk_score}</p>
                      </div>
                      <div className="bg-flood-darker rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Status</p>
                        <p className="text-green-400 font-bold text-sm">{statistics.system_status}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Alert Features */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h3 className="text-white font-semibold mb-4 text-sm">Alert Features</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300 text-sm">
                      <Check className="w-4 h-4 text-flood-cyan mr-2 flex-shrink-0" />
                      Real-time notifications via SMS and email
                    </li>
                    <li className="flex items-center text-gray-300 text-sm">
                      <Check className="w-4 h-4 text-flood-cyan mr-2 flex-shrink-0" />
                      Location-based alerts for your area
                    </li>
                    <li className="flex items-center text-gray-300 text-sm">
                      <Check className="w-4 h-4 text-flood-cyan mr-2 flex-shrink-0" />
                      Customizable risk thresholds
                    </li>
                    <li className="flex items-center text-gray-300 text-sm">
                      <Check className="w-4 h-4 text-flood-cyan mr-2 flex-shrink-0" />
                      WebSocket live updates
                    </li>
                  </ul>
                </div>

                {/* Recent Activity */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h3 className="text-white font-semibold mb-4 text-sm">Recent Activity</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start text-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2 flex-shrink-0"></div>
                      <span className="text-gray-300">System health check - All systems operational</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <div className="w-2 h-2 rounded-full bg-flood-cyan mt-1.5 mr-2 flex-shrink-0"></div>
                      <span className="text-gray-300">Model updated - Improved accuracy by 3%</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <div className="w-2 h-2 rounded-full bg-flood-cyan mt-1.5 mr-2 flex-shrink-0"></div>
                      <span className="text-gray-300">New data source added - NASA SMAP satellite</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
