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
  FormControlLabel,
  Switch,
} from '@mui/material';

const ProductModal = ({ open, onClose = () => {}, onSubmit, product, categories = [] }) => {
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
      clearFormFields();
    }
  }, [product]);

  const clearFormFields = () => {
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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.price || !formData.categoryId) {
      alert('Name, Price, and Category are required fields.');
      return;
    }

    if (formData.price < 0 || formData.quantity < 0) {
      alert('Price and Quantity must be non-negative.');
      return;
    }

    try {
      const data = new FormData();
      data.append('Name', formData.name);
      data.append('Description', formData.description);
      data.append('Price', formData.price);
      data.append('Quantity', formData.quantity);
      data.append('CategoryID', formData.categoryId);
      data.append('isAvailable', formData.isAvailable);
      if (formData.image) data.append('Image', formData.image);
      if (product?.id) data.append('productID', product.id);

      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update product.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        document.activeElement?.blur();
      }}
      fullWidth
      maxWidth="sm"
      disableEnforceFocus
      disableAutoFocus
    >
      <DialogTitle>
        {`Edit Product${formData.name ? `: ${formData.name}` : ''}`}
      </DialogTitle>

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

        <FormControlLabel
          control={
            <Switch
              checked={formData.isAvailable}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isAvailable: e.target.checked,
                }))
              }
              color="primary"
            />
          }
          label="Product is Available"
          sx={{ mt: 2 }}
        />

        <Button variant="outlined" component="label" sx={{ mt: 2 }}>
          Upload Image
          <input type="file" hidden accept="image/*" onChange={handleImageChange} />
        </Button>

        <Box sx={{ mt: 2 }}>
          {formData.image ? (
            <>
              <Typography variant="body2">Selected File: {formData.image.name}</Typography>
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Selected"
                height={80}
                style={{ marginTop: 8 }}
              />
            </>
          ) : formData.existingImageURL ? (
            <>
              <Typography variant="body2">Current Image:</Typography>
              <img src={formData.existingImageURL} alt="Product" height={80} />
            </>
          ) : null}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductModal;
