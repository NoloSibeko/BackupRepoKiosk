import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ProductFormDialog from './ProductFormDialog';

const ProductCard = ({ product, updateProductAvailability }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleEditOpen = (e) => {
    e.stopPropagation();
    setEditOpen(true);
  };

  const handleEditClose = () => setEditOpen(false);

  const handleToggleAvailability = (e) => {
    e.stopPropagation();
    updateProductAvailability(product.productID, !product.isAvailable);
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
            <CardMedia
              component="img"
              height="200"
              image={product.imageURL}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="h6" noWrap>{product.name}</Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {product.description}
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
            <CardActions sx={{ justifyContent: 'center', gap: 2, mt: 2 }}>
              <Button
                size="small"
                variant="contained"
                color={product.isAvailable ? 'error' : 'success'}
                onClick={handleToggleAvailability}
              >
                {product.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
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

      <ProductFormDialog
        open={editOpen}
        handleClose={handleEditClose}
        mode="edit"
        product={product}
      />
    </>
  );
};

export default ProductCard;
