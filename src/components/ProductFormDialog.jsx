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

const ProductFormDialog = ({ open, onClose, onSubmit, product, categories }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    quantity: product?.quantity || '',
    categoryId: product?.categoryId || '',
    image: null, // No image at first
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        quantity: product.quantity || '',
        categoryId: product.categoryId || '',
        image: null,
        existingImageURL: product.imageURL || '',
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
    const dataToSubmit = {
      ...formData,
      productID: product?.productID || null, 
    };
    onSubmit(formData);
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
        <Button
          variant="outlined"
          component="label"
          sx={{ mt: 2 }}
        >
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
        {formData.image && (
          <Box sx={{ mt: 2 }}>
           {formData.image ? (
  <Typography variant="body2">Selected File: {formData.image.name}</Typography>
) : formData.existingImageURL ? (
  <Box mt={2}>
    <Typography variant="body2">Current Image:</Typography>
    <img src={formData.existingImageURL} alt="Product" height={80} />
  </Box>
) : null}

          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {product ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductFormDialog;