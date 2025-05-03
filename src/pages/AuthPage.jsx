import { useState } from 'react';
import { Box, Typography, styled } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './Login';
import Register from './Register';
import { useNavigate } from 'react-router-dom';

const AuthContainer = styled(Box)({
  display: 'flex',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
});

const FormContainer = styled(motion.div)({
  width: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  position: 'relative',
  zIndex: 2,
  backgroundColor: '#ffffff',
});

const GraphicContainer = styled(Box)({
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  padding: '2rem',
  position: 'relative',
  overflow: 'hidden',
});

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(window.location.pathname === '/login');

  const toggleAuthMode = () => {
    const newIsLogin = !isLogin;
    setIsLogin(newIsLogin);
    navigate(newIsLogin ? '/login' : '/register');
  };

  return (
    <AuthContainer>
      <AnimatePresence mode="wait">
        {isLogin ? (
          <>
            <FormContainer
              key="login-form"
              initial={{ x: 0 }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Login toggleAuthMode={toggleAuthMode} />
            </FormContainer>
            <GraphicContainer
              sx={{
                background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Typography variant="h2" gutterBottom fontWeight="bold">
                  Welcome Back!
                </Typography>
                <Typography variant="h5">
                  Login to access your kiosk management dashboard.
                </Typography>
              </motion.div>
            </GraphicContainer>
          </>
        ) : (
          <>
            <GraphicContainer
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Typography variant="h2" gutterBottom fontWeight="bold">
                  Join Us!
                </Typography>
                <Typography variant="h5">
                  Create your account to start managing your kiosk system.
                </Typography>
              </motion.div>
            </GraphicContainer>
            <FormContainer
              key="register-form"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Register toggleAuthMode={toggleAuthMode} />
            </FormContainer>
          </>
        )}
      </AnimatePresence>
    </AuthContainer>
  );
};

export default AuthPage;