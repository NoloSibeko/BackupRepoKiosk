// ProductCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  CardActions,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ProductCard = ({ product, isSuperuser, onDelete, onEdit }) => {
  return (
    <Card sx={{ maxWidth: 345, mx: 'auto' }}>
      {product.imageURL && (
        <CardMedia
          component="img"
          height="180"
          image={product.imageURL}
          alt={product.name}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>Price:</strong> R{product.price}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Category:</strong> {product.category?.name || 'N/A'}
        </Typography>
      </CardContent>

      {isSuperuser && (
        <CardActions>
          <Box sx={{ ml: 'auto' }}>
            <IconButton color="primary" onClick={() => onEdit(product.id)}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => onDelete(product.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </CardActions>
      )}
    </Card>
  );
};

export default ProductCard;