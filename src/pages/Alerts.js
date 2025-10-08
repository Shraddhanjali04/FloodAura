import React, { useState } from 'react';
import { Bell, Mail, MapPin } from 'lucide-react';

const Alerts = () => {
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Alert subscription feature coming soon!');
  };

  return (
    <div className="min-h-screen py-20 bg-flood-darker">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-flood-cyan/10 rounded-2xl mb-6 border border-flood-cyan/30 shadow-cyan-glow">
            <Bell className="w-10 h-10 text-flood-cyan" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Flood Alert <span className="text-flood-cyan">Notifications</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get instant notifications when flood risks are detected in your area
          </p>
        </div>

        {/* Alert Setup Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-flood-navy/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Set Up Your Alerts</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-flood-darker border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-flood-cyan focus:ring-2 focus:ring-flood-cyan/50 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your city or street address"
                  className="w-full bg-flood-darker border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-flood-cyan focus:ring-2 focus:ring-flood-cyan/50 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-flood-cyan hover:bg-[#00BFFF] text-flood-navy px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-cyan-glow"
              >
                Subscribe to Alerts
              </button>
            </form>
          </div>

          {/* Alert Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-flood-navy/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center hover:border-flood-cyan/50 transition-all duration-300">
              <div className="text-3xl mb-2">⚠️</div>
              <h3 className="text-white font-semibold mb-2">Early Warning</h3>
              <p className="text-gray-400 text-sm">2-8 hour advance notice</p>
            </div>
            <div className="bg-flood-navy/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center hover:border-flood-cyan/50 transition-all duration-300">
              <div className="text-3xl mb-2">🚨</div>
              <h3 className="text-white font-semibold mb-2">Immediate Alert</h3>
              <p className="text-gray-400 text-sm">Real-time notifications</p>
            </div>
            <div className="bg-flood-navy/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center hover:border-flood-cyan/50 transition-all duration-300">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="text-white font-semibold mb-2">All Clear</h3>
              <p className="text-gray-400 text-sm">Safety confirmations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
