import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';

const CATEGORIES = [
  'GPUs',
  'AI Hardware',
  'Data Center',
  'Automotive',
  'Networking',
  'AI Software',
  'Semiconductors',
];

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        category: product.category || '',
        imageUrl: product.imageUrl || '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert price to string without $ sign if it exists
    const processedData = {
      ...formData,
      price: formData.price.toString().replace('$', ''),
      stock: parseInt(formData.stock, 10),
    };
    onSubmit(processedData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogTitle>
        {product ? 'Edit Product' : 'Add New Product'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required sx={{ 
              minHeight: '56px',
              '& .MuiInputLabel-root': {
                fontSize: '1.1rem',
                fontWeight: 500
              },
              '& .MuiOutlinedInput-root': {
                fontSize: '1.1rem',
                '& fieldset': {
                  borderWidth: 2
                }
              },
              '& .MuiSelect-select': {
                paddingRight: '320px !important'
              }
            }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
                labelId="category-label"
              >
                {CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category} sx={{ fontSize: '1.1rem' }}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              helperText="Enter a valid image URL (e.g., https://example.com/image.jpg)"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          {product ? 'Update' : 'Create'} Product
        </Button>
      </DialogActions>
    </Box>
  );
};

export default ProductForm; 