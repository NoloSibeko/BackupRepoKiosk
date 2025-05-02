import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Cart = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Shopping Cart
        </Typography>
        {/* Cart content will go here */}
      </Box>
    </Container>
    
  );
};

export default Cart;