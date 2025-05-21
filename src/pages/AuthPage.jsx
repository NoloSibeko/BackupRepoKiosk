import { useState } from 'react';

import { Box, Typography, styled } from '@mui/material';

import { motion, AnimatePresence } from 'framer-motion';

import Login from './Login';

import Register from './Register';

import { useNavigate } from 'react-router-dom';

import CoffeeImage from '../images/Coffee-Croissant.webp'; // Image for Login

import RegisterImage from '../images/high-angle-shot-coffee-beans-jars-breakfast-table-with-some-pastry_181624-5864.avif'; // Image for Register



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

  backgroundColor: '#f5f5dc',

  borderRadius: '16px',

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

  backgroundSize: 'cover',

  backgroundPosition: 'center',

});



const Overlay = styled(Box)({

  position: 'absolute',

  top: 0,

  left: 0,

  width: '100%',

  height: '100%',

  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay to reduce brightness

  zIndex: 1,

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

            <GraphicContainer style={{ backgroundImage: `url(${CoffeeImage})` }}>

              <Overlay />

              <motion.div

                initial={{ opacity: 0, y: 20 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ delay: 0.2 }}

                style={{ zIndex: 2 }}

              >

                <Typography variant="h2" gutterBottom fontWeight="bold">

                  Welcome Back!

                </Typography>

                <Typography variant="h5">

                  Get back to enjoying your favourite treats.

                </Typography>

              </motion.div>

            </GraphicContainer>

          </>

        ) : (

          <>

            <GraphicContainer

              style={{ backgroundImage: `url(${RegisterImage})` }}

            >

              <Overlay />

              <motion.div

                initial={{ opacity: 0, y: 20 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ delay: 0.2 }}

                style={{ zIndex: 2 }}

              >

                <Typography variant="h2" gutterBottom fontWeight="bold">

                  Join Us!

                </Typography>

                <Typography variant="h5">

                  Create your account to start enjoying what our kiosk has.

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
