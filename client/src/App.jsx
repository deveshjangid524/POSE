import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react'

import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Overview from './components/Overview';
import Dashboard from './components/Dashboard';
import TestConnection from './components/TestConnection';
import './index.css';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/test" element={<TestConnection />} />
      </Routes>
    </Router>
  );
}

export default App;