import { useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
  const token = localStorage.getItem('jwtToken');
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const decodedToken = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (err) {
      console.error('Invalid token', err);
      return null;
    }
  }, [token]);

  return {
    userId: userInfo?.UserID || decodedToken?.UserID || null,
    userRole: userInfo?.Role || decodedToken?.Role || '',
    roleID: userInfo?.roleID || decodedToken?.roleID || null,
    isSuperuser: userInfo?.Role === 'Superuser' || userInfo?.roleID === 2,
    token,
    userInfo
  };
};