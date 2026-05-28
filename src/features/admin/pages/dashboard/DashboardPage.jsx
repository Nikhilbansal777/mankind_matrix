import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import AnalyticsPage from '../analytics/AnalyticsPage';

// Mock data - in real implementation, this would come from API
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
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
          Sales Analytics
        </Typography>
        <AnalyticsPage />
      </Paper>
    </Box>
  );
};

export default DashboardPage;
