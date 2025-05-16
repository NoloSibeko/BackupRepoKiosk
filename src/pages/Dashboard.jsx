import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  TextField,
  Snackbar,
  Badge,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import ProductCard from '../components/ProductCard'; // Assume this handles individual product display
import ProductFormDialog from '../components/ProductFormDialog'; // Add/edit product form modal
import { getProducts, createProduct, updateProduct } from '../api/product';
import { getCategories, getCategoryWithProducts } from '../api/category';
import { useNavigate } from 'react-router-dom';
import SingularImage from '../images/SingularSocialSharingImage.png';

const Dashboard = ({ setParentModalOpen, parentModalOpen }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const navigate = useNavigate();

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [productData, categoryData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productData);
        setCategories(categoryData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setSnackbarMsg('Failed to fetch initial data.');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Sync modalOpen state with parentModalOpen prop
  useEffect(() => {
    if (parentModalOpen !== modalOpen) {
      setModalOpen(parentModalOpen);
    }
  }, [parentModalOpen]);

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Open dialog for adding a product
  const handleAddClick = () => {
    setSelectedProduct(null);
    setOpenDialog(true);
  };

  // Handle category click: filter products by categoryName
  const handleCategoryClick = async (categoryName) => {
    setSelectedCategoryName(categoryName);
    try {
      // If you want to fetch products per category from API (optional)
      // const filteredProducts = await getCategoryWithProducts(categoryName);
      // setProducts(filteredProducts);

      // Or just filter client-side:
      // setProducts(originalProducts.filter(p => p.categoryName === categoryName));
      // Assuming you keep original products, for demo client-side filtering:
      setLoading(true);
      const allProducts = await getProducts();
      setProducts(allProducts.filter(p => p.categoryName === categoryName));
    } catch (error) {
      console.error('Error fetching category products:', error);
      setSnackbarMsg('Failed to filter products by category.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog submit (add/edit product)
  const handleDialogSubmit = async (product) => {
    try {
      if (product.id) {
        // Edit existing
        await updateProduct(product.id, product);
        setSnackbarMsg('Product updated successfully');
      } else {
        // Add new
        await createProduct(product);
        setSnackbarMsg('Product added successfully');
      }
      setOpenDialog(false);
      const refreshed = await getProducts();
      setProducts(refreshed);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Save product error:', error);
      setSnackbarMsg('Failed to save product');
      setSnackbarOpen(true);
    }
  };

  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const searchStr = [product.name, product.categoryName, product.description]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matchesSearch = searchStr.includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategoryName
      ? product.categoryName === selectedCategoryName
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        px: 3,
        py: 4,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, gap: 3 }}>
        <Paper elevation={3} sx={{ p: 2, flex: 1 }}>
          <Box
            component="img"
            src={SingularImage}
            alt="Welcome to the Singular Kiosk"
            sx={{ width: '100%', maxWidth: 350, height: 200, objectFit: 'cover' }}
          />
        </Paper>

        {/* Quick Actions */}
        <Paper elevation={3} sx={{ p: 2, width: 400, flexShrink: 0 }}>
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card
                onClick={() => navigate('/cart')}
                sx={{
                  height: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#C4A484',
                  '&:hover': { boxShadow: 4 },
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Badge badgeContent={cartItemsCount} color="error">
                    <ShoppingCart fontSize="large" />
                  </Badge>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Cart
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6}>
              <Card
                onClick={() => navigate('/wallet')}
                sx={{
                  height: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#9C8369',
                  '&:hover': { boxShadow: 4 },
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">Wallet</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6}>
              <Card
                onClick={() => navigate('/transactions')}
                sx={{
                  height: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#75624F',
                  '&:hover': { boxShadow: 4 },
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">Transactions</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6}>
              <Card
                onClick={() => navigate('/profile')}
                sx={{
                  height: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#27201A',
                  color: '#fff',
                  '&:hover': { boxShadow: 4 },
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">Profile</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={() => {
                  localStorage.removeItem('authToken');
                  navigate('/login');
                }}
                sx={{ height: 50 }}
              >
                Logout
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Search and Add Product */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 3,
          maxWidth: 900,
          width: '100%',
        }}
      >
        <TextField
          variant="outlined"
          label="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flex: 1, mr: 2 }}
        />
        <Button variant="contained" onClick={handleAddClick}>
          Add Product
        </Button>
      </Box>

      {/* Categories */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          maxWidth: 900,
          mb: 4,
          px: 1,
          py: 1,
          bgcolor: '#eee',
          borderRadius: 1,
        }}
      >
        <Button
          variant={!selectedCategoryName ? 'contained' : 'outlined'}
          onClick={() => {
            setSelectedCategoryName(null);
            // Reload all products
            setLoading(true);
            getProducts()
              .then(setProducts)
              .catch(() => {
                setSnackbarMsg('Failed to reload products.');
                setSnackbarOpen(true);
              })
              .finally(() => setLoading(false));
          }}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategoryName === cat.categoryName ? 'contained' : 'outlined'}
            onClick={() => handleCategoryClick(cat.categoryName)}
          >
            {cat.categoryName}
          </Button>
        ))}
      </Box>

              {/* Product Grid Section */}
        <Box sx={{ flex: 1, width: '100%' }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={3}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <ProductCard
                      product={product}
                      onEdit={() => {
                        setSelectedProduct(product);
                        setOpenDialog(true);
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <Typography variant="h6" sx={{ m: 2 }}>
                  No products match your search.
                </Typography>
              )}
            </Grid>
          )}
        </Box>

      {/* Footer */}
      <Box sx={{ 
        py: 2, 
        textAlign: 'center', 
        backgroundColor: '#1976d2', 
        color: 'white',
        flexShrink: 0,
        width: '2150px',
        position: 'relative',
      }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Singular Kiosk System by Nolo. All rights reserved ;)
        </Typography>
      </Box>

      {/* Product Form Dialog */}
      {openDialog && (
        <ProductFormDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSubmit={handleDialogSubmit}
          product={selectedProduct}
          categories={categories}
        />
      )}
      
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
        message={snackbarMsg}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default Dashboard;
