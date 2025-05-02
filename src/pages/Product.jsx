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
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5',
      }}
    >
<Container
  maxWidth={false}
  disableGutters
  sx={{
    flexGrow: 1,
    py: 4,
    px: 4,
    display: 'flex',
    flexDirection: 'column',
  }}
      >
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

        <Paper
          elevation={3}
          sx={{
            p: 4,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {loading ? (
            <Typography>Loading products...</Typography>
          ) : (
<Grid container spacing={3} sx={{ flexGrow: 1 }}>
  {products.map((product) => (
    <Grid item key={product.id} xs={12} sm={6} md={4}>
      <ProductCard
        product={product}
        isSuperuser={isSuperuser}
        onDelete={async (id) => {
          try {
            await deleteProduct(id); // Call the delete API
            setProducts(products.filter((p) => p.id !== id)); // Remove the deleted product from state
          } catch (error) {
            console.error('Failed to delete product:', error);
            alert(error.message || 'Failed to delete product'); // Show an error message
          }
        }}
        onEdit={(updatedProduct) => {
          setProducts(
            products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
          ); // Replace the updated product in the state
        }}
      />
    </Grid>
  ))}
</Grid>
          )}
        </Paper>
      </Container>

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
      borderRadius: 2,
      boxShadow: 24,
      p: 4,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}
  >
    <Typography variant="h6">Add New Product</Typography>

    {error && <Alert severity="error">{error}</Alert>}

    <TextField
      name="name"
      label="Product Name"
      fullWidth
      value={newProduct.name}
      onChange={handleInputChange}
    />
    <TextField
      name="description"
      label="Description"
      multiline
      rows={3}
      fullWidth
      value={newProduct.description}
      onChange={handleInputChange}
    />
    <TextField
      name="price"
      label="Price"
      type="number"
      fullWidth
      value={newProduct.price}
      onChange={handleInputChange}
    />
    <TextField
      name="categoryId"
      label="Category"
      select
      fullWidth
      value={newProduct.categoryId}
      onChange={handleInputChange}
    >
      {categories.map((category) => (
        <MenuItem key={category.id} value={category.id}>
          {category.name}
        </MenuItem>
      ))}
    </TextField>
    <Button variant="contained" component="label">
      Upload Image
      <input type="file" hidden onChange={handleImageChange} />
    </Button>
    <Button variant="contained" color="primary" onClick={handleAddProduct}>
      Save Product
    </Button>
  </Box>
</Modal>

</Box>
  );
};

export default Products;