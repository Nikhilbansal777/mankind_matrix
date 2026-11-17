import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  IconButton,
  ListItemText,
  Collapse,
  List,
  ListItem,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import useCategories from '../../../../hooks/useCategories';
import styles from './ProductForm.module.css';

// Helper function to flatten categories for value validation
// const flattenCategories = (categories) => {
//   return categories.reduce((acc, category) => {
//     acc.push(category.id);
//     if (category.subcategories && category.subcategories.length > 0) {
//       acc.push(...flattenCategories(category.subcategories));
//     }
//     return acc;
//   }, []);
// };

// Recursive component for category tree
const CategoryTreeItem = ({ category, level = 0, onSelect, selectedId }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = category.subcategories && category.subcategories.length > 0;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(category);
  };

  const handleExpandClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!open);
  };

  return (
    <>
      <MenuItem
        value={category.id}
        onClick={handleClick}
        sx={{ pl: level * 2 }}
        selected={selectedId === category.id}
      >
        <ListItemText 
          primary={category.name}
          secondary={category.description || ''}
        />
        {hasChildren && (
          <IconButton
            size="small"
            onClick={handleExpandClick}
            sx={{ ml: 1 }}
          >
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )}
      </MenuItem>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          {category.subcategories.map((subcategory) => (
            <CategoryTreeItem
              key={subcategory.id}
              category={subcategory}
              level={level + 1}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </Collapse>
      )}
    </>
  );
};

// Helper to render categories recursively
const renderCategoryOptions = (categories, level = 0) => {
  return categories.flatMap(category => [
    <MenuItem
      key={category.id}
      value={category.id.toString()}
      style={{ paddingLeft: `${level * 24 + 16}px` }}
    >
      {category.name}
    </MenuItem>,
    ...(category.subcategories && category.subcategories.length > 0
      ? renderCategoryOptions(category.subcategories, level + 1)
      : [])
  ]);
};

const ProductForm = ({ product, onSubmit, onCancel, loading = false }) => {
  const { categories, loading: categoriesLoadingState, getCategories } = useCategories();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: null,
    sku: '',
    brand: '',
    model: '',
    specifications: {},
    images: [''],
    isFeatured: false
  });

  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [selectValue, setSelectValue] = useState('');

  // Fetch categories on component mount
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  // Update form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        categoryId: null,
        sku: product.sku || '',
        brand: product.brand || '',
        model: product.model || '',
        specifications: product.specifications || {},
        images: product.images?.length ? product.images : [''],
        isFeatured: product.featured || false
      });
      setSelectValue('');
    }
  }, [product]);

  // Update select value only when categories are available
  useEffect(() => {
    if (!categoriesLoadingState.categories && categories.length > 0) {
      const productCategoryId = product?.category?.id;
      if (productCategoryId && categories.some(cat => cat.id === productCategoryId)) {
        setSelectValue(productCategoryId.toString());
        setFormData(prev => ({
          ...prev,
          categoryId: productCategoryId
        }));
      }
    }
  }, [categoriesLoadingState.categories, categories, product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'categoryId') {
      setSelectValue(value);
      const numValue = value === '' ? null : Number(value);
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
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
    const processedData = {
      ...formData,
      categoryId: formData.categoryId || null
    };
    onSubmit(processedData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className={styles.productFormWrapper}>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          {product ? 'Edit Product' : 'Add New Product'}
        </Typography>
        <IconButton 
          aria-label="close" 
          onClick={onCancel} 
          sx={{ color: (theme) => theme.palette.grey[500], '&:hover': { color: (theme) => theme.palette.grey[700] } }}
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div className={styles.productFormRow}>
          <TextField
            fullWidth
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.productFormCol}
          />
        </div>
        <div className={styles.productFormRow}>
          <TextField
            fullWidth
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className={styles.productFormCol}
          />
          <TextField
            fullWidth
            label="Model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            className={styles.productFormCol}
          />
        </div>
        <div className={styles.productFormRow}>
          <TextField
            fullWidth
            label="SKU"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            required
            className={styles.productFormCol}
          />
          <FormControl fullWidth required className={styles.productFormCol}>
            <InputLabel>Category</InputLabel>
            <Select
              name="categoryId"
              value={selectValue}
              onChange={handleChange}
              label="Category"
              disabled={categoriesLoadingState.categories || !categories.length}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300
                  }
                }
              }}
            >
              {renderCategoryOptions(categories)}
            </Select>
          </FormControl>
        </div>
        <div className={styles.productFormRow}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            required
            className={styles.productFormCol}
          />
        </div>
        <div className={styles.productFormRow}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isFeatured}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  isFeatured: e.target.checked
                }))}
              />
            }
            label="Featured Product"
            className={styles.productFormCol}
          />
        </div>
        <div className={styles.productFormRow}>
          <span className={styles.productFormSpecTitle}>Set Specifications</span>
        </div>
        <div className={styles.productFormRow}>
          <TextField
            fullWidth
            label="Key"
            value={specKey}
            onChange={(e) => setSpecKey(e.target.value)}
            className={styles.productFormCol}
          />
          <TextField
            fullWidth
            label="Value"
            value={specValue}
            onChange={(e) => setSpecValue(e.target.value)}
            className={styles.productFormCol}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleAddSpecification}
            disabled={!specKey || !specValue}
            className={styles.productFormCol}
            sx={{ height: '100%' }}
          >
            Add
          </Button>
        </div>
        <div className={styles.productFormRow}>
          <List className={styles.productFormCol}>
            {Object.entries(formData.specifications).map(([key, value]) => (
              <ListItem
                key={key}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveSpecification(key)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={key} secondary={value} />
              </ListItem>
            ))}
          </List>
        </div>
        <div className={styles.productFormRow}>
          <span className={styles.productFormHeader}>Images</span>
        </div>
        <div className={styles.productFormImagesStack}>
          {formData.images.map((image, index) => (
            <Box key={index}>
              <TextField
                fullWidth
                label={`Image URL ${index + 1}`}
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {index > 0 && (
                        <IconButton onClick={() => removeImageField(index)} edge="end">
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          ))}
          <Button
            variant="outlined"
            onClick={addImageField}
            startIcon={<AddIcon />}
            className={styles.productFormAddImageBtn}
          >
            Add Image
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading 
            ? (product ? 'Updating...' : 'Creating...') 
            : (product ? 'Update' : 'Create')} Product
        </Button>
      </DialogActions>
    </Box>
  );
};

export default ProductForm; 