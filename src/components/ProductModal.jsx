import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';

const ProductModal = ({ open, onClose, onSubmit, product, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    categoryId: '',
    isAvailable: true,
    image: null,
    existingImageURL: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        quantity: product.quantity || '',
        categoryId: product.categoryId || '',
        isAvailable: product.isAvailable ?? true,
        image: null,
        existingImageURL: product.imageURL || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        quantity: '',
        categoryId: '',
        isAvailable: true,
        image: null,
        existingImageURL: '',
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
  };

const handleSubmit = () => {
  if (!formData.name || !formData.price || !formData.categoryId) {
    alert('Please fill in all required fields');
    return;
  }

  const data = new FormData();
  data.append('Name', formData.name);
  data.append('Description', formData.description);
  data.append('Price', formData.price);
  data.append('Quantity', formData.quantity);
  data.append('CategoryID', formData.categoryId);
  data.append('isAvailable', formData.isAvailable);
  
  if (formData.image) {
    data.append('Image', formData.image);
  }
  
  // Match backend's expected parameter name
  if (product?.id) {
    data.append('productID', product.id);
  }

  onSubmit(data);
};

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleInputChange}
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="normal"
          value={formData.description}
          onChange={handleInputChange}
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          fullWidth
          margin="normal"
          value={formData.price}
          onChange={handleInputChange}
        />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          fullWidth
          margin="normal"
          value={formData.quantity}
          onChange={handleInputChange}
        />
        <TextField
          select
          label="Category"
          name="categoryId"
          fullWidth
          margin="normal"
          value={formData.categoryId}
          onChange={handleInputChange}
        >
          {categories.map((category) => (
            <MenuItem key={category.categoryID} value={category.categoryID}>
              {category.categoryName}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="outlined" component="label" sx={{ mt: 2 }}>
          Upload Image
          <input type="file" hidden accept="image/*" onChange={handleImageChange} />
        </Button>

        <Box sx={{ mt: 2 }}>
          {formData.image ? (
            <Typography variant="body2">Selected File: {formData.image.name}</Typography>
          ) : formData.existingImageURL ? (
            <>
              <Typography variant="body2">Current Image:</Typography>
              <img src={formData.existingImageURL} alt="Product" height={80} />
            </>
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {product ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductModal;
