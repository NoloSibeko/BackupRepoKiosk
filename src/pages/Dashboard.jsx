import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import ProductList from '../components/ProductList'; // Adjust path if necessary

const Dashboard = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 4 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to the Dashboard!
          </Typography>
          <Typography variant="body1">
            This is your central hub for all activity in the kiosk system.
          </Typography>
        </Paper>

        {/* Product Management Section */}
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Product Management
          </Typography>
          <ProductList />
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
