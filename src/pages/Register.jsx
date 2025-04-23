// src/pages/Register.jsx
import React, { useState } from 'react';
import { Box, Button, Paper, TextField, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    contactNumber: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You'd replace this with actual API logic
    console.log('Registering:', form);
    navigate('/login'); // After registration, go to login
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

        <TextField
          name="name"
          label="Name"
          variant="outlined"
          fullWidth
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          name="surname"
          label="Surname"
          variant="outlined"
          fullWidth
          value={form.surname}
          onChange={handleChange}
        />
        <TextField
          name="email"
          label="Email"
          variant="outlined"
          fullWidth
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          name="contactNumber"
          label="Contact Number"
          variant="outlined"
          fullWidth
          value={form.contactNumber}
          onChange={handleChange}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={form.password}
          onChange={handleChange}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Register
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
