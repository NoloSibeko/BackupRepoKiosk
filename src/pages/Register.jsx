import React, { useState } from 'react';

import { 

  Box, 

  TextField, 

  Button, 

  Typography, 

  Alert, 

  Link,

  CircularProgress

} from '@mui/material';

import { useNavigate } from 'react-router-dom';

import { register } from '../api/auth';

import SingularImage from '../images/SingularSocialSharingImage.png'; // Import the Singular image



const Register = ({ toggleAuthMode }) => {

  const [form, setForm] = useState({

    name: '',

    surname: '',

    email: '',

    contactNumber: '',

    password: '',

  });

  const [error, setError] = useState('');

  const [success, setSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();



  const handleChange = (e) => {

    setForm({ ...form, [e.target.name]: e.target.value });

  };



  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');

    setIsLoading(true);



    try {

      const response = await register({

        Name: form.name,

        Surname: form.surname,

        Email: form.email,

        ContactNumber: form.contactNumber,

        Password: form.password,

        AccountStatus: 'Active',

      });



      setSuccess(true);

      setTimeout(() => navigate('/dashboard'), 2000);

    } catch (err) {

      setError(err.toString());

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

        minHeight: '100vh', // Fill the entire height of the page

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

        {success && <Alert severity="success">Registration successful! Redirecting...</Alert>}



        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>

          <TextField

            name="name"

            label="Name"

            variant="outlined"

            fullWidth

            value={form.name}

            onChange={handleChange}

            required

            sx={{

              mb: 2,

              '& .MuiOutlinedInput-root': {

                borderRadius: '24px', // Match the button's rounded style

                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {

                  borderColor: '#8B4513', // Brown border on focus

                },

              },

              backgroundColor: '#f5f5dc', // Beige background

              '& .MuiInputLabel-root.Mui-focused': {

                color: '#000000', // Black label on focus

              },

            }}

          />

          <TextField

            name="surname"

            label="Surname"

            variant="outlined"

            fullWidth

            value={form.surname}

            onChange={handleChange}

            required

            sx={{

              mb: 2,

              '& .MuiOutlinedInput-root': {

                borderRadius: '24px', // Match the button's rounded style

                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {

                  borderColor: '#8B4513', // Brown border on focus

                },

              },

              backgroundColor: '#f5f5dc', // Beige background

              '& .MuiInputLabel-root.Mui-focused': {

                color: '#000000', // Black label on focus

              },

            }}

          />

          <TextField

            name="email"

            label="Email"

            variant="outlined"

            fullWidth

            value={form.email}

            onChange={handleChange}

            required

            type="email"

            sx={{

              mb: 2,

              '& .MuiOutlinedInput-root': {

                borderRadius: '24px', // Match the button's rounded style

                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {

                  borderColor: '#8B4513', // Brown border on focus

                },

              },

              backgroundColor: '#f5f5dc', // Beige background

              '& .MuiInputLabel-root.Mui-focused': {

                color: '#000000', // Black label on focus

              },

            }}

          />

          <TextField

            name="contactNumber"

            label="Contact Number"

            variant="outlined"

            fullWidth

            value={form.contactNumber}

            onChange={handleChange}

            required

            sx={{

              mb: 2,

              '& .MuiOutlinedInput-root': {

                borderRadius: '24px', // Match the button's rounded style

                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {

                  borderColor: '#8B4513', // Brown border on focus

                },

              },

              backgroundColor: '#f5f5dc', // Change the box to beige

              '& .MuiInputLabel-root.Mui-focused': {

                color: '#000000', // Black label on focus

              },

            }}

          />

          <TextField

            name="password"

            label="Password"

            type="password"

            variant="outlined"

            fullWidth

            value={form.password}

            onChange={handleChange}

            required

            inputProps={{ minLength: 6 }}

            sx={{

              mb: 3,

              '& .MuiOutlinedInput-root': {

                borderRadius: '24px', // Match the button's rounded style

                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {

                  borderColor: '#8B4513', // Brown border on focus

                },

              },

              backgroundColor: '#f5f5dc', // Beige background

              '& .MuiInputLabel-root.Mui-focused': {

                color: '#000000', // Black label on focus

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

              backgroundColor: '#8B4513', // Darker brown color

              '&:hover': {

                backgroundColor: '#6A2E0F', // Slightly darker on hover

              },

            }}

          >

            {isLoading ? <CircularProgress size={24} /> : 'Register'}

          </Button>



          <Typography variant="body2" align="center" sx={{ mt: 2, color: '#000000' }}>

            Already have an account?{' '}

            <Link 

              component="button" 

              type="button"

              onClick={toggleAuthMode}

              sx={{ 

                textDecoration: 'none',

                color: '#8B4513', // Dark brown color for the link

                cursor: 'pointer',

              }}

            >

              Login here

            </Link>

          </Typography>

        </Box>

      </Box>

    </Box>

  );

};



export default Register;