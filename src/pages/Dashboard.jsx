import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Container, Grid } from '@mui/material';
import ProductList from '../components/ProductList';
import { getProducts } from '../api/product';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh', // Ensures the dashboard fills the viewport height
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#f5f5f5', // Light background for better contrast
      }}
    >
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        {/* Welcome Section */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to the Dashboard!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This is your central hub for managing products, viewing analytics, and more.
          </Typography>
        </Paper>

        {/* Products Section */}
        <Paper elevation={3} sx={{ p: 4, flexGrow: 1 }}>
          <Typography variant="h5" gutterBottom>
            Available Products
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Browse and manage the products available in your kiosk system.
          </Typography>

          {loading ? (
            <Typography>Loading products...</Typography>
          ) : (
            <Grid container spacing={3}>
              <ProductList products={products} />
            </Grid>
          )}
        </Paper>
      </Container>

      {/* Footer Section */}
      <Box
        sx={{
          py: 2,
          textAlign: 'center',
          backgroundColor: '#1976d2',
          color: 'white',
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Kiosk System. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;