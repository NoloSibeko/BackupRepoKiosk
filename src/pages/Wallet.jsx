import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Wallet = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Wallet
        </Typography>
        {/* Cart content will go here */}
      </Box>
    </Container>
  );
};

export default Wallet;