import React from 'react';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';

const CategoryCard = ({ category, isSelected, onClick }) => {
  return (
    <Card
      onClick={() => onClick(categoryName)}
      sx={{
        backgroundColor: isSelected ? 'primary.main' : 'white',
        color: isSelected ? 'white' : 'black',
        border: isSelected ? '2px solid #1976d2' : '1px solid #ccc',
        cursor: 'pointer',
        width: 150,
        height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: '0.3s',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle1">{category.name}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CategoryCard;
