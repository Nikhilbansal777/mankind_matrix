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
  FormControlLabel,
  Switch,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    sku: '',
    brand: '',
    model: '',
    specifications: {},
    images: [''],
    isFeatured: false
  });

  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  useEffect(() => {
    if (product) {
      // Transform the product data to match the form structure
      setFormData({
        name: product.name || '',
        description: product.description || '',
        categoryId: product.category?.id || '',
        sku: product.sku || '',
        brand: product.brand || '',
        model: product.model || '',
        specifications: product.specifications || {},
        images: product.images?.length ? product.images : [''],
        isFeatured: product.featured || false
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey.trim()]: specValue.trim()
        }
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const handleRemoveSpecification = (key) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return {
        ...prev,
        specifications: newSpecs
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty image URLs
    const processedData = {
      ...formData,
      images: formData.images.filter(url => url.trim() !== '')
    };

    onSubmit(processedData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Typography variant="h6" component="div">
          {product ? 'Edit Product' : 'Add New Product'}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onCancel}
          sx={{
            color: (theme) => theme.palette.grey[500],
            '&:hover': {
              color: (theme) => theme.palette.grey[700],
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid xs={12}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          
          <Grid xs={12}>
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

          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              label="SKU"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                label="Category"
              >
                {/* TODO: Replace with actual categories from API */}
                <MenuItem value={1}>Electronics</MenuItem>
                <MenuItem value={2}>Computers</MenuItem>
                <MenuItem value={3}>Smartphones</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              label="Model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Specifications
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid xs={12} md={5}>
                  <TextField
                    fullWidth
                    label="Specification Key"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    placeholder="e.g., Color, Storage, RAM"
                  />
                </Grid>
                <Grid xs={12} md={5}>
                  <TextField
                    fullWidth
                    label="Specification Value"
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    placeholder="e.g., Black, 256GB, 8GB"
                  />
                </Grid>
                <Grid xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleAddSpecification}
                    startIcon={<AddIcon />}
                    disabled={!specKey.trim() || !specValue.trim()}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {Object.entries(formData.specifications).length > 0 && (
              <Box sx={{ mt: 2 }}>
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <Paper
                    key={key}
                    variant="outlined"
                    sx={{
                      p: 1,
                      mb: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" component="span">
                        {key}:
                      </Typography>
                      <Typography component="span" sx={{ ml: 1 }}>
                        {value}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveSpecification(key)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Paper>
                ))}
              </Box>
            )}
          </Grid>

          <Grid xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Images
            </Typography>
            {formData.images.map((image, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  label={`Image URL ${index + 1}`}
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  required={index === 0}
                />
                {index > 0 && (
                  <Button
                    color="error"
                    onClick={() => removeImageField(index)}
                    sx={{ minWidth: '40px' }}
                  >
                    ×
                  </Button>
                )}
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={addImageField}
              sx={{ mt: 1 }}
            >
              Add Another Image
            </Button>
          </Grid>

          <Grid xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  name="isFeatured"
                />
              }
              label="Featured Product"
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