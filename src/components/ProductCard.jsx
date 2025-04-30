import React from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

const ProductCard = ({ product, isSuperuser, onDelete, onEdit }) => {
  return (
    <Card sx={{ 
      maxWidth: 345, 
      mx: 'auto',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: 3
      }
    }}>
      {/* Image Section */}
      {product.imageURL ? (
        <CardMedia
          component="img"
          height="200"
          image={product.imageURL}
          alt={product.name}
          sx={{ 
            objectFit: 'cover',
            borderBottom: '1px solid rgba(0,0,0,0.1)'
          }}
          onError={(e) => {
            e.target.src = ''; // Clear the broken image
            e.target.style.display = 'none'; // Hide the img element
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
            borderBottom: '1px solid rgba(0,0,0,0.1)'
          }}
        >
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'grey.400' }}>
            <ImageNotSupportedIcon fontSize="large" />
          </Avatar>
        </Box>
      )}

      {/* Content Section */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {product.name}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '4.5em' // 3 lines of text
          }}
        >
          {product.description}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Typography variant="body1" color="primary">
            <strong>R{product.price.toFixed(2)}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Category:</strong> {product.category?.name || 'Uncategorized'}
          </Typography>
        </Stack>
      </CardContent>

      {/* Actions Section */}
      {isSuperuser && (
        <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
          <IconButton 
            color="primary" 
            onClick={() => onEdit(product)}
            aria-label="edit product"
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            color="error" 
            onClick={() => onDelete(product.id)}
            aria-label="delete product"
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      )}
    </Card>
  );
};

export default ProductCard;