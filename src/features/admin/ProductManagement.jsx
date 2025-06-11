import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Dialog,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import ProductForm from './ProductForm';
import InventoryForm from './InventoryForm';
import useProducts from '../../hooks/useProducts';
import Pagination from '../../components/Pagination/Pagination';
import { formatCurrency } from '../../utils/formatCurrency';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductManagement = () => {
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [openInventoryForm, setOpenInventoryForm] = useState(false);
  const [selectedProductForInventory, setSelectedProductForInventory] = useState(null);

  const {
    products,
    loading,
    error,
    pagination,
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    clearProduct,
    resetError
  } = useProducts();

  // Fetch products on mount and when page changes
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const pageIndex = currentPage - 1; // API uses 0-based indexing
        await getProducts(pageIndex, productsPerPage);
      } catch (err) {
        showNotification('Error loading products', 'error');
      }
    };
    
    loadProducts();
  }, [currentPage, productsPerPage, getProducts]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setOpenForm(true);
  };

  const handleEditProduct = async (product) => {
    try {
      await getProduct(product.id);
      setSelectedProduct(product);
      setOpenForm(true);
    } catch (err) {
      showNotification('Error loading product details', 'error');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        showNotification('Product deleted successfully', 'success');
        
        // Use pagination metadata to determine if we need to change pages
        const totalItemsAfterDeletion = pagination.totalItems - 1;
        const itemsInCurrentPage = products.length;
        const totalPagesAfterDeletion = Math.ceil(totalItemsAfterDeletion / productsPerPage);
        
        // If we're on the last page and it's not the only page, and we just deleted the last item
        if (currentPage === pagination.totalPages && itemsInCurrentPage === 1 && totalPagesAfterDeletion < pagination.totalPages) {
          setCurrentPage(prev => prev - 1);
        } else {
          // Refresh the current page to show updated data
          const pageIndex = currentPage - 1;
          await getProducts(pageIndex, productsPerPage);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('Error deleting product', 'error');
      }
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setSelectedProduct(null);
    clearProduct();
  };

  const handleFormSubmit = async (productData) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, productData);
        showNotification('Product updated successfully', 'success');
      } else {
        await createProduct(productData);
        showNotification('Product created successfully', 'success');
      }
      // Refresh the list
      const pageIndex = currentPage - 1;
      await getProducts(pageIndex, productsPerPage);
      handleFormClose();
    } catch (error) {
      console.error('Error saving product:', error);
      showNotification('Error saving product', 'error');
    }
  };

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleViewProduct = (product) => {
    navigate(`/product/${product.id}`);
  };

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleInventoryManagement = (product) => {
    setSelectedProductForInventory(product);
    setOpenInventoryForm(true);
  };

  const handleInventoryFormClose = () => {
    setOpenInventoryForm(false);
    setSelectedProductForInventory(null);
  };

  const handleInventorySuccess = async () => {
    // Refresh the product list to get updated inventory data
    const pageIndex = currentPage - 1;
    await getProducts(pageIndex, productsPerPage);
  };

  const renderProductRow = (product) => {
    const {
      id,
      name,
      sku,
      brand,
      model,
      category,
      specifications,
      images,
      inventoryStatus,
      active,
      featured,
      createdAt,
      updatedAt
    } = product;

    const price = inventoryStatus?.price;
    const stock = inventoryStatus?.availableQuantity;
    const categoryName = category?.name || 'Uncategorized';
    const imageUrl = images?.[0];
    const specs = specifications ? Object.entries(specifications).slice(0, 2).map(([key, value]) => `${key}: ${value}`).join(', ') + 
      (Object.keys(specifications).length > 2 ? ` (+${Object.keys(specifications).length - 2} more)` : '') : 'N/A';
    const status = inventoryStatus?.status || 'UNKNOWN';

    return (
      <TableRow key={id}>
        <TableCell>
          {imageUrl && (
            <img
              src={imageUrl}
              alt={name}
              style={{ width: 50, height: 50, objectFit: 'cover' }}
            />
          )}
        </TableCell>
        <TableCell>
          <Box>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="caption" color="textSecondary">
              SKU: {sku}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Box>
            <Typography variant="body2">{brand}</Typography>
            <Typography variant="caption" color="textSecondary">
              {model}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Box>
            <Typography variant="body2">
              {price ? formatCurrency(price) : 'N/A'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {status}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Box>
            <Typography variant="body2">
              Stock: {stock ?? 'N/A'}
            </Typography>
            <Tooltip title={specifications ? Object.entries(specifications).map(([key, value]) => `${key}: ${value}`).join('\n') : 'No specifications'}>
              <Typography variant="caption" color="textSecondary" sx={{ cursor: 'help' }}>
                {specs}
              </Typography>
            </Tooltip>
          </Box>
        </TableCell>
        <TableCell>
          <Box>
            <Typography variant="body2">{categoryName}</Typography>
            <Typography variant="caption" color="textSecondary">
              {featured ? 'Featured' : 'Regular'}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Box>
            <Box mb={1}>
              <Typography variant="caption" color="text.secondary" display="block">
                Created
              </Typography>
              <Typography variant="body2">
                {new Date(createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Updated
              </Typography>
              <Typography variant="body2">
                {new Date(updatedAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell align="right">
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: 1,
            width: 'fit-content',
            ml: 'auto'
          }}>
            <Tooltip title="Edit Product">
              <IconButton
                color="primary"
                onClick={() => handleEditProduct(product)}
                size="small"
                disabled={loading.update || loading.delete}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="View Details">
              <IconButton
                color="primary"
                onClick={() => handleViewProduct(product)}
                size="small"
                disabled={loading.update || loading.delete}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Manage Inventory">
              <IconButton
                color="primary"
                onClick={() => handleInventoryManagement(product)}
                size="small"
                disabled={loading.update || loading.delete}
              >
                <InventoryIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Product">
              <IconButton
                color="error"
                onClick={() => handleDeleteProduct(id)}
                size="small"
                disabled={loading.update || loading.delete}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
    );
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" onClose={resetError}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Product Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
          disabled={loading.create}
        >
          {loading.create ? 'Creating...' : 'Add Product'}
        </Button>
      </Box>

      {loading.products ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Product Info</TableCell>
                  <TableCell>Brand/Model</TableCell>
                  <TableCell>Price/Status</TableCell>
                  <TableCell>Stock/Specs</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Dates</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map(renderProductRow)}
              </TableBody>
            </Table>
          </TableContainer>

          {pagination.totalPages > 1 && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </Box>
          )}
        </>
      )}

      <Dialog
        open={openForm}
        onClose={handleFormClose}
        maxWidth="md"
        fullWidth
      >
        <ProductForm
          product={selectedProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
          loading={loading.create || loading.update}
        />
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>

      {selectedProductForInventory && (
        <InventoryForm
          product={selectedProductForInventory}
          open={openInventoryForm}
          onClose={handleInventoryFormClose}
          onSuccess={handleInventorySuccess}
        />
      )}
    </Box>
  );
};

export default ProductManagement; 