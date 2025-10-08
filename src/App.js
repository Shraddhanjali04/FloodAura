import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import LiveMap from './pages/LiveMap';
import Alerts from './pages/Alerts';
import About from './pages/About';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App bg-flood-darker min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live-map" element={<LiveMap />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
