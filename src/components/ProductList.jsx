import React, { useState, useEffect } from 'react';
import { TextField, Grid, Button, Box } from '@mui/material';
import ProductCard from './ProductCard';
import { getAllProducts, deleteProduct, createProduct } from '../api/product';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0 });
  const isSuperuser = localStorage.getItem('role') === 'Superuser';

  const fetchProducts = async () => {
    const { data } = await getAllProducts();
    setProducts(data);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    fetchProducts();
  };

  const handleAddProduct = async () => {
    await createProduct(newProduct);
    setNewProduct({ name: '', description: '', price: 0 });
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <TextField
        label="Search Products"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      {isSuperuser && (
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <TextField
            label="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <TextField
            label="Price"
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          />
          <Button variant="contained" onClick={handleAddProduct}>
            Add Product
          </Button>
        </Box>
      )}

      <Grid container spacing={2}>
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <ProductCard
              product={product}
              isSuperuser={isSuperuser}
              onDelete={handleDelete}
              onEdit={() => alert('Edit coming soon')}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ProductList;
