import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Grid, Paper, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

const Login = () => {
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
    setIsLoading(true);
  
    try {
      const response = await login({
        Email: formData.email,
        Password: formData.password
      });
  
      if (response && response.token) {
        localStorage.setItem('authToken', response.token);
        navigate('/dashboard'); // Redirect only if login is successful
      } else {
        setError('Invalid login response');
      }
    } catch (err) {
      setError(err.toString());
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Paper elevation={3} sx={{ width: '100%', p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Login to Kiosk System
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3} direction="column">
              <Grid item>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  type="email"
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  type="password"
                />
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading}
                  sx={{
                    backgroundColor: '#4CAF50',
                    '&:hover': { backgroundColor: '#45A049' }
                  }}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;