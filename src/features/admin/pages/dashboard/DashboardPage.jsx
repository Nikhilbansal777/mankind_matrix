import React from 'react';
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
  Button,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  PersonAdd as UserCreatedIcon,
  AddBox as ProductAddedIcon,
} from '@mui/icons-material';
import AnalyticsPage from '../analytics/AnalyticsPage';
import { useNavigate } from 'react-router-dom';

const recentLogs = [
  { id: 1, type: 'USER_CREATED',   actor: 'System',            target: 'alice@example.com',       timestamp: '2025-06-05T09:12:00' },
  { id: 2, type: 'USER_PURCHASE',  actor: 'alice@example.com', target: 'Order #ORD-1021',          timestamp: '2025-06-05T10:05:00' },
  { id: 3, type: 'PRODUCT_ADDED',  actor: 'admin@mankind.com', target: 'Wireless Headphones',     timestamp: '2025-06-05T08:30:00' },
  { id: 4, type: 'USER_CREATED',   actor: 'System',            target: 'bob@example.com',         timestamp: '2025-06-04T14:22:00' },
  { id: 5, type: 'USER_PURCHASE',  actor: 'bob@example.com',   target: 'Order #ORD-1020',         timestamp: '2025-06-04T15:40:00' },
];

const typeConfig = {
  USER_CREATED:  { label: 'User Created',  color: 'success', icon: <UserCreatedIcon fontSize="small" />,  bg: '#e8f5e9', iconColor: '#4caf50' },
  USER_PURCHASE: { label: 'Purchase',      color: 'info',    icon: <ShoppingCartIcon fontSize="small" />, bg: '#e3f2fd', iconColor: '#2196f3' },
  PRODUCT_ADDED: { label: 'Product Added', color: 'warning', icon: <ProductAddedIcon fontSize="small" />, bg: '#fff3e0', iconColor: '#ff9800' },
};

const formatDate = (ts) =>
  new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const dashboardStats = [
  {
    title: 'Total Sales',
    value: '$125,430',
    change: '+12.5%',
    changeType: 'positive',
    icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
    color: '#4caf50',
  },
  {
    title: 'Total Orders',
    value: '2,847',
    change: '+8.2%',
    changeType: 'positive',
    icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
    color: '#2196f3',
  },
  {
    title: 'Total Customers',
    value: '1,234',
    change: '+15.3%',
    changeType: 'positive',
    icon: <PeopleIcon sx={{ fontSize: 40 }} />,
    color: '#ff9800',
  },
  {
    title: 'Products in Stock',
    value: '456',
    change: '-2.1%',
    changeType: 'negative',
    icon: <InventoryIcon sx={{ fontSize: 40 }} />,
    color: '#9c27b0',
  },
];

const StatCard = ({ stat }) => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 2,
              backgroundColor: stat.color,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {stat.icon}
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {stat.change}
            </Typography>
            <Typography
              variant="caption"
              color={stat.changeType === 'positive' ? 'success.main' : 'error.main'}
              sx={{ fontWeight: 600 }}
            >
              vs last month
            </Typography>
          </Box>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
          {stat.value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {stat.title}
        </Typography>
      </CardContent>
    </Card>
  );
};

const DashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to your admin dashboard. Here's an overview of your business performance.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard stat={stat} />
          </Grid>
        ))}
      </Grid>

      {/* Analytics Section */}
      <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
          Sales Analytics
        </Typography>
        <AnalyticsPage />
      </Paper>

      {/* Audit Logs Preview */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Recent Audit Logs</Typography>
          <Button variant="outlined" size="small" onClick={() => navigate('/admin/audit-logs')}>
            View All
          </Button>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Event', 'Type', 'Actor', 'Target', 'Time'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {recentLogs.map(log => {
                const cfg = typeConfig[log.type];
                return (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      <Avatar sx={{ width: 30, height: 30, bgcolor: cfg.bg, color: cfg.iconColor }}>
                        {cfg.icon}
                      </Avatar>
                    </TableCell>
                    <TableCell><Chip label={cfg.label} color={cfg.color} size="small" /></TableCell>
                    <TableCell><Typography variant="body2">{log.actor}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{log.target}</Typography></TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary">{formatDate(log.timestamp)}</Typography></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DashboardPage;
