import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const ProductModal = ({ open, onClose, onSubmit, initialData, categories }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    categoryId: '',
    image: null,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        quantity: initialData.quantity || '',
        categoryId: initialData.categoryId || '',
        image: null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Check if a product with the same name already exists
    const isDuplicate = categories.some(
      (existingProduct) =>
        existingProduct.name.toLowerCase() === form.name.toLowerCase() &&
        existingProduct.id !== initialData?.id // Allow editing the same product
    );
  
    if (isDuplicate) {
      alert('A product with this name already exists. Please use a different name.');
      return;
    }
  
    onSubmit(form);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" mb={2}>
          {initialData ? 'Edit Product' : 'Add Product'}
        </Typography>
        <TextField
          fullWidth
          name="name"
          label="Name"
          value={form.name}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          name="description"
          label="Description"
          value={form.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={2}
        />
        <TextField
          fullWidth
          name="price"
          label="Price"
          type="number"
          value={form.price}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          name="quantity"
          label="Quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          name="categoryId"
          label="Category"
          select
          value={form.categoryId}
          onChange={handleChange}
          margin="normal"
        >
         {categories.map((cat) => (
  <MenuItem key={cat.categoryID} value={cat.categoryID}>
    {cat.categoryName}
  </MenuItem>
))}
        </TextField>
        <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
          Upload Image
          <input hidden type="file" name="image" onChange={handleChange} />
        </Button>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default ProductModal;
