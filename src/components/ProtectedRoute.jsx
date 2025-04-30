import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, requireSuperuser = false }) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    
    if (requireSuperuser && !decoded.isSuperuser) {
      return <Navigate to="/dashboard" replace />;
    }
    
    return children;
  } catch (error) {
    localStorage.removeItem('authToken');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;