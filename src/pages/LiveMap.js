import React from 'react';
import { MapPin } from 'lucide-react';

const LiveMap = () => {
  return (
    <div className="min-h-screen py-20 bg-flood-darker">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-flood-cyan/10 rounded-2xl mb-6 border border-flood-cyan/30 shadow-cyan-glow">
            <MapPin className="w-10 h-10 text-flood-cyan" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Live Flood <span className="text-flood-cyan">Risk Map</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Real-time hyperlocal flood forecasting and risk assessment
          </p>
        </div>

        {/* Placeholder for map */}
        <div className="bg-flood-navy/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 min-h-[600px] flex items-center justify-center hover:border-flood-cyan/30 transition-all duration-300">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-flood-cyan mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">Interactive Map Coming Soon</h3>
            <p className="text-gray-400">
              Live flood risk visualization and street-level predictions will be displayed here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
