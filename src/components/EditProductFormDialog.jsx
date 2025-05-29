import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
  Box,
} from '@mui/material';
import { getProducts, updateProduct } from '../api/product';
import { getCategories } from '../api/category';

const EditProductFormDialog = ({
  open,
  onClose,
  product = {},
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    price: '',
    categoryID: '',
    imageURL: '',
    imageFile: null,
  });

  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        quantity: product.quantity?.toString() || '',
        price: product.price?.toString() || '',
        categoryID: product.categoryID ? String(product.categoryID) : '',
        imageURL: product.imageURL || '',
        imageFile: null,
      });
      setError('');
      setFieldErrors({});
    }
  }, [product, open]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories.');
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file.');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imageURL: URL.createObjectURL(file),
      }));
      setError('');
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required.';
    if (!formData.price.trim()) errors.price = 'Price is required.';
    if (!formData.quantity.trim()) errors.quantity = 'Quantity is required.';
    if (!formData.categoryID) errors.categoryID = 'Category is required.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const updatedProduct = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
        categoryID: parseInt(formData.categoryID, 10),
        imageFile: formData.imageFile || null,
      };

      await updateProduct(product.productID, updatedProduct);

      const allProducts = await getProducts();
      const latest = allProducts.find(
        (p) => String(p.productID) === String(product.productID)
      );

      onUpdate(
        latest || {
          ...product,
          ...updatedProduct,
          productID: product.productID,
          imageURL: formData.imageFile ? formData.imageURL : formData.imageURL,
        }
      );
      onClose();
    } catch (err) {
      console.error('Product update failed:', err);
      setError(
        err?.response?.data?.message ||
        err.message ||
        'Failed to update product. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <TextField
            label="Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!fieldErrors.name}
            helperText={fieldErrors.name}
            fullWidth
            margin="normal"
          />

          <TextField
  required
  fullWidth
  label="Description"
  name="description"
  value={formData.description}
  onChange={handleChange}
  error={!!fieldErrors.description}
  helperText={fieldErrors.description}
/>


          <TextField
            label="Price (ZAR) *"
            name="price"
            type="number"
            inputProps={{ step: '0.01', min: '0' }}
            value={formData.price}
            onChange={handleChange}
            error={!!fieldErrors.price}
            helperText={fieldErrors.price}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Quantity *"
            name="quantity"
            type="number"
            inputProps={{ min: '0' }}
            value={formData.quantity}
            onChange={handleChange}
            error={!!fieldErrors.quantity}
            helperText={fieldErrors.quantity}
            fullWidth
            margin="normal"
          />

          <TextField
            select
            label="Category *"
            name="categoryID"
            value={formData.categoryID}
            onChange={handleChange}
            error={!!fieldErrors.categoryID}
            helperText={fieldErrors.categoryID}
            fullWidth
            margin="normal"
          >
            <MenuItem value="" disabled>
              Select a category
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.categoryID} value={String(cat.categoryID)}>
                {cat.name || cat.categoryName}
              </MenuItem>
            ))}
          </TextField>

          <Box>
            <Button variant="outlined" component="label" sx={{ mt: 1 }}>
              {formData.imageURL ? 'Change Image' : 'Upload Image'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            {formData.imageURL && (
              <Box mt={2}>
                <Typography variant="subtitle2">Image Preview:</Typography>
                <img
                  src={formData.imageURL}
                  alt="Preview"
                  style={{
                    maxHeight: 150,
                    maxWidth: '100%',
                    borderRadius: 4,
                    marginTop: 8,
                  }}
                />
              </Box>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditProductFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    productID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    categoryID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    imageURL: PropTypes.string,
  }),
  onUpdate: PropTypes.func.isRequired,
};

export default EditProductFormDialog;
