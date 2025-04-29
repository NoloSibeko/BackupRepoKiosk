import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Grid, 
  Alert, 
  Link 
} from '@mui/material';

const Login = ({ toggleAuthMode }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    try {
      // Your login logic here
    } catch (err) {
      setError(err.toString());
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: 500,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
        Login
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              size="large"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              type="email"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              size="large"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              type="password"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{
                height: '56px',
                fontSize: '1.1rem',
                backgroundColor: '#4CAF50',
                '&:hover': { backgroundColor: '#45A049' },
              }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </Grid>
          <Grid item>
            <Typography variant="body1" align="center" sx={{ mt: 3 }}>
              Don't have an account?{' '}
              <Link 
                component="button" 
                type="button" 
                onClick={toggleAuthMode}
                sx={{ 
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#1976d2',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                  cursor: 'pointer'
                }}
              >
                Register here
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Login;