import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  Button,
  Modal,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import ProductList from '../components/ProductList';
import { getProducts, createProduct } from '../api/product';
import { getCategories } from '../api/category';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    image: null,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();

    // Check if the user is a superuser
    const role = localStorage.getItem('role');
    setIsSuperuser(role === 'Superuser');
  }, []);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleAddProduct = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('description', newProduct.description);
      formData.append('price', parseFloat(newProduct.price));
      formData.append('categoryId', parseInt(newProduct.categoryId));
      if (newProduct.image) {
        formData.append('image', newProduct.image);
      }

      await createProduct(formData);
      setNewProduct({ name: '', description: '', price: 0, categoryId: '', image: null });
      setError('');
      handleCloseModal();
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
    } catch (err) {
      setError('Failed to add product. Please try again.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Browse and manage the products available in your kiosk system.
      </Typography>

      {isSuperuser && (
        <Box sx={{ mb: 4, textAlign: 'right' }}>
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            Add New Product
          </Button>
        </Box>
      )}

      <Paper elevation={3} sx={{ p: 4 }}>
        {loading ? (
          <Typography>Loading products...</Typography>
        ) : (
          <Grid container spacing={3}>
            <ProductList products={products} />
          </Grid>
        )}
      </Paper>

      {/* Add Product Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Product
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            label="Product Name"
            name="name"
            fullWidth
            margin="normal"
            value={newProduct.name}
            onChange={handleInputChange}
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            value={newProduct.description}
            onChange={handleInputChange}
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            fullWidth
            margin="normal"
            value={newProduct.price}
            onChange={handleInputChange}
          />
          <TextField
            select
            label="Category"
            name="categoryId"
            fullWidth
            margin="normal"
            value={newProduct.categoryId}
            onChange={handleInputChange}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="outlined" component="label" sx={{ mt: 2 }}>
            Upload Image
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Button variant="contained" color="primary" onClick={handleAddProduct}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Products;