import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  CircularProgress,
  TextField,
  Button,
  Snackbar,
} from '@mui/material';
import ProductCard from '../components/ProductCard';
import ProductFormDialog from '../components/ProductFormDialog';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/product';
import { getCategories } from '../api/category'; // Import getCategories

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          getProducts(),
          getCategories(),
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

  const handleAddClick = () => {
    setSelectedProduct(null);
    setOpenDialog(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
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
      setSnackbarMsg(error.message || 'Failed to save product');
    }
  };

  const filteredProducts = products.filter((product) =>
    [product.name, product.category?.name, product.description]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Container
          disableGutters
          maxWidth={false}
          sx={{
            minHeight: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Welcome to the Singular Kiosk
            </Typography>
            <Typography variant="body1" color="text.secondary">
              This is your central hub, enjoy.
            </Typography>
          </Paper>

          <Paper
            elevation={3}
            sx={{
              p: 4,
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: '60vh',
            }}
          >
            <Typography variant="h5" gutterBottom>
              Available Products
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Browse the products available in the kiosk..
            </Typography>

            {/* Search and Add Product Row */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                mb: 3,
              }}
            >
              <TextField
                placeholder="Search by name..."
                variant="outlined"
                size="small"
                sx={{ maxWidth: 400, width: '100%' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Add Product Button */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddClick}
                sx={{ whiteSpace: 'nowrap' }}
              >
                + Add Product
              </Button>
            </Box>

            {loading ? (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3} sx={{ flexGrow: 1 }}>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Grid key={product.id} item xs={12} sm={6} md={4}>
                      <ProductCard
                        product={product}
                        isSuperuser={true}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                      />
                    </Grid>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                    No products match your search.
                  </Typography>
                )}
              </Grid>
            )}

<ProductFormDialog
  open={openDialog}
  onClose={() => setOpenDialog(false)}
  onSubmit={handleDialogSubmit}
  product={selectedProduct}
  categories={categories} // Pass categories to the dialog
/>
            <Snackbar
              open={!!snackbarMsg}
              autoHideDuration={3000}
              message={snackbarMsg}
              onClose={() => setSnackbarMsg('')}
            />
          </Paper>
        </Container>
      </Box>

      <Box
        sx={{
          py: 2,
          textAlign: 'center',
          backgroundColor: '#1976d2',
          color: 'white',
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()}Singular Kiosk System. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
///Last working version of the Dashboard component.