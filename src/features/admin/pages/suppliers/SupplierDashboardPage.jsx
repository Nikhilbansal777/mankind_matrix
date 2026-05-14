import React, { useState } from 'react';
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
  useTheme,
} from '@mui/material';
import {
  LocalShipping as SupplierIcon,
  Inventory as ProductsIcon,
  AttachMoney as RevenueIcon,
  CheckCircle as ActiveIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import withLayout from '../../../../layouts/HOC/withLayout';

const stats = [
  { title: 'Total Suppliers', value: '48', change: '+4 this month', icon: <SupplierIcon sx={{ fontSize: 36 }} />, color: '#1976d2' },
  { title: 'Active Suppliers', value: '39', change: '81% active rate', icon: <ActiveIcon sx={{ fontSize: 36 }} />, color: '#4caf50' },
  { title: 'Products Supplied', value: '1,240', change: '+85 this month', icon: <ProductsIcon sx={{ fontSize: 36 }} />, color: '#ff9800' },
  { title: 'Total Revenue', value: '$342,800', change: '+9.3% vs last month', icon: <RevenueIcon sx={{ fontSize: 36 }} />, color: '#9c27b0' },
];

const suppliers = [
  { id: 'SUP-001', name: 'Alpha Goods Co.', contact: 'alice@alphagoods.com', products: 120, revenue: '$45,200', status: 'Active', rating: 4.8 },
  { id: 'SUP-002', name: 'Beta Supplies Ltd.', contact: 'bob@betasupplies.com', products: 85, revenue: '$32,100', status: 'Active', rating: 4.5 },
  { id: 'SUP-003', name: 'Gamma Traders', contact: 'carol@gammatraders.com', products: 60, revenue: '$21,500', status: 'Inactive', rating: 3.9 },
  { id: 'SUP-004', name: 'Delta Wholesale', contact: 'dave@deltawholesale.com', products: 200, revenue: '$78,400', status: 'Active', rating: 4.9 },
  { id: 'SUP-005', name: 'Epsilon Exports', contact: 'eve@epsilonexports.com', products: 45, revenue: '$15,600', status: 'Pending', rating: 4.1 },
  { id: 'SUP-006', name: 'Zeta Distributors', contact: 'zack@zetadist.com', products: 95, revenue: '$38,900', status: 'Active', rating: 4.6 },
  { id: 'SUP-007', name: 'Eta Merchants', contact: 'helen@etamerchants.com', products: 30, revenue: '$9,800', status: 'Inactive', rating: 3.5 },
];

const statusColor = { Active: 'success', Inactive: 'error', Pending: 'warning' };

const StatCard = ({ stat }) => {
  const theme = useTheme();
  return (
    <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[8] } }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: 2, backgroundColor: stat.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {stat.icon}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right' }}>{stat.change}</Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{stat.value}</Typography>
        <Typography variant="body2" color="text.secondary">{stat.title}</Typography>
      </CardContent>
    </Card>
  );
};

const SupplierDashboardPage = () => {
  const [search, setSearch] = useState('');

  const filtered = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase())
  );

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
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <StatCard stat={stat} />
          </Grid>
        ))}
      </Grid>

      {/* Supplier Table */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Supplier List</Typography>
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

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['Supplier', 'ID', 'Contact', 'Products', 'Revenue', 'Rating', 'Status'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: '#1976d2', fontSize: 14 }}>
                        {s.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{s.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{s.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{s.contact}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{s.products}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{s.revenue}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">⭐ {s.rating}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={s.status} color={statusColor[s.status]} size="small" />
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>No suppliers found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default withLayout(SupplierDashboardPage);
