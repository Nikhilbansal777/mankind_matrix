import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  InputAdornment,
  Typography,
  Box,
  IconButton,
  Divider,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useInventory } from '../../../../hooks/useInventory';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const currencies = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'BRL', symbol: 'R$' },
];

const InventoryForm = ({ product, open, onClose, onSuccess }) => {
  const { createInventory, updateInventory, loading } = useInventory();
  const [formData, setFormData] = useState({
    price: '',
    currency: 'USD',
    availableQuantity: '',
    maxQuantityPerPurchase: '',
  });

  const hasInventory = product?.inventoryStatus && 
                      product.inventoryStatus.status !== 'NO_INVENTORY';

  // Initialize form with existing inventory data if available
  useEffect(() => {
    if (product?.inventoryStatus && product.inventoryStatus.status !== 'NO_INVENTORY') {
      // Only set form data if we have actual inventory data
      setFormData({
        price: product.inventoryStatus.price || '',
        currency: product.inventoryStatus.currency || 'USD',
        availableQuantity: product.inventoryStatus.availableQuantity || '',
        maxQuantityPerPurchase: product.inventoryStatus.maxQuantityPerPurchase || '',
      });
    } else {
      // Reset form if no inventory data or status is NO_INVENTORY
      setFormData({
        price: '',
        currency: 'USD',
        availableQuantity: '',
        maxQuantityPerPurchase: '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      toast.error('Please enter a valid price');
      return false;
    }
    if (!formData.availableQuantity || isNaN(formData.availableQuantity) || formData.availableQuantity < 0) {
      toast.error('Please enter a valid available quantity');
      return false;
    }
    if (formData.maxQuantityPerPurchase && 
        (isNaN(formData.maxQuantityPerPurchase) || 
         formData.maxQuantityPerPurchase <= 0 || 
         formData.maxQuantityPerPurchase > formData.availableQuantity)) {
      toast.error('Maximum quantity per purchase must be a positive number and cannot exceed available quantity');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const inventoryData = {
        price: Number(formData.price),
        currency: formData.currency,
        availableQuantity: Number(formData.availableQuantity),
        maxQuantityPerPurchase: formData.maxQuantityPerPurchase ? Number(formData.maxQuantityPerPurchase) : null,
      };

      if (hasInventory) {
        await updateInventory(product.id, inventoryData);
        toast.success('Inventory updated successfully');
      } else {
        await createInventory(product.id, inventoryData);
        toast.success('Inventory created successfully');
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Error saving inventory');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start' 
      }}>
        <Box>
          <Typography variant="h6" component="div" gutterBottom>
            {hasInventory ? 'Update Inventory' : 'Create Inventory'}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {product?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            SKU: {product?.sku}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
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
      <Divider />
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 2
          }}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {currencies.find(c => c.code === formData.currency)?.symbol || '$'}
                  </InputAdornment>
                ),
              }}
            />
            <FormControl fullWidth required>
              <InputLabel>Currency</InputLabel>
              <Select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                label="Currency"
              >
                {currencies.map(currency => (
                  <MenuItem key={currency.code} value={currency.code}>
                    {currency.code} ({currency.symbol})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Available Quantity"
              name="availableQuantity"
              type="number"
              value={formData.availableQuantity}
              onChange={handleChange}
              required
              inputProps={{ min: 0 }}
            />
            <TextField
              fullWidth
              label="Max Quantity Per Purchase"
              name="maxQuantityPerPurchase"
              type="number"
              value={formData.maxQuantityPerPurchase}
              onChange={handleChange}
              inputProps={{ min: 1 }}
              helperText="Optional - Leave empty for no limit"
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={loading.create || loading.update}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading.create || loading.update}
          >
            {(loading.create || loading.update) ? (
              <CircularProgress size={24} />
            ) : (
              hasInventory ? 'Update' : 'Create'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default InventoryForm; 