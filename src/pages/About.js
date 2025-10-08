import React from 'react';
import { Database, Cpu, Zap, Bell } from 'lucide-react';

const About = () => {
  const aiPipeline = [
    {
      icon: Database,
      title: 'Data Collection',
      description: 'Real-time data from NOAA, NASA SMAP, OpenWeatherMap, and local sensors'
    },
    {
      icon: Cpu,
      title: 'AI Processing',
      description: 'Deep learning models (TensorFlow, PyTorch) analyze patterns and predict risks'
    },
    {
      icon: Zap,
      title: 'Real-time Pipeline',
      description: 'Apache Kafka and Spark process data streams with minimal latency'
    },
    {
      icon: Bell,
      title: 'Alert Distribution',
      description: 'Instant notifications via SMS, email, and WebSocket connections'
    }
  ];

  const keyFeatures = [
    {
      title: 'Street-Level Precision',
      description: 'Hyperlocal forecasts down to individual streets and neighborhoods'
    },
    {
      title: '2-8 Hour Lead Time',
      description: 'Advanced warning system gives communities time to prepare and evacuate'
    },
    {
      title: '85%+ Accuracy',
      description: 'Machine learning models continuously improve prediction accuracy'
    },
    {
      title: 'Multi-Source Data',
      description: 'Combines satellite imagery, weather stations, and IoT sensors'
    }
  ];

  return (
    <div className="min-h-screen py-20 bg-flood-darker">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-flood-cyan mb-4">
            How FloodWatch Works
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            AI-powered hyperlocal flood prediction combining satellite data, machine learning, and real-time processing to save lives and protect communities.
          </p>
        </div>

        {/* AI Pipeline Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">AI Pipeline</h2>
            <p className="text-gray-400 text-lg">
              Our sophisticated data processing pipeline transforms raw data into actionable insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {aiPipeline.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="bg-flood-navy/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-flood-cyan/50 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="bg-flood-cyan/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 border border-flood-cyan/30">
                    <Icon className="w-7 h-7 text-flood-cyan" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>

          {/* Cyan Wave Visualization Image */}
          <div className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
            <img 
              src="/ai-wave.jpg"
              alt="AI Data Visualization"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-flood-darker via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Key Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Key Features</h2>
            <p className="text-gray-400 text-lg">
              Advanced technology delivering unprecedented flood prediction capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {keyFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-flood-navy/40 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-flood-cyan/50 transition-all duration-300"
              >
                <h3 className="text-white font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Join the Movement Section */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-flood-navy/60 to-flood-cyan/20 border border-gray-800 p-12 text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join the Movement
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
              Help us build a safer, more resilient future for urban communities worldwide
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-flood-cyan hover:bg-[#00BFFF] text-flood-navy px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-cyan-glow">
                Get in Touch
              </button>
              <a 
                href="https://github.com/arnab-maity007/ecocode" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-transparent border-2 border-flood-cyan hover:bg-flood-cyan/10 text-flood-cyan px-8 py-4 rounded-lg font-semibold transition-all duration-300"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
