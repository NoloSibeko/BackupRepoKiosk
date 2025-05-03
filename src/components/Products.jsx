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
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import ProductList from '../components/ProductList';
import { getProducts, createProduct, updateProduct } from '../api/product';
import { getCategories } from '../api/category';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    image: null,
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
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

    const role = localStorage.getItem('role');
    setIsSuperuser(role === 'Superuser');
  }, []);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);

    // Filter products by selected category
    if (category) {
      setFilteredProducts(products.filter((product) => product.categoryName === category));
    } else {
      setFilteredProducts(products); // Show all products if no category is selected
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter products by search query and selected category
    setFilteredProducts(
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) &&
          (selectedCategory ? product.categoryName === selectedCategory : true)
      )
    );
  };

  const handleOpenModal = () => {
    setError('');
    setEditingProduct(null);
    setNewProduct({ name: '', description: '', price: 0, categoryId: '', image: null });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      image: null, // New image to upload if any
    });
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('description', newProduct.description);
      formData.append('price', parseFloat(newProduct.price));
      formData.append('categoryId', parseInt(newProduct.categoryId));
      if (newProduct.image) {
        formData.append('image', newProduct.image);
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct(formData);
      }

      setNewProduct({ name: '', description: '', price: 0, categoryId: '', image: null });
      setError('');
      handleCloseModal();
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } catch (err) {
      setError('Failed to submit product. Please try again.');
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

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        {/* Search Bar */}
        <TextField
          label="Search Products"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
        />

        {/* Category Dropdown */}
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

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
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.productID}>
                <ProductCard product={product} onEdit={handleEditClick} />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Add/Edit Product Modal */}
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
            {editingProduct ? 'Edit Product' : 'Add New Product'}
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
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {editingProduct ? 'Update' : 'Submit'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Products;