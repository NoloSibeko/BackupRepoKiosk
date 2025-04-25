// ProductList.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Alert
} from '@mui/material';
import ProductCard from './ProductCard';
import {
  getAllProducts,
  deleteProduct,
  createProduct,
} from '../api/product';
import { getCategories } from '../api/category';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('');
  const [view, setView] = useState('view'); // 'view' or 'add'
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    image: null,
  });
  const [error, setError] = useState('');

  const isSuperuser = localStorage.getItem('role') === 'Superuser';

  const fetchProducts = async () => {
    const data = await getAllProducts();
    setProducts(data);
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      setError('Failed to load categories.');
    }
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    fetchProducts();
  };

  const handleImageChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  const handleAddProduct = async () => {
    setError('');
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
      setView('view');
      fetchProducts();
    } catch (err) {
      setError('Failed to add product. Please try again.');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Box>
      {isSuperuser && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            {view === 'view' ? 'Product Management' : 'Add New Product'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setView(view === 'view' ? 'add' : 'view')}
          >
            {view === 'view' ? 'Add Product' : 'View Products'}
          </Button>
        </Box>
      )}

      {view === 'add' && isSuperuser ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Add Product
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            label="Product Name"
            fullWidth
            margin="normal"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <TextField
            label="Price"
            fullWidth
            type="number"
            margin="normal"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          />
          <TextField
            select
            fullWidth
            margin="normal"
            label="Category"
            value={newProduct.categoryId}
            onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="outlined" component="label" sx={{ mt: 2 }}>
            Upload Image
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="success" onClick={handleAddProduct}>
              Submit Product
            </Button>
          </Box>
        </Paper>
      ) : (
        <>
          <TextField
            label="Search Products"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2} columns={12}>
            {filteredProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
                <ProductCard
                  product={product}
                  isSuperuser={isSuperuser}
                  onDelete={handleDelete}
                  onEdit={() => alert('Edit not done')}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default ProductList;
