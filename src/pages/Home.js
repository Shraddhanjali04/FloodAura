import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Map, Bell, TrendingUp, Cpu, Shield, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay - Dark Cityscape */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/cityscape-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-city-overlay"></div>
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at center top, rgba(0, 217, 255, 0.08) 0%, transparent 60%)'
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-block mb-8">
            <span className="bg-flood-cyan/10 text-flood-cyan border border-flood-cyan/40 px-5 py-2.5 rounded-full text-sm font-medium shadow-cyan-glow backdrop-blur-sm">
              AI-Powered Urban Flood Forecasting
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-flood-cyan drop-shadow-[0_0_30px_rgba(0,217,255,0.5)]">Predict. Prepare.</span>
            <br />
            <span className="text-white">Prevent Floods.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Hyperlocal street-level flood risk forecasting powered by AI. Get real-time alerts and protect your community.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/live-map"
              className="bg-flood-cyan hover:bg-[#00BFFF] text-flood-navy px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-cyan-glow hover:shadow-blue-glow"
            >
              <span>View Live Forecast</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="bg-transparent border-2 border-gray-400 hover:bg-white/10 hover:border-white text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm">
              How It Works
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-flood-navy/60 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 hover:border-flood-cyan/50 transition-all duration-300">
              <Map className="w-10 h-10 text-flood-cyan mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">10,000+</div>
              <div className="text-gray-400 text-sm">Street Coverage</div>
            </div>
            <div className="bg-flood-navy/60 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 hover:border-flood-cyan/50 transition-all duration-300">
              <Bell className="w-10 h-10 text-flood-cyan mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-gray-400 text-sm">Active Alerts</div>
            </div>
            <div className="bg-flood-navy/60 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 hover:border-flood-cyan/50 transition-all duration-300">
              <TrendingUp className="w-10 h-10 text-flood-cyan mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">85%+</div>
              <div className="text-gray-400 text-sm">Prediction Accuracy</div>
            </div>
            <div className="bg-flood-navy/60 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 hover:border-flood-cyan/50 transition-all duration-300">
              <Zap className="w-10 h-10 text-flood-cyan mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">&lt;2min</div>
              <div className="text-gray-400 text-sm">Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-flood-darker">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Advanced Technology for <span className="text-flood-cyan drop-shadow-[0_0_20px_rgba(0,217,255,0.4)]">Climate Resilience</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Combining satellite data, machine learning, and real-time processing to deliver unprecedented flood prediction accuracy
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-flood-navy/40 border border-gray-800 rounded-2xl p-8 hover:border-flood-cyan transition-all duration-300 hover:transform hover:scale-105 hover:shadow-cyan-glow backdrop-blur-sm">
              <div className="bg-flood-cyan/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 border border-flood-cyan/30">
                <Cpu className="w-8 h-8 text-flood-cyan" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Predictions</h3>
              <p className="text-gray-400 leading-relaxed">
                Advanced machine learning models analyze weather patterns, topography, and real-time sensor data
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-flood-navy/40 border border-gray-800 rounded-2xl p-8 hover:border-flood-cyan transition-all duration-300 hover:transform hover:scale-105 hover:shadow-cyan-glow backdrop-blur-sm">
              <div className="bg-flood-cyan/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 border border-flood-cyan/30">
                <Map className="w-8 h-8 text-flood-cyan" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Hyperlocal Forecasting</h3>
              <p className="text-gray-400 leading-relaxed">
                Street-level predictions with 2-8 hour lead time for actionable early warnings
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-flood-navy/40 border border-gray-800 rounded-2xl p-8 hover:border-flood-cyan transition-all duration-300 hover:transform hover:scale-105 hover:shadow-cyan-glow backdrop-blur-sm">
              <div className="bg-flood-cyan/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 border border-flood-cyan/30">
                <Shield className="w-8 h-8 text-flood-cyan" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Real-Time Monitoring</h3>
              <p className="text-gray-400 leading-relaxed">
                Continuous data processing from satellite imagery, weather stations, and IoT sensors
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alert CTA Section */}
      <section className="py-20 bg-alert-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Stay Ahead of the Storm
          </h2>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto mb-10">
            Subscribe to alerts and get notified when flood risks are detected in your area
          </p>
          <Link
            to="/alerts"
            className="inline-flex items-center space-x-2 bg-flood-cyan hover:bg-[#00BFFF] text-flood-navy px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-cyan-glow"
          >
            <Bell className="w-5 h-5" />
            <span>Set Up Alerts</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
