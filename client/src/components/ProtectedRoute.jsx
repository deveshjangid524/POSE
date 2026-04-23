import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('ProtectedRoute - Token check:', !!token);
  console.log('ProtectedRoute - User check:', !!user);
  
  if (!token || !user) {
    console.log('ProtectedRoute - No token or user found, redirecting to /');
    return <Navigate to="/" replace />;
  }
  
  console.log('ProtectedRoute - Token and user found, rendering children');
  return children;
};

export default ProtectedRoute;
