import React, { useState } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import ProductList from './ProductList';
import ProductForm from './ProductForm';

const ProductCRUD = () => {
  const [editingProduct, setEditingProduct] = useState(null);

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleClearForm = () => {
    setEditingProduct(null);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Products
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <ProductForm productToEdit={editingProduct} clearForm={handleClearForm} />
      </Paper>

      <Divider sx={{ my: 2 }} />

      <Paper elevation={3} sx={{ p: 3 }}>
        <ProductList onEdit={handleEdit} />
      </Paper>
    </Box>
  );
};

export default ProductCRUD;
