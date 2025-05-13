import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
import { getProducts, createProduct, updateProduct, toggleProductAvailability } from '../api/product';
import { getCategories, getCategoryWithProducts } from '../api/category';
import { useNavigate } from 'react-router-dom';
import SingularImage from '../images/SingularSocialSharingImage.png';


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

  /*useEffect(() => {
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
  }, []);*/

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
    setEditData(product); // Pass the product to be edited
    setModalOpen(true); // Open the modal
  };
  
  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id); // Use the product name
      setSnackbarMsg('Product deleted successfully');
      setProducts(products.filter((p) => p.id !== id)); // Remove the product from the list
    } catch (error) {
      console.error('Failed to delete product:', error);
      setSnackbarMsg('Failed to delete product');
    }
  };

  const handleDialogSubmit = async (product) => {
  try {
    // For new products (no id), check if name exists
    if (!product.id) {
      const isDuplicate = products.some(
        (existingProduct) => 
          existingProduct.name.toLowerCase() === product.name.toLowerCase()
      );
      
      if (isDuplicate) {
        setSnackbarMsg('A product with this name already exists.');
        return;
      }
    }

    if (product.id) {
      // For existing products, check if name exists excluding current product
      const isDuplicate = products.some(
        (existingProduct) => 
          existingProduct.name.toLowerCase() === product.name.toLowerCase() &&
          existingProduct.id !== product.id
      );
      
      if (isDuplicate) {
        setSnackbarMsg('A product with this name already exists.');
        return;
      }
      
      await updateProduct(product.id, product); // Use passed-in `product`
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

const handleModalSubmit = async (formData) => {
  try {
    const isEdit = formData.has('productID');
    let response;

    if (isEdit) {
      // UPDATE - Use PUT
      const productId = formData.get('productID');
      console.log('Attempting to update product with ID:', productId);
      console.log('FormData contents:', {
        name: formData.get('Name'),
        price: formData.get('Price'),
        categoryId: formData.get('CategoryID')
      });

      response = await axios.put(
        `https://localhost:7273/api/Product/${productId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      
      console.log('Update successful:', response.data);
      setSnackbarMsg('Product updated successfully');
    } 

    setModalOpen(false);
    const refreshed = await getProducts();
    setProducts(refreshed);
  } catch (error) {
    console.error('Failed to submit product:', {
      error: error.response?.data || error.message,
      config: error.config,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    setSnackbarMsg(
      error.response?.data?.message || 
      error.response?.data?.title || 
      'Failed to submit product. Please check all required fields.'
    );
    
    // Specific handling for edit failures
    if (formData.has('productID')) {
      console.error('Edit operation failed. Details:', {
        productId: formData.get('productID'),
        formData: Object.fromEntries(formData.entries()),
        authToken: localStorage.getItem('authToken') ? 'exists' : 'missing'
      });
    }
  }
};






  const handleCartClick = () => {
    navigate('/cart');
  };

 const handleToggleAvailability = async (productId, isAvailable) => {
  try {
    if (!productId) {
      console.error('Product ID is missing');
      setSnackbarMsg('Failed to update product availability: Missing product ID.');
      return;
    }

    // Create FormData with just the availability boolean
    const formData = new FormData();
    formData.append('isAvailable', isAvailable);

    // Optional: debug FormData contents safely
    if (formData && formData.entries) {
      console.log('FormData contents:', Object.fromEntries(formData.entries()));
    } else {
      console.warn('FormData is not defined correctly.');
    }

    await axios.put(`https://localhost:7273/api/Product/mark-available/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    setSnackbarMsg('Product availability updated successfully');
    
    const refreshedProducts = await getProducts();
    setProducts(refreshedProducts);

  } catch (error) {
    console.error('Failed to update product availability:', error?.message || error);
    setSnackbarMsg('Failed to update product availability. Please try again.');
  }
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
          <Box
    component="img"
    src={SingularImage}
    alt="Welcome to the Singular Kiosk"
    sx={{
      width: 300,
      height: 200,
      objectFit: 'cover'
    }}
    />

          </Paper>  
          {/* Quick Actions */}
          <Paper elevation={3} sx={{ p: 4, width: '40%', flexShrink: 0 }}>
  <Typography variant="h5" gutterBottom>
    Quick Actions
  </Typography>
  <Grid container spacing={2}>
    <Grid xs={6}>
      <Card
        onClick={handleCartClick}
        sx={{
          height: 150,
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

    <Grid sx={{ gridColumn: 'span 6' }}>
      <Card
        onClick={() => navigate('/wallet')}
        sx={{
          height: 150,
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
          <Typography variant="h6" sx={{ mt: 1 }}>
            Wallet
          </Typography>
        </CardContent>
      </Card>
    </Grid>

    <Grid xs={6}>
      <Card
        onClick={() => navigate('/transactions')}
        sx={{
          height: 150,
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
          <Typography variant="h6" sx={{ mt: 1 }}>
            Transactions
          </Typography>
        </CardContent>
      </Card>
    </Grid>

    <Grid xs={6}>
      <Card
        onClick={() => navigate('/profile')}
        sx={{
          height: 150,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          backgroundColor: '#27201A',
          '&:hover': { boxShadow: 4 },
        }}
      >
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Profile
          </Typography>
        </CardContent>
      </Card>
    </Grid>

    {/* Logout Button */}
    <Grid xs={6}>
      <Card
        onClick={() => {
          localStorage.removeItem('authToken'); // Remove the token from localStorage
          navigate('/login'); // Redirect to the login page
        }}
        sx={{
          height: 150,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          backgroundColor: '#D32F2F', // Red color for logout
          '&:hover': { boxShadow: 4 },
        }}
      >
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mt: 1, color: 'white' }}>
            Logout
          </Typography>
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
                  <Grid xs={12} sm={6} md={3} key={category.id}>
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
    <Grid key={product.id} sx={{ gridColumn: 'span 3' }}>
      <ProductCard
        product={product}
        isSuperuser={true}
        onEdit={handleEditProduct}
        onToggleAvailability={handleToggleAvailability}
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
        width: '2150px',
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
      <ProductModal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  product={editData}
  onSubmit={handleModalSubmit}
  categories={categories}
  products={products} // Pass the products
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