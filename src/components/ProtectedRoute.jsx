import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, requireSuperuser = false }) => {
  const token = localStorage.getItem('jwtToken');
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const isSuperuser = userInfo.Role === 'Superuser' || userInfo.roleID === 2;
    
    if (requireSuperuser && !isSuperuser) {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  } catch (error) {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userInfo');
    return <Navigate to="/login" replace />;
  }
};