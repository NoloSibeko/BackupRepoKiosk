import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

const Register = ({ toggleAuthMode }) => {
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    contactNumber: '',
    password: ''
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
        AccountStatus: 'Active'
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
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Register
      </Typography>
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
          sx={{ mb: 2 }}
        />
        <TextField
          name="surname"
          label="Surname"
          variant="outlined"
          fullWidth
          value={form.surname}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
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
          sx={{ mb: 2 }}
        />
        <TextField
          name="contactNumber"
          label="Contact Number"
          variant="outlined"
          fullWidth
          value={form.contactNumber}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
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
          sx={{ mb: 3 }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{ height: '48px' }}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Link 
            component="button" 
            type="button" 
            onClick={toggleAuthMode}
            sx={{ 
              color: '#4CAF50',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
              cursor: 'pointer'
            }}
          >
            Login here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;