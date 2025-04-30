import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
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

        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Available Products
          </Typography>

          {loading ? (
            <Typography>Loading products...</Typography>
          ) : (
            <ProductList products={products} />
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;