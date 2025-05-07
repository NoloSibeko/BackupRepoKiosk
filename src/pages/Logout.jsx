import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    
    localStorage.removeItem('authToken');

    navigate('/login');
  }, [navigate]);

  return null; 
};

export default Logout;