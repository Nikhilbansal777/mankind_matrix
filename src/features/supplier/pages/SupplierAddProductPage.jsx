import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Paper, Grid, TextField, Stack,
  MenuItem, CircularProgress, Alert, Snackbar, InputAdornment, IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import SupplierLayout from '../../../layouts/SupplierLayout';
import useProducts from '../../../hooks/useProducts';

const CATEGORIES = ['GPUs', 'AI Hardware', 'SINGLE BOARD COMPUTERS', 'MICROCONTROLLERS', 'EDGE AI COMPUTING', 'IOT DEVELOPMENT'];

const initialFormState = {
  name: '',
  brand: '',
  sku: '',
  category: '',
  price: '',
  availableQuantity: '',
  imageUrl: '',
  shortDescription: '',
  longDescription: '',
};

const SupplierAddProductPage = () => {
  const navigate = useNavigate();
  const { createProduct, loading } = useProducts();
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (!formData.availableQuantity || isNaN(formData.availableQuantity) || Number(formData.availableQuantity) < 0) {
      newErrors.availableQuantity = 'Valid quantity is required';
    }
    
    if (formData.imageUrl && !/^https?:\/\/.+/.test(formData.imageUrl)) {
        newErrors.imageUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        inventoryStatus: {
            availableQuantity: Number(formData.availableQuantity),
            price: Number(formData.price),
            status: Number(formData.availableQuantity) > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK'
        },
        images: formData.imageUrl ? [formData.imageUrl] : []
      };

      await createProduct(payload);
      showNotification('Product created successfully!', 'success');
      
      // Navigate back to products page after short delay
      setTimeout(() => {
        navigate('/supplier/products');
      }, 1500);

    } catch (error) {
      console.error('Error creating product:', error);
      showNotification('Failed to create product. Please try again.', 'error');
    }
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <SupplierLayout>
      <Box sx={{ pb: 8, position: 'relative', minHeight: '100vh' }}>
        <div className="mesh-background" />
        
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Header */}
          <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 3 }}>
            <IconButton 
              onClick={() => navigate('/supplier/products')}
              sx={{ bgcolor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', '&:hover': { bgcolor: '#f8fafc' } }}
            >
              <ArrowBackIcon sx={{ color: '#1e293b' }} />
            </IconButton>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-1.5px', mb: 1 }}>
                Add New <span style={{ color: '#4f46e5' }}>Product</span>
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 600 }}>
                Fill in the details below to publish a new listing.
              </Typography>
            </Box>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Main Content Area */}
              <Grid item xs={12} lg={8}>
                <Stack spacing={4}>
                  <Paper className="glass-card" sx={{ p: 4, borderRadius: '32px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: '#1e293b' }}>Basic Information</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Product Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          error={!!errors.name}
                          helperText={errors.name}
                          sx={inputStyles}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Brand"
                          name="brand"
                          value={formData.brand}
                          onChange={handleChange}
                          sx={inputStyles}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="SKU"
                          name="sku"
                          value={formData.sku}
                          onChange={handleChange}
                          sx={inputStyles}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Short Description"
                          name="shortDescription"
                          value={formData.shortDescription}
                          onChange={handleChange}
                          multiline
                          rows={2}
                          sx={inputStyles}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Long Description"
                          name="longDescription"
                          value={formData.longDescription}
                          onChange={handleChange}
                          multiline
                          rows={5}
                          sx={inputStyles}
                        />
                      </Grid>
                    </Grid>
                  </Paper>

                  <Paper className="glass-card" sx={{ p: 4, borderRadius: '32px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: '#1e293b' }}>Media</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Image URL"
                          name="imageUrl"
                          value={formData.imageUrl}
                          onChange={handleChange}
                          error={!!errors.imageUrl}
                          helperText={errors.imageUrl || "Enter the URL of the product image"}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <UploadIcon sx={{ color: '#94a3b8' }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={inputStyles}
                        />
                      </Grid>
                      {formData.imageUrl && !errors.imageUrl && (
                        <Grid item xs={12}>
                          <Box sx={{ mt: 2, borderRadius: '16px', overflow: 'hidden', height: 200, width: 'fit-content', border: '1px solid #e2e8f0' }}>
                            <img src={formData.imageUrl} alt="Preview" style={{ height: '100%', objectFit: 'contain' }} />
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Stack>
              </Grid>

              {/* Sidebar Settings Area */}
              <Grid item xs={12} lg={4}>
                <Stack spacing={4}>
                  <Paper className="glass-card" sx={{ p: 4, borderRadius: '32px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: '#1e293b' }}>Pricing & Inventory</Typography>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        error={!!errors.price}
                        helperText={errors.price}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={inputStyles}
                      />
                      <TextField
                        fullWidth
                        label="Available Quantity"
                        name="availableQuantity"
                        type="number"
                        value={formData.availableQuantity}
                        onChange={handleChange}
                        error={!!errors.availableQuantity}
                        helperText={errors.availableQuantity}
                        sx={inputStyles}
                      />
                    </Stack>
                  </Paper>

                  <Paper className="glass-card" sx={{ p: 4, borderRadius: '32px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: '#1e293b' }}>Organization</Typography>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        select
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        error={!!errors.category}
                        helperText={errors.category}
                        sx={inputStyles}
                      >
                        {CATEGORIES.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Stack>
                  </Paper>

                  {/* Submit Actions */}
                  <Box sx={{ mt: 2 }}>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disableElevation
                      startIcon={loading.create ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      disabled={loading.create}
                      sx={{
                        borderRadius: '16px', py: 1.8, textTransform: 'none', fontWeight: 800, fontSize: '1rem',
                        bgcolor: '#4f46e5',
                        boxShadow: '0 8px 24px rgba(79, 70, 229, 0.2)',
                        '&:hover': { bgcolor: '#4338ca', transform: 'translateY(-2px)' },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {loading.create ? 'Publishing...' : 'Publish Product'}
                    </Button>
                    <Button
                      fullWidth
                      variant="text"
                      onClick={() => navigate('/supplier/products')}
                      disabled={loading.create}
                      sx={{ mt: 2, textTransform: 'none', fontWeight: 700, color: '#64748b', '&:hover': { color: '#1e293b', bgcolor: 'transparent' } }}
                    >
                      Discard Draft
                    </Button>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </motion.div>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ borderRadius: '12px', fontWeight: 600 }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </SupplierLayout>
  );
};

// Reusable styling for inputs to match the premium theme
const inputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    bgcolor: '#f8fafc',
    '& fieldset': { borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: '#cbd5e1' },
    '&.Mui-focused fieldset': { borderColor: '#4f46e5', borderWidth: '2px' },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 600,
    color: '#64748b'
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#4f46e5'
  }
};

export default SupplierAddProductPage;
