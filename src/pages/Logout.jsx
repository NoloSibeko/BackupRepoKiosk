import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any authentication tokens or session data
    localStorage.removeItem('authToken');

    // Redirect to the login page
    navigate('/login');
  }, [navigate]);

  return null; // No UI is needed for this page
};

export default Logout;