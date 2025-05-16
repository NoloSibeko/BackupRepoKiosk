import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { updateProduct } from '../api/product'; // Adjust the import path as necessary

const EditProductFormDialog = ({ open, onClose, product, categories, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    price: '',
    categoryID: '',
    imageURL: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        quantity: product.quantity || '',
        price: product.price || '',
        categoryID: product.categoryID || '',
        imageURL: product.imageURL || '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.quantity || !formData.categoryID) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await updateProduct(product.productID, {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
      });
      onUpdate();
      onClose();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update product.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Description"
            name="description"
            multiline
            minRows={2}
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            label="Price (ZAR)"
            name="price"
            type="number"
            inputProps={{ step: '0.01', min: '0' }}
            value={formData.price}
            onChange={handleChange}
            required
          />
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            inputProps={{ min: '0' }}
            value={formData.quantity}
            onChange={handleChange}
            required
          />
          <TextField
            select
            label="Category"
            name="categoryID"
            value={formData.categoryID}
            onChange={handleChange}
            required
          >
            {categories.map((cat) => (
              <MenuItem key={cat.categoryID} value={cat.categoryID}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          {formData.imageURL && (
            <img
              src={formData.imageURL}
              alt="Preview"
              style={{ maxHeight: 150, borderRadius: 8, objectFit: 'cover' }}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductFormDialog;
