import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import ProductList from '../components/ProductList';

const Dashboard = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container
        maxWidth="xl" // Can be "false" if you want full-width without MUI breakpoints
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to the Dashboard!
          </Typography>
          <Typography variant="body1">
            This is your central hub for all activity in the kiosk system.
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Available Products
          </Typography>
          <ProductList />
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;
