import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/home') {
      return location.pathname === '/home';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Trigger auth change event
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  return (
    <nav className="bg-slate-800 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
      <div className="text-white text-2xl font-bold">🌊 Oil Spill Event Prediction</div>
      <div className="flex gap-8 items-center">
        <Link 
          to="/home" 
          className={`text-white no-underline transition-colors duration-300 hover:text-blue-400 ${
            isActive('/home') ? 'text-blue-400 font-semibold' : ''
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
        <button
          onClick={handleLogout}
          className="text-white no-underline transition-colors duration-300 hover:text-red-400 bg-transparent border-none cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
