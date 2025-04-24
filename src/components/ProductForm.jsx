import React, { useState } from 'react';
import { TextField, Button, Box, Grid } from '@mui/material';
import { addProduct } from '../api/product';

const ProductForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addProduct(form);
    onSuccess(); // Refresh product list
    setForm({ name: '', description: '', price: '', categoryId: '' });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}><TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required /></Grid>
        <Grid item xs={6}><TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth required /></Grid>
        <Grid item xs={6}><TextField label="Price" name="price" value={form.price} onChange={handleChange} type="number" fullWidth required /></Grid>
        <Grid item xs={6}><TextField label="Category ID" name="categoryId" value={form.categoryId} onChange={handleChange} fullWidth required /></Grid>
        <Grid item xs={12}><Button type="submit" variant="contained">Add Product</Button></Grid>
      </Grid>
    </Box>
  );
};

export default ProductForm;
