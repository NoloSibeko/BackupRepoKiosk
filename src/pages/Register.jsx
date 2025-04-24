import React, { useState } from 'react';
import { Box, Button, Paper, TextField, Typography, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    surname: '',  // Changed from 'current'
    email: '',
    contactNumber: '',  // Changed from 'contactName'
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        Surname: form.surname,  // Changed from 'current'
        Email: form.email,
        ContactNumber: form.contactNumber,  // Changed from 'contactName'
        Password: form.password,
        AccountStatus: 'Active'  // Added default value
      });
      
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
      
      // Debugging - log the full response
      console.log('Registration response:', response);
    } catch (err) {
      setError(err.toString());
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f0f4f0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Create Your Account
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Registration successful! Redirecting to login...</Alert>}

        <TextField
          name="name"
          label="Name"
          variant="outlined"
          fullWidth
          value={form.name}
          onChange={handleChange}
          required
        />
        <TextField
          name="surname"  // Changed from 'current'
          label="Surname"
          variant="outlined"
          fullWidth
          value={form.surname}
          onChange={handleChange}
          required
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
        />
        <TextField
          name="contactNumber"
          label="Contact Number"
          variant="outlined"
          fullWidth
          value={form.contactNumber}
          onChange={handleChange}
          required
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
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 2 }}
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          Already have an account?{' '}
          <Link href="/login" underline="hover" color="secondary">
            Login here
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}