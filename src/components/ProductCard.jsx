import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Switch,
  FormControlLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EditProductFormDialog from './EditProductFormDialog';


const ProductCard = ({
  product,
  categories,
  onAddToCart,
  onEdit,
  onToggleAvailability,
  onProductUpdated,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleEditOpen = (e) => {
    e.stopPropagation();
    setEditOpen(true);
  };

  const handleEditClose = () => setEditOpen(false);

  // Toggle handler for the Switch
  const handleSwitchChange = (e) => {
    e.stopPropagation();
    const newValue = e.target.checked;
    console.log(
      `[ProductCard] Switch toggled for product ${product.productID || product.id}. New isAvailable: ${newValue}`
    );
    if (onToggleAvailability) {
      onToggleAvailability({ ...product, isAvailable: newValue });
    } else {
      console.warn('[ProductCard] No onToggleAvailability handler provided!');
    }
  };

  const handleToggleAvailability = async (updatedProduct) => {
  try {
    await toggleProductAvailability(updatedProduct.productID, updatedProduct.isAvailable);
    console.log(`Availability updated for ${updatedProduct.name}`);
    fetchProducts(); // refresh product list if needed
  } catch (err) {
    console.error('Error updating product availability:', err);
  }
};


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

             {/* Optional: Badge at bottom right only if unavailable */}
            {!product.isAvailable && (
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
                Out of Stock
              </Box>
            )}
            <CardMedia
              component="img"
              height="200"
              image={product.imageURL}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
              <Typography gutterBottom variant="h6" noWrap sx={{ mb: 0.5 }}>
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
                  mb: 0,
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
                <strong>R{product.price ? product.price.toFixed(2) : '0.00'}</strong>
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
              justifyContent: 'space-between'
            }}
          >
            <CardContent>
              <Typography variant="subtitle1">Price: R{product.price}</Typography>
              <Typography variant="subtitle2">Qty: {product.quantity}</Typography>
              <Typography variant="body2" color="text.secondary">
                {product.description}
              </Typography>
            </CardContent>
             <FormControlLabel
                control={
                  <Switch
                    checked={product.isAvailable}
                    onChange={handleSwitchChange}
                    onClick={(e) => e.stopPropagation()}
                    color="primary"
                  />
                }
                label="Available"
              />
            <CardActions sx={{ justifyContent: 'center', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => onAddToCart(product)}
              >
                Add to Cart
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleEditOpen}
              >
                Edit
              </Button>
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
    </>
  );
};

export default ProductCard;