import React from 'react';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';

const ProductCard = ({ product, isSuperuser, onEdit, onDelete }) => {
  return (
    <Card sx={{ minWidth: 275, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" component="div">{product.name}</Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {product.description}
        </Typography>
        <Typography variant="body2">
          Price: R{product.price}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          Category ID: {product.categoryId}
        </Typography>
      </CardContent>
      {isSuperuser && (
        <CardActions>
          <Button size="small" color="primary" onClick={() => onEdit(product)}>Edit</Button>
          <Button size="small" color="error" onClick={() => onDelete(product.id)}>Delete</Button>
        </CardActions>
      )}
    </Card>
  );
};

export default ProductCard;
