import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import {
  LocalShipping as SupplierIcon,
  Inventory as ProductsIcon,
  CheckCircle as ActiveIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import withLayout from '../../../../layouts/HOC/withLayout';
import supplierService from '../../../../api2/services/supplierService';

const StatCard = ({ title, value, change, icon, color }) => {
  const theme = useTheme();
  return (
    <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[8] } }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: 2, backgroundColor: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right' }}>{change}</Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{value}</Typography>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
      </CardContent>
    </Card>
  );
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const SupplierDashboardPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await supplierService.getAdminSummary();
        setSuppliers(data);
      } catch (err) {
        setError(err.message || 'Failed to load supplier data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = suppliers.filter((s) =>
    s.supplierName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter((s) => s.activeProducts > 0).length;
  const totalItemsSupplied = suppliers.reduce((sum, s) => sum + (s.totalProducts || 0), 0);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Supplier Dashboard</Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of all suppliers, their products, and performance.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Suppliers"
            value={loading ? '—' : totalSuppliers}
            change="All registered suppliers"
            icon={<SupplierIcon sx={{ fontSize: 36 }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Active Suppliers"
            value={loading ? '—' : activeSuppliers}
            change="Suppliers with active products"
            icon={<ActiveIcon sx={{ fontSize: 36 }} />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Items Supplied"
            value={loading ? '—' : totalItemsSupplied}
            change="Across all suppliers"
            icon={<ProductsIcon sx={{ fontSize: 36 }} />}
            color="#ff9800"
          />
        </Grid>
      </Grid>

      {/* Supplier Table */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Supplier Information</Typography>
          <TextField
            size="small"
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 240 }}
          />
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}

        {!loading && !error && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['Supplier', 'Date Joined', 'Last Supplied Item', 'Total Items Supplied', 'Active Products', 'Status'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 600 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.supplierId} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#1976d2', fontSize: 14 }}>
                          {s.supplierName?.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{s.supplierName}</Typography>
                      </Box>
                    </TableCell>

                    {/* Date Joined */}
                    <TableCell>
                      <Typography variant="body2">{formatDate(s.createdAt)}</Typography>
                    </TableCell>

                    {/* Last Supplied Item */}
                    <TableCell>
                      {s.lastSuppliedItemName ? (
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{s.lastSuppliedItemName}</Typography>
                          <Typography variant="caption" color="text.secondary">{formatDate(s.lastSuppliedItemDate)}</Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">—</Typography>
                      )}
                    </TableCell>

                    {/* Total Items Supplied Till Date */}
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{s.totalProducts ?? 0}</Typography>
                    </TableCell>

                    {/* Active Products */}
                    <TableCell>
                      <Typography variant="body2">{s.activeProducts ?? 0}</Typography>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        label={s.activeProducts > 0 ? 'Active' : 'Inactive'}
                        color={s.activeProducts > 0 ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}

                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                        No suppliers found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default withLayout(SupplierDashboardPage);
