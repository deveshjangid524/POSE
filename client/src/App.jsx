import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Overview from './components/Overview';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import TestConnection from './components/TestConnection';
import './index.css';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      console.log('App checkAuth - Token:', !!token);
      console.log('App checkAuth - User:', !!user);
      console.log('App checkAuth - Full localStorage:', {
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user')
      });
      
      if (token && user) {
        setIsAuthenticated(true);
        console.log('App - Setting isAuthenticated to true');
      } else {
        setIsAuthenticated(false);
        console.log('App - Setting isAuthenticated to false');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    };

    // Check auth on mount
    console.log('App - Mounting, checking auth...');
    checkAuth();

    // Listen for storage changes (for logout from other tabs)
    const handleStorageChange = () => {
      console.log('App - Storage changed, checking auth...');
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom auth events
    const handleAuthChange = () => {
      console.log('App - Auth change event triggered, checking auth...');
      checkAuth();
    };

    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <><Navbar /><Login /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={isAuthenticated ? <><Navbar /><Home /></> : <Navigate to="/login" />} />
        <Route path="/about" element={isAuthenticated ? <><Navbar /><About /></> : <Navigate to="/login" />} />
        <Route path="/overview" element={isAuthenticated ? <><Navbar /><Overview /></> : <Navigate to="/login" />} />
        <Route path="/dashboard/*" element={isAuthenticated ? <><Navbar /><Dashboard /></> : <Navigate to="/login" />} />
        <Route path="/test" element={isAuthenticated ? <><Navbar /><TestConnection /></> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;