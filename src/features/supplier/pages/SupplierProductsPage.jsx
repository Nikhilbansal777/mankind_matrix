import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Chip, Tooltip,
  CircularProgress, Stack, TextField, InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import SupplierLayout from '../../../layouts/SupplierLayout';
import useProducts from '../../../hooks/useProducts';
import { formatCurrency } from '../../../utils/formatCurrency';
import Pagination from '../../../components/Pagination/Pagination';

const SupplierProductsPage = () => {
  const navigate = useNavigate();
  const { products, loading, error, pagination, getProducts, deleteProduct } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // API uses 0-based indexing for pages
    getProducts(currentPage - 1, 10);
  }, [currentPage, getProducts]);

  const handleAddProduct = () => {
    navigate('/supplier/products/add');
  };

  const handleEditProduct = (id) => {
    // Navigate to edit page or open modal in real implementation
    // navigate(`/supplier/products/edit/${id}`);
    console.log("Edit product", id);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      getProducts(currentPage - 1, 10);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Filter products by search term for local mock filtering
  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-1.5px', mb: 1 }}>
                Product <span style={{ color: '#4f46e5' }}>Catalog</span>
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 600 }}>
                Manage your listings, pricing, and inventory in one place.
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                disableElevation
                startIcon={<AddIcon />}
                onClick={handleAddProduct}
                sx={{
                  borderRadius: '16px', px: 4, py: 1.2, textTransform: 'none', fontWeight: 800,
                  bgcolor: '#4f46e5',
                  boxShadow: '0 8px 24px rgba(79, 70, 229, 0.2)',
                  '&:hover': { bgcolor: '#4338ca', transform: 'translateY(-2px)' },
                  transition: 'all 0.3s ease'
                }}
              >
                Add New Product
              </Button>
            </Stack>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Paper className="glass-card" sx={{ borderRadius: '36px', overflow: 'hidden', p: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <TextField
                    placeholder="Search by name or SKU..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        width: { xs: '100%', md: '320px' },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '16px',
                            bgcolor: '#f8fafc',
                            '& fieldset': { borderColor: 'transparent' },
                            '&:hover fieldset': { borderColor: '#e2e8f0' },
                            '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#94a3b8' }} />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button 
                    variant="outlined" 
                    startIcon={<FilterIcon />}
                    sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, color: '#64748b', borderColor: '#e2e8f0' }}
                >
                    Filters
                </Button>
            </Box>

            {loading.products ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    <CircularProgress sx={{ color: '#4f46e5' }} />
                </Box>
            ) : error ? (
                <Box sx={{ p: 5, textAlign: 'center' }}>
                    <Typography color="error" fontWeight={600}>{error}</Typography>
                </Box>
            ) : (
                <>
                    <TableContainer sx={{ border: '1px solid #f1f5f9', borderRadius: '24px' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Product Info</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Price</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Stock Status</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredProducts.map((product) => {
                                    const price = product.price || product.inventoryStatus?.price || 0;
                                    const stock = product.inventoryStatus?.availableQuantity ?? 0;
                                    const inStock = stock > 0;
                                    const imageUrl = product.imageUrl || product.images?.[0] || 'https://via.placeholder.com/150';

                                    return (
                                        <TableRow key={product.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Box 
                                                        sx={{ 
                                                            width: 50, height: 50, borderRadius: '12px', overflow: 'hidden',
                                                            bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                        }}
                                                    >
                                                        <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#1e293b' }}>{product.name}</Typography>
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>SKU: {product.sku || `PRD-${product.id}`}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={product.category?.name || product.category || 'Uncategorized'} 
                                                    size="small" 
                                                    sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 700, borderRadius: '8px' }} 
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                                    {typeof price === 'number' ? formatCurrency(price) : price}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={inStock ? `${stock} in stock` : 'Out of stock'} 
                                                    size="small" 
                                                    sx={{ 
                                                        bgcolor: inStock ? '#f0fdf4' : '#fef2f2', 
                                                        color: inStock ? '#10b981' : '#ef4444', 
                                                        fontWeight: 800, borderRadius: '8px' 
                                                    }} 
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    <Tooltip title="View">
                                                        <IconButton size="small" sx={{ color: '#64748b', bgcolor: '#f8fafc', borderRadius: '10px' }} onClick={() => navigate(`/product/${product.id}`)}>
                                                            <VisibilityIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <IconButton size="small" sx={{ color: '#4f46e5', bgcolor: 'rgba(79, 70, 229, 0.1)', borderRadius: '10px' }} onClick={() => handleEditProduct(product.id)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton size="small" sx={{ color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.1)', borderRadius: '10px' }} onClick={() => handleDeleteProduct(product.id)}>
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {filteredProducts.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                            <Typography variant="body1" sx={{ color: '#94a3b8', fontWeight: 600 }}>No products found.</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {pagination?.totalPages > 1 && (
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </Box>
                    )}
                </>
            )}
          </Paper>
        </motion.div>
      </Box>
    </SupplierLayout>
  );
};

export default SupplierProductsPage;
