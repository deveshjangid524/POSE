import React from 'react'
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-slate-800 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
      <div className="text-white text-2xl font-bold">🌊 Oil Spill Event Prediction</div>
      <div className="flex gap-8">
        <Link 
          to="/" 
          className={`text-white no-underline transition-colors duration-300 hover:text-blue-400 ${
            isActive('/') ? 'text-blue-400 font-semibold' : ''
          }`}
        >
          Home
        </Link>
        <Link 
          to="/about" 
          className={`text-white no-underline transition-colors duration-300 hover:text-blue-400 ${
            isActive('/about') ? 'text-blue-400 font-semibold' : ''
          }`}
        >
          About
        </Link>
        <Link 
          to="/overview" 
          className={`text-white no-underline transition-colors duration-300 hover:text-blue-400 ${
            isActive('/overview') ? 'text-blue-400 font-semibold' : ''
          }`}
        >
          Overview
        </Link>
        <Link 
          to="/dashboard" 
          className={`text-white no-underline transition-colors duration-300 hover:text-blue-400 ${
            isActive('/dashboard') ? 'text-blue-400 font-semibold' : ''
          }`}
        >
          Dashboard
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
