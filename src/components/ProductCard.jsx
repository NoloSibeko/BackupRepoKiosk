import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  CardActions,
  Box,
  Avatar,
  Stack,
  Button,
} from '@mui/material';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/product';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

const ProductCard = ({ product, isSuperuser, onDelete, onEdit }) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped((prev) => !prev);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await onDelete(product.productID);
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  return (
    <Box
      onClick={handleFlip}
      sx={{
        perspective: 1000,
        cursor: 'pointer',
        width: 300,
        height: 370,
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front of Card */}
        <Card
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: 3,
            },
          }}
        >
          {product.imageURL ? (
            <CardMedia
              component="img"
              height="200"
              image={product.imageURL}
              alt={product.name}
              sx={{ objectFit: 'cover', borderBottom: '1px solid rgba(0,0,0,0.1)' }}
              onError={(e) => {
                e.target.src = '';
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <Box
              sx={{
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'grey.100',
                borderBottom: '1px solid rgba(0,0,0,0.1)',
              }}
            >
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'grey.400' }}>
                <ImageNotSupportedIcon fontSize="large" />
              </Avatar>
            </Box>
          )}

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
                mb: 1,
              }}
            >
              {product.productdescription || 'No description available'}
            </Typography>

            <Stack direction="column" spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                <strong>Category:</strong> {product.categoryName || 'Uncategorized'}
              </Typography>
              <Typography variant="body1" color="primary">
                <strong>R{product.price.toFixed(2)}</strong>
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* Back of Card */}
        <Card
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: '#eeeeee',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Category:</strong> {product.categoryName || 'Uncategorized'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <strong>Description:</strong> {product.productDescription || 'No description available'}
          </Typography>

          {isSuperuser && (
            <CardActions sx={{ justifyContent: 'center', gap: 2, mt: 2 }}>
              <Button
                size="small"
                variant="contained"
                color="warning"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(product);
                }}
              >
                Edit
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </CardActions>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default ProductCard;
