import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Alert,
  CircularProgress,
  Avatar,
  Box,
  IconButton
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart } from '@mui/icons-material';
import { getCart, removeFromCart, updateCartItem, checkoutCart } from '../api/cart';

const CartModal = ({ open, onClose, userId, onBalanceUpdate }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

// Calculate total whenever cartItems changes
  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);


  useEffect(() => {
    if (open && userId) {
      fetchCart();
    }
  }, [open, userId]);

  const fetchCart = async () => {
    setLoading(true);
    setError('');
    try {
      const cart = await getCart(userId);
      setCartItems(cart.items || []);
      setCartTotal(cart.totalAmount || 0);
    } catch (err) {
      
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (cartItemID) => {
    setLoading(true);
    setError('');
    try {
      await removeFromCart(cartItemID);
      await fetchCart();
    } catch (err) {
      setError('Failed to remove item.');
    } finally {
      setLoading(false);
    }
  };

const handleQuantityChange = async (cartItemID, newQty) => {
    if (newQty < 1) return;
    setLoading(true);
    setError('');
    try {
      await updateCartItem(cartItemID, { quantity: newQty });
      // Update local state immediately for better UX
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.cartItemID === cartItemID 
            ? { ...item, quantity: newQty, subtotal: item.price * newQty } 
            : item
        )
      );
    } catch (err) {
      setError('Failed to update quantity.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await checkoutCart(userId);
      setSuccess('Checkout successful!');
      await fetchCart();
      if (onBalanceUpdate) onBalanceUpdate();
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <ShoppingCart sx={{ mr: 1 }} />
          Your Shopping Cart
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {(!cartItems || cartItems.length === 0) && !loading ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="textSecondary">
              Your cart is empty
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Subtotal</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.cartItemID} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={item.imageURL}
                        alt={item.productName}
                        sx={{ width: 56, height: 56, mr: 2 }}
                        variant="rounded"
                      />
                      <Typography variant="body1">
                        {item.productName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>R{item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.cartItemID, item.quantity - 1)}
                        disabled={item.quantity <= 1 || loading}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.cartItemID, item.quantity + 1)}
                        disabled={loading}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>R{item.subtotal.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="error"
                      onClick={() => handleRemove(item.cartItemID)}
                      disabled={loading}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                  Total:
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  R{cartTotal.toFixed(2)}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          sx={{ mr: 2 }}
        >
          Continue Shopping
        </Button>
        <Button
          onClick={handleCheckout}
          variant="contained"
          color="primary"
          disabled={loading || !cartItems.length}
          size="large"
        >
          Proceed to Checkout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CartModal;