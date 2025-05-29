import React, { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EditProductFormDialog from './EditProductFormDialog';
import { toggleProductAvailability } from '../api/product';
import { getCurrentUserRole } from '../api/auth';

const ProductCard = ({ product, categories, onAddToCart, onProductUpdated }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isAvailable, setIsAvailable] = useState(Boolean(product.isAvailable));
  const userRole = getCurrentUserRole();

  useEffect(() => {
    // Update availability if props change (like after edit or refresh)
    setIsAvailable(Boolean(product.isAvailable));
  }, [product.isAvailable]);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleEditOpen = (e) => {
    e.stopPropagation();
    setEditOpen(true);
  };

  const handleEditClose = () => setEditOpen(false);

  const handleSwitchChange = async (e) => {
    e.stopPropagation();
    try {
      await toggleProductAvailability(product.productID || product.id);
      const newStatus = !isAvailable;
      setIsAvailable(newStatus);
      if (onProductUpdated) onProductUpdated();
    } catch (error) {
      setSnackbarMessage('Failed to update availability.');
      setSnackbarOpen(true);
    }
  };

  const handleAddToCart = () => {
    if (!isAvailable) {
      setSnackbarMessage('Cannot add an unavailable product to the cart.');
      setSnackbarOpen(true);
      return;
    }
    if (product.quantity > product.availableQuantity) {
      setSnackbarMessage('Quantity exceeds what is available.');
      setSnackbarOpen(true);
      return;
    }
    onAddToCart(product);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <>
      <Box sx={{ perspective: '1000px' }} onClick={handleFlip}>
        <Box
          sx={{
            position: 'relative',
            width: 300,
            height: 400,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <Card
            sx={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backfaceVisibility: 'hidden',
            }}
          >
            {!isAvailable && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  backgroundColor: 'rgba(255, 0, 0, 0.8)',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  zIndex: 2,
                }}
              >
                Unavailable
              </Box>
            )}
            <CardMedia
              component="img"
              height="200"
              image={product.imageURL}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent>
              <Typography gutterBottom variant="h6" noWrap>
                {product.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  minHeight: '3.6em',
                }}
              >
                {product.description || 'No description available'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Category:</strong> {product.categoryName || 'Uncategorized'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Quantity:</strong> {product.quantity}
              </Typography>
              <Typography variant="body1" color="primary">
                <strong>R{product.price?.toFixed(2) || '0.00'}</strong>
              </Typography>
            </CardContent>
          </Card>

          {/* Back */}
          <Card
            sx={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Category:</strong> {product.categoryName || 'Uncategorized'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <strong>Description:</strong> {product.description || 'No description available'}
              </Typography>
            </CardContent>

            {userRole && userRole !== 'User' && (
              <FormControlLabel
                control={
                  <Switch
                    checked={isAvailable}
                    onChange={handleSwitchChange}
                    onClick={(e) => e.stopPropagation()}
                    color="primary"
                  />
                }
                label="Available"
                sx={{ px: 2 }}
              />
            )}

            <CardActions sx={{ justifyContent: 'center', gap: 2, mt: 2 }}>
  <Button
    variant="contained"
    onClick={(e) => {
      e.stopPropagation();
      handleAddToCart();
    }}
    disabled={!isAvailable} // Disable the button if the product is unavailable
    sx={{
      backgroundColor: isAvailable ? 'primary.main' : 'grey.400', // Change color if disabled
      '&:hover': {
        backgroundColor: isAvailable ? 'primary.dark' : 'grey.400', // Maintain the same color on hover if disabled
      },
    }}
  >
    Add to Cart
  </Button>
  {userRole && userRole !== 'User' && (
    <Button
      size="small"
      variant="outlined"
      color="primary"
      startIcon={<EditIcon />}
      onClick={handleEditOpen}
    >
      Edit
    </Button>
  )}
</CardActions>
          </Card>
        </Box>
      </Box>

      <EditProductFormDialog
        open={editOpen}
        onClose={handleEditClose}
        product={product}
        categories={categories}
        onUpdate={() => {
          handleEditClose();
          if (onProductUpdated) onProductUpdated();
        }}
      />

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="warning">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductCard;