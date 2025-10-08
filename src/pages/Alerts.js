import React, { useState } from 'react';
import { Bell, Mail, Phone, MapPin, AlertTriangle, Check } from 'lucide-react';

const Alerts = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Alert subscription feature coming soon!');
  };

  const activeAlerts = [
    {
      id: 1,
      risk: 'High Risk',
      location: 'Downtown Manhattan',
      description: 'Flood risk on Broadway between 42nd and 50th St in 2 hours',
      depth: '1.5m',
      timeWindow: '2 hours',
      confidence: '85%',
      borderColor: 'border-l-orange-500',
      bgColor: 'bg-orange-500/5'
    },
    {
      id: 2,
      risk: 'Moderate Risk',
      location: 'Brooklyn Bridge Area',
      description: 'Moderate flooding expected near waterfront areas',
      depth: '0.8m',
      timeWindow: '4 hours',
      confidence: '72%',
      borderColor: 'border-l-yellow-500',
      bgColor: 'bg-yellow-500/5'
    },
    {
      id: 3,
      risk: 'Low Risk',
      location: 'Upper East Side',
      description: 'Minor street flooding possible during peak rainfall',
      depth: '0.3m',
      timeWindow: '6 hours',
      confidence: '60%',
      borderColor: 'border-l-green-500',
      bgColor: 'bg-green-500/5'
    }
  ];

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
              {activeAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`${alert.bgColor} ${alert.borderColor} border-l-4 bg-flood-navy/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-flood-cyan/30 transition-all duration-300`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-white" />
                      <h3 className="text-white font-bold text-lg">{alert.risk}</h3>
                      <span className="text-gray-400">• {alert.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{alert.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-gray-400">
                      Expected depth: <span className="text-white font-medium">{alert.depth}</span>
                    </span>
                    <span className="text-gray-400">
                      Time window: <span className="text-white font-medium">{alert.timeWindow}</span>
                    </span>
                    <span className="text-gray-400">
                      Confidence: <span className="text-white font-medium">{alert.confidence}</span>
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
              ))}
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
                    className="w-full bg-flood-cyan hover:bg-[#00BFFF] text-flood-navy px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-cyan-glow flex items-center justify-center space-x-2"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Subscribe to Alerts</span>
                  </button>
                </form>

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
