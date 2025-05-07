  // ProductForm.jsx
 import React, { useState, useEffect } from 'react';
 import { TextField, Button, Box, Grid, MenuItem, Typography, Alert } from '@mui/material';
 import { addProduct } from '../api/product';
 import { getCategories } from '../api/category';
 
 
 const ProductForm = ({ onSuccess }) => {
   const [form, setForm] = useState({
     name: '',
     description: '',
     price: '',
     categoryId: '',
     image: null
   });
 
   const [categories, setCategories] = useState([]);
   const [error, setError] = useState('');
 
   useEffect(() => {
     const loadCategories = async () => {
       try {
         const data = await getCategories();
         setCategories(data);
       } catch (err) {
         setError('Failed to load categories.');
       }
     };
     loadCategories();
   }, []);
 
   const handleChange = (e) => {
     const { name, value } = e.target;
     setForm(prev => ({ ...prev, [name]: value }));
   };
 
   const handleImageChange = (e) => {
     setForm(prev => ({ ...prev, image: e.target.files[0] }));
   };
   
 
   const handleSubmit = async (e) => {
     e.preventDefault();
     setError('');
     try {
       const formData = new FormData();
       formData.append('name', form.name);
       formData.append('description', form.description);
       formData.append('price', parseFloat(form.price));
       formData.append('categoryId', parseInt(form.categoryId));
       if (form.image) {
         formData.append('image', form.image);
       };
       await addProduct(formData);
       onSuccess(); // Refresh product list
       setForm({ name: '', description: '', price: '', categoryId: '' });
     } catch (err) {
       setError('Failed to add product. Please try again.');
     }
   };
 
   return (
     <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
       <Typography variant="h6" gutterBottom>Add New Product</Typography>
       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
       <Grid container spacing={2}>
         <Grid item xs={6}><TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required /></Grid>
         <Grid item xs={6}><TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth required /></Grid>
         <Grid item xs={6}><TextField label="Price" name="price" value={form.price} onChange={handleChange} type="number" fullWidth required /></Grid>
         <Grid item xs={6}><TextField label="Category ID" name="categoryId" value={form.categoryId} onChange={handleChange} fullWidth required /></Grid>
         <Grid item xs={12}><Button type="submit" variant="contained">Add Product</Button></Grid>
         <Grid item xs={6}>
           <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth required />
         </Grid>
         <Grid item xs={6}>
           <TextField
             label="Price"
             name="price"
             value={form.price}
             onChange={handleChange}
             type="number"
             fullWidth
             required
             inputProps={{ min: 0 }}
           />
         </Grid>
         <Grid item xs={6}>
           <TextField
             select
             label="Category"
             name="categoryId"
             value={form.categoryId}
             onChange={handleChange}
             fullWidth
             required
           >
             {categories.map(cat => (
               <MenuItem key={cat.id} value={cat.id}>
                 {cat.name}
               </MenuItem>
             ))}
           </TextField>
         </Grid>
         <Grid item xs={12}>
               <Button variant="outlined" component="label">
                         Upload Image
                 <input type="file" hidden onChange={handleImageChange} />
             </Button>
         </Grid>
         <Grid item xs={12}>
           <Button type="submit" variant="contained" fullWidth>Add Product</Button>
         </Grid>
       </Grid>
     </Box>
   );
 };
 
 export default ProductForm;