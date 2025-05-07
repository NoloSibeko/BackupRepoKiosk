import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  TextField,
  Button,
  Snackbar,
  Badge,
  Card,
  CardContent
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import ProductCard from '../components/ProductCard';
import ProductFormDialog from '../components/ProductFormDialog';
import ProductModal from '../components/ProductModal';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/product';
import { getCategories, getCategoryWithProducts } from '../api/category';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(productData);
        setCategories(categoryData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch('https://localhost:7273/api/Category'),
          fetch('https://localhost:7273/api/Product')
        ]);
  
        const [catData, prodData] = await Promise.all([
          catRes.json(),
          prodRes.json()
        ]);
  
        setCategories(catData);
        setProducts(prodData);
      } catch (error) {
        console.error('Error loading categories or products:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const handleAddClick = () => {
    setSelectedProduct(null);
    setOpenDialog(true);
  };

  const handleCategoryClick = async (categoryName) => {
    try {
      const result = await getCategoryWithProducts(categoryName, setProducts);
      console.log('Fetched products:', result);
    } catch (error) {
      console.error('Error fetching category with products:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditData(product);
    setModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setSnackbarMsg('Product deleted successfully');
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
      setSnackbarMsg('Failed to delete product');
    }
  };

  const handleDialogSubmit = async (product) => {
    try {
      const isDuplicate = products.some(
        (existingProduct) =>
          existingProduct.name.toLowerCase() === product.name.toLowerCase() &&
          existingProduct.id !== product.id
      );
  
      if (isDuplicate) {
        setSnackbarMsg('A product with this name already exists.');
        return;
      }
  
      if (product.id) {
        await updateProduct(product.id, product);
        setSnackbarMsg('Product updated successfully');
      } else {
        const newProduct = await createProduct(product);
        setSnackbarMsg('Product added successfully');
        setProducts([...products, newProduct]);
      }
  
      setOpenDialog(false);
      const refreshed = await getProducts();
      setProducts(refreshed);
    } catch (error) {
      console.error('Failed to save product:', error);
      setSnackbarMsg('A product with this name already exists.');
    }
  };

  const handleModalSubmit = async (updatedProduct) => {
    try {
      await updateProduct(updatedProduct.id, updatedProduct);
      setSnackbarMsg('Product updated successfully');
      setModalOpen(false);
      setEditData(null);
      const refreshed = await getProducts();
      setProducts(refreshed);
    } catch (error) {
      console.error('Failed to update product:', error);
      setSnackbarMsg(error.message || 'Failed to update product');
    }
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = [product.name, product.category?.name, product.description]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategoryId
      ? product.categoryId === selectedCategoryId
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Main Content Area */}
      <Box sx={{
        flex: 1,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        overflow: 'hidden'
      }}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 4,
          gap: 3,
          flexShrink: 0
          
        }}>
          <Paper elevation={3} sx={{ p: 4, flex: 1 }}>
            <Typography variant="h4">Welcome to the Singular Kiosk</Typography>
            <Typography variant="body2">This is your central hub, enjoy.</Typography>
          </Paper>
          
          {/* Quick Actions */}
          <Paper elevation={3} sx={{ p: 4, width: '40%', flexShrink: 0 }}>
            <Typography variant="h5" gutterBottom>Quick Actions</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card
                  onClick={handleCartClick}
                  sx={{
                    height: 150,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#e3f2fd',
                    '&:hover': { boxShadow: 4 },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Badge badgeContent={cartItemsCount} color="error">
                      <ShoppingCart fontSize="large" />
                    </Badge>
                    <Typography variant="h6" sx={{ mt: 1 }}>Cart</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6}>
                <Card
                  onClick={() => navigate('/wallet')}
                  sx={{
                    height: 150,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#e8f5e9',
                    '&:hover': { boxShadow: 4 },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ mt: 1 }}>Wallet</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6}>
                <Card
                  onClick={() => navigate('/transactions')}
                  sx={{
                    height: 150,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#fff3e0',
                    '&:hover': { boxShadow: 4 },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ mt: 1 }}>Transactions</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6}>
                <Card
                  onClick={() => navigate('/profile')}
                  sx={{
                    height: 150,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#ede7f6',
                    '&:hover': { boxShadow: 4 },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ mt: 1 }}>Profile</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* Category Section */}
        <Paper elevation={3} sx={{
          p: 2,
          width: 1100,
          maxHeight: 250,
          overflowY: 'auto',
          backgroundColor: '#fafafa',
          mb: 4,
          flexShrink: 0
        }}>
          <Typography variant="h5" gutterBottom>Categories</Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={2}>
              {categories.map((category) => {
                const productCount = products.filter(
                  (p) => p.categoryName?.toLowerCase() === category.categoryName?.toLowerCase()
                ).length;
            
                return (
                  <Grid item xs={12} sm={6} md={3} key={category.id}>
                    <Card
                      onClick={() => handleCategoryClick(category.categoryName)}
                      sx={{
                        height: 80,
                        width: 250,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#e3f2fd',
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 4 }
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h6">{category.categoryName}</Typography>
                        <Typography variant="body2">
                          {productCount} {productCount === 1 ? 'product' : 'products'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Paper>

        {/* Products Section */}
        <Paper elevation={3} sx={{ 
          p: 4, 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 400,
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mb: 2,
            flexShrink: 0 
          }}>
            <Typography variant="h5">Available Products</Typography>
            <Button variant="contained" onClick={handleAddClick}>+ Add Product</Button>
          </Box>
          
          <TextField
            fullWidth
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2, flexShrink: 0 }}
          />
          
          {/* Scrollable Products Grid */}
          <Box sx={{ 
            flex: 1,
            overflowY: 'auto',
            minHeight: 300
          }}>
            {loading ? (
              <CircularProgress />
            ) : filteredProducts.length > 0 ? (
              <Grid container spacing={2}>
                {filteredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <ProductCard
                      product={product}
                      isSuperuser={true}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
                No products found matching your criteria
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        py: 2, 
        textAlign: 'center', 
        backgroundColor: '#1976d2', 
        color: 'white',
        flexShrink: 0,
        position: 'relative',
      }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Singular Kiosk System by Nolo. All rights reserved ;)
        </Typography>
      </Box>

      {/* Modals and Snackbar */}
      <ProductFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleDialogSubmit}
        product={selectedProduct}
        categories={categories}
      />
      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={editData}
        onSubmit={handleModalSubmit}
        categories={categories}
      />
      <Snackbar
        open={!!snackbarMsg}
        message={snackbarMsg}
        autoHideDuration={3000}
        onClose={() => setSnackbarMsg('')}
      />
    </Box>
  );
};

export default Dashboard;