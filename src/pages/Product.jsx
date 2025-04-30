import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Product = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Products Page
        </Typography>
        {/* Add product-related content here */}
      </Box>
    </Container>
  );
};

export default Product;