import React, { useState } from 'react';

import {

  Box,

  TextField,

  Button,

  Typography,

  Alert,

  Link,

  CircularProgress,

} from '@mui/material';

import { useNavigate } from 'react-router-dom';

import { handleLogin } from '../api/auth';

import SingularImage from '../images/SingularSocialSharingImage.png';



const Login = ({ toggleAuthMode }) => {

  const [formData, setFormData] = useState({ email: '', password: '' });

  const [error, setError] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();



  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

  };



  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');



    if (!formData.email || !formData.password) {

      setError('Please fill in all fields');

      return;

    }



    setIsLoading(true);



    try {

      const response = await handleLogin({

        email: formData.email,

        password: formData.password,

      });



      if (response?.token) {

        localStorage.setItem('authToken', response.token);

        navigate('/dashboard');

      } else {

        setError('Invalid response from server');

      }

    } catch (err) {

      console.error('Login failed:', err);

      setError(err.response?.data?.message || err.message || 'Login failed');

    } finally {

      setIsLoading(false);

    }

  };



  return (

    <Box

      sx={{

        display: 'flex',

        flexDirection: 'column',

        justifyContent: 'center',

        alignItems: 'center',

        minHeight: '100vh',

        backgroundColor: '#f5f5dc', // Very light brown (beige)

        padding: '16px',

      }}

    >

      {/* Singular Image at the top */}

      <img

        src={SingularImage}

        alt="Singular Kiosk"

        style={{

          width: '100%',

          maxWidth: '200px',

          marginBottom: '16px',

          display: 'block',

          marginLeft: 'auto',

          marginRight: 'auto',

          borderRadius: '8px',

        }}

      />



      <Box

        sx={{

          width: '100%',

          maxWidth: 400,

          textAlign: 'center',

          backgroundColor: '#f5f5dc', // Change the box to beige

          padding: '24px',

          borderRadius: '12px',

          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',

        }}

      >

        

        {error && <Alert severity="error">{error}</Alert>}



        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>

          <TextField

            name="email"

            label="Email"

            variant="outlined"

            fullWidth

            value={formData.email}

            onChange={handleChange}

            required

            sx={{

              mb: 2,

              '& .MuiOutlinedInput-root': {

                borderRadius: '24px',

                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {

                  borderColor: '#8B4513',

                },

              },
              backgroundColor: '#f5f5dc', // Beige background

              '& .MuiInputLabel-root.Mui-focused': {

                color: '#000000',

              },

            }}

          />

          <TextField

            name="password"

            label="Password"

            type="password"

            variant="outlined"

            fullWidth

            value={formData.password}

            onChange={handleChange}

            required

            sx={{

              mb: 3,

              '& .MuiOutlinedInput-root': {

                borderRadius: '24px',

                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {

                  borderColor: '#8B4513',

                },

              },
              backgroundColor: '#f5f5dc', // Beige background

              '& .MuiInputLabel-root.Mui-focused': {

                color: '#000000',

              },

            }}

          />



          <Button

            variant="contained"

            fullWidth

            type="submit"

            disabled={isLoading}

            sx={{

              height: '48px',

              borderRadius: '24px',

              backgroundColor: '#8B4513',

              '&:hover': {

                backgroundColor: '#6A2E0F',

              },

            }}

          >

            {isLoading ? <CircularProgress size={24} /> : 'Login'}

          </Button>



          <Typography variant="body2" align="center" sx={{ mt: 2, color: '#000000' }}>

            Don't have an account?{' '}

            <Link

              component="button"

              type="button"

              onClick={toggleAuthMode}

              sx={{

                textDecoration: 'none',

                color: '#8B4513',

                cursor: 'pointer',

              }}

            >

              Register here

            </Link>

          </Typography>

        </Box>

      </Box>

    </Box>

  );

};



export default Login;