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
} from '@mui/material';
import { getCart, removeFromCart, updateCartItem, checkoutCart } from '../api/cart';

const CartModal = ({ open, onClose, userId, onBalanceUpdate }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch cart items when modal opens
  useEffect(() => {
    if (open && userId) {
      fetchCart();
    }
    // eslint-disable-next-line
  }, [open, userId]);

  const fetchCart = async () => {
    setLoading(true);
    setError('');
    try {
      const cart = await getCart(userId);
      setCartItems(cart.items || []);
      setCartTotal(cart.totalAmount || 0);
    } catch (err) {
      setError('Failed to fetch cart items.');
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
      await fetchCart();
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
      if (onBalanceUpdate) onBalanceUpdate(); // Optionally refresh wallet
    } catch (err) {
      setError('Checkout failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Your Cart</DialogTitle>
      <DialogContent>
        {loading && (
          <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />
        )}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {(!cartItems || cartItems.length === 0) && !loading ? (
          <Typography sx={{ mt: 2 }}>Your cart is empty.</Typography>
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
                <TableRow key={item.cartItemID}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>R{item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleQuantityChange(item.cartItemID, item.quantity - 1)}
                      disabled={item.quantity <= 1 || loading}
                    >-</Button>
                    {item.quantity}
                    <Button
                      size="small"
                      onClick={() => handleQuantityChange(item.cartItemID, item.quantity + 1)}
                      disabled={loading}
                    >+</Button>
                  </TableCell>
                  <TableCell>R{item.subtotal.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <Button
                      color="error"
                      size="small"
                      onClick={() => handleRemove(item.cartItemID)}
                      disabled={loading}
                    >
                      Remove
                    </Button>
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
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Close</Button>
        <Button
          onClick={handleCheckout}
          variant="contained"
          color="primary"
          disabled={loading || !cartItems.length}
        >
          Checkout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CartModal;