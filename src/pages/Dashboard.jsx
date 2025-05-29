import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Snackbar,
  Badge,
  Card,
  CardContent,
  Button,
  Alert,
  IconButton, 
} from '@mui/material';
import { ShoppingCart, ChevronLeft, ChevronRight } from '@mui/icons-material';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import ProductFormDialog from '../components/ProductFormDialog';
import EditProductFormDialog from '../components/EditProductFormDialog';
import { getProducts, createProduct, updateProduct } from '../api/product';
import { getCategories } from '../api/category';
import { useNavigate } from 'react-router-dom';
import SingularImage from '../images/SingularSocialSharingImage.png';
import WalletModal from '../components/WalletModal';
import { getCurrentUserId, getCurrentUserRole } from '../api/auth';
import CartModal from '../components/CartModal';
import { getCart, addToCart as apiAddToCart } from '../api/cart';
import TransactionModal from '../components/TransactionModal';
import ProfileModal from '../components/ProfileModal';
import Slider from 'react-slick';

// Image imports
import SS1 from '../images/SS1.png';
import SS2 from '../images/SS2.jpg';
import SS3 from '../images/SS3.jpg';
import BackgroundImage from '../images/Background.jpg';

// Slider configuration
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

const images = [
  SS1,
  SS2,
  SS3
];

const Dashboard = ({ setParentModalOpen, parentModalOpen }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const navigate = useNavigate();
  const productGridRef = useRef(null);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const cardWidth = 300;
  const cardsPerPage = 7;
  const gap = 16;

  const userRole = getCurrentUserRole();

  useEffect(() => {
    const id = getCurrentUserId();
    setUserId(id);
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [productData, categoryData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);

      setProducts(productData);
      setCategories(categoryData);

      if (userId) {
        const walletResponse = await axios.get(
          `https://localhost:7273/api/Wallet/${userId}/Balance`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
          }
        );
        setWalletBalance(walletResponse.data.balance);
      }

      if (userId) {
        const updatedCart = await getCart(userId);
        const totalCount = (updatedCart.items || []).reduce(
          (sum, item) => sum + (item.quantity || 1),
          0
        );
        setCartItemsCount(totalCount);
      }
    } catch (error) {
      setSnackbarMsg('Failed to fetch initial data. Please try again later.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [userId]);

  const handleBalanceUpdate = (newBalance) => {
    setWalletBalance(newBalance);
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleAddClick = () => {
    setSelectedProduct(null);
    setOpenDialog(true);
  };

  const scrollProducts = (direction) => {
    if (productGridRef.current) {
      const scrollAmount = direction === 'left' ? -((cardWidth + gap) * cardsPerPage) : ((cardWidth + gap) * cardsPerPage);
      productGridRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleCategoryClick = async (categoryName) => {
    setSelectedCategoryName(categoryName);
    setLoading(true);
    try {
      const allProducts = await getProducts();
      setProducts(allProducts.filter(p => p.categoryName === categoryName));
    } catch (error) {
      setSnackbarMsg('Failed to filter products by category.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogSubmit = async (product) => {
    try {
      if (product.productID || product.id) {
        await updateProduct(product.productID || product.id, product);
        setSnackbarMsg('Product updated successfully');
      } else {
        await createProduct(product);
        setSnackbarMsg('Product added successfully');
      }
      setOpenDialog(false);
      setEditOpen(false);
      await refreshProducts();
      await refreshCartCount();
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMsg('Failed to save product');
      setSnackbarOpen(true);
    }
  };

  const refreshProducts = async () => {
    setLoading(true);
    try {
      const refreshed = await getProducts();
      setProducts(refreshed);
    } catch {
      setSnackbarMsg('Failed to refresh products.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const updateProductInState = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        String(p.productID || p.id) === String(updatedProduct.productID || updatedProduct.id)
          ? { ...p, ...updatedProduct }
          : p
      )
    );
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

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

  const addToCart = async (product) => {
    try {
      await apiAddToCart({
        userID: userId,
        productID: product.productID || product.id,
        quantity: 1,
      });

      await refreshCartCount();

      const updatedCart = await getCart(userId);
      const totalCount = (updatedCart.items || []).reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
      );
      setCartItemsCount(totalCount);

      setSnackbarMsg('Item added to cart!');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMsg('Failed to add item to cart.');
      setSnackbarOpen(true);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setEditOpen(true);
  };

  const handleClose = () => {
    setEditOpen(false);
    setSelectedProduct(null);
  };

  const refreshCartCount = async () => {
    if (userId) {
      try {
        const updatedCart = await getCart(userId);
        const totalCount = (updatedCart.items || []).reduce(
          (sum, item) => sum + (item.quantity || 1),
          0
        );
        setCartItemsCount(totalCount);
      } catch (error) {
        console.error('Failed to refresh cart count:', error);
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#948276', // Light cream background
         // Use the imported background image
        backgroundSize: 'cover',
        backgroundRepeat: 'repeat',
        px: 3,
        py: 4,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, gap: 3 }}>
        <Paper elevation={3} sx={{ p: 2, width: 350, flexShrink: 0, height: 250, backgroundColor: '#f3e5d9' }}>
          <Box
            component="img"
            src={SingularImage}
            alt="Welcome to the Singular Kiosk"
            sx={{ width: '100%', maxWidth: 350, height: 200, objectFit: 'cover', borderRadius: '8px' }}
          />
        </Paper>

        <Paper elevation={3} sx={{ p: 2, flex: 1, backgroundColor: '#f3e5d9' }}>
          <Box sx={{ width: '1450px', height: '250px', overflow: 'hidden' }}>
            <Slider {...settings}>
              {images.map((src, index) => (
                <div key={index}>
                  <img
                    src={src}
                    alt={`Slide ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '250px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              ))}
            </Slider>
          </Box>
        </Paper>

        {/* Quick Actions */}
        <Paper elevation={3} sx={{ p: 2, width: 400, flexShrink: 0, height: 250, backgroundColor: '#f3e5d9' }}>
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card
                onClick={() => setCartModalOpen(true)}
                sx={{
                  height: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#c4a484', // Warm brown
                  borderRadius: '12px',
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
                onClick={() => setWalletModalOpen(true)}
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
                  <Typography variant="subtitle1"> R {typeof walletBalance === 'number' ? walletBalance.toFixed(2) : '0.00'}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6}>
              <Card
                onClick={() => setTransactionModalOpen(true)}
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
                  <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
                    Transactions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6}>
              <Card
                onClick={() => setProfileModalOpen(true)}
                sx={{
                  height: 50,
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
                  localStorage.removeItem('jwtToken');
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

      <Paper 
        elevation={3} 
        sx={{ 
          flex: 1, 
          width: '100%',
          maxWidth: 2285, 
          p: 3, 
          mb: 3,
          backgroundColor: '#f3e5d9', // Warm background color
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Search and Add Product */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 3,
            width: '100%',
            maxWidth: 900,
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            width: '100%',
            maxWidth: 900,
            gap: 2
          }}>
            <TextField
              variant="outlined"
              label="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ 
                flex: 1,  
                borderRadius: '20px', 
                '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                bgcolor: '#fff', // Light background for input
              }}
            />
            
            {userRole !== 'User' && (
              <Button 
                variant="contained" 
                onClick={handleAddClick}
                sx={{ 
                  width: 150, 
                  borderRadius: '12px', 
                  paddingX: 2, 
                  paddingY: 1, 
                  bgcolor: '#c4a484', // Warm button color
                  '&:hover': { bgcolor: '#b18b6b' } // Darker on hover
                }}
              >
                Add Product
              </Button>
            )}
          </Box>
        </Box>

        {/* Categories */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              maxWidth: 900,
              px: 1,
              py: 1,
              bgcolor: '#f3e5d9', // Warm background for categories
              borderRadius: 1,
            }}
          >
            <Button
              variant={!selectedCategoryName ? 'contained' : 'outlined'}
              onClick={async () => {
                setSelectedCategoryName(null);
                setLoading(true);
                try {
                  const allProducts = await getProducts();
                  setProducts(allProducts);
                } catch {
                  setSnackbarMsg('Failed to reload products.');
                  setSnackbarOpen(true);
                } finally {
                  setLoading(false);
                }
              }}
              sx={{
                bgcolor: selectedCategoryName ? '#fff' : '#c4a484', // Background color for the "All" button
                border: selectedCategoryName ? 'none' : '2px solid #2b2520',
                color: selectedCategoryName ? '#8B4513' : '#fff', // Text color
                borderRadius: '12px',
                '&:hover': { bgcolor: '#b18b6b' }, // Darker on hover
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              All
            </Button>
            {(categories || []).map((cat) => (
              <Button
                key={cat.categoryID || cat.id}
                variant={selectedCategoryName === cat.categoryName ? 'contained' : 'outlined'}
                onClick={() => handleCategoryClick(cat.categoryName)}
                sx={{
                  bgcolor: selectedCategoryName === cat.categoryName ? '#c4a484' : '#fff',
                  color: selectedCategoryName === cat.categoryName ? '#fff' : '#8B4513',
                  border: selectedCategoryName === cat.categoryName ? 'none' : '2px solid #ffffff',
                  borderRadius: '12px',
                  '&:hover': { bgcolor: '#2b2520', color: '#fff' },
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                {cat.categoryName}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Product Grid with Pagination */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            backgroundColor: '#f3e5d9', // Background color for the grid
            borderRadius: '12px',
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <IconButton
            onClick={() => scrollProducts('left')}
            sx={{ position: 'absolute', left: 0, top: '50%', zIndex: 1, backgroundColor: 'rgba(255,255,255,0.8)' }}
          >
            <ChevronLeft fontSize="large" />
          </IconButton>

          <Box
            ref={productGridRef}
            sx={{
              display: 'flex',
              gap: `${gap}px`,
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
              p: 2,
              mx: 4, // Margin on the left and right
              flexGrow: 1, // Allow the grid to grow
            }}
          >
            {filteredProducts.map((product) => (
              <Box key={product.productID || product.id} sx={{ minWidth: cardWidth, flexShrink: 0 }}>
                <ProductCard
                  product={product}
                  onAddToCart={() => addToCart(product)}
                  onEdit={handleEditProduct}
                  
                  sx={{
                    backgroundColor: '#fff4e6', // Light warm color for cards
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'scale(1.03)', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)' },
                  }}
                />
              </Box>
            ))}
          </Box>

          <IconButton
            onClick={() => scrollProducts('right')}
            sx={{ position: 'absolute', right: 0, top: '50%', zIndex: 1, backgroundColor: 'rgba(255,255,255,0.8)' }}
          >
            <ChevronRight fontSize="large" />
          </IconButton>
        </Box>
      </Paper>

      {/* Footer */}
      <Box sx={{
        py: 2,
        textAlign: 'center',
        backgroundColor: '#302923', // Darker brown
        color: 'white',
        flexShrink: 0,
        width: '100%',
        position: 'relative',
      }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Singular Kiosk System by Nolo. All rights reserved ;)
        </Typography>
      </Box>

      {/* Modals */}
      {openDialog && (
        <ProductFormDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSubmit={handleDialogSubmit}
          product={selectedProduct}
          categories={categories}
        />
      )}

      <EditProductFormDialog
        open={editOpen}
        onClose={handleClose}
        product={selectedProduct}
        categories={categories}
        onUpdate={async (updatedProduct) => {
          updateProductInState(updatedProduct);
          await refreshProducts();
          refreshCartCount();
          setEditOpen(false);
          setSelectedProduct(null);
        }}
      />
      
      <WalletModal 
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onBalanceUpdate={handleBalanceUpdate}
      />

      <ProfileModal 
        open={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
      />

      <CartModal
        open={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
        userId={userId}
        onBalanceUpdate={setWalletBalance}
      />
      
      <TransactionModal
        open={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        userId={userId}
      />
      
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarMsg.includes('Failed') ? 'error' : 'success'}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;