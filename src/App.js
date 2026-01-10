import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import Home from "./pages/Home";
import LiveMap from "./pages/LiveMap";
import Alerts from "./pages/Alerts";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import "./index.css";

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
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
