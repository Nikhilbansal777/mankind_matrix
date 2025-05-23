import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ButtonGroup,
  Button,
  useTheme
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { getSalesData } from './mockUserService';

const SalesAnalytics = () => {
  const theme = useTheme();
  const [period, setPeriod] = useState('weekly');
  const [chartType, setChartType] = useState('line');
  const [salesData, setSalesData] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    average: 0,
    highest: 0,
    growth: 0
  });

  useEffect(() => {
    loadSalesData();
  }, [period]);

  const loadSalesData = async () => {
    const data = await getSalesData(period);
    setSalesData(data);
    
    // Calculate summary statistics
    const amounts = data.map(item => item.amount);
    const total = amounts.reduce((sum, amount) => sum + amount, 0);
    const average = total / amounts.length;
    const highest = Math.max(...amounts);
    
    // Calculate growth rate
    const growth = amounts.length > 1 
      ? ((amounts[amounts.length - 1] - amounts[0]) / amounts[0]) * 100 
      : 0;

    setSummary({
      total,
      average,
      highest,
      growth
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercent = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="subtitle2" color="textSecondary">
            {label}
          </Typography>
          <Typography variant="body2" color="primary">
            {formatCurrency(payload[0].value)}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: salesData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey={period === 'weekly' ? 'date' : period === 'monthly' ? 'month' : 'year'}
              stroke={theme.palette.text.secondary}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke={theme.palette.primary.main}
              fillOpacity={1}
              fill="url(#colorAmount)"
              name="Sales Amount"
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey={period === 'weekly' ? 'date' : period === 'monthly' ? 'month' : 'year'}
              stroke={theme.palette.text.secondary}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="amount" 
              fill={theme.palette.primary.main}
              name="Sales Amount"
            />
          </BarChart>
        );
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey={period === 'weekly' ? 'date' : period === 'monthly' ? 'month' : 'year'}
              stroke={theme.palette.text.secondary}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              dot={{ fill: theme.palette.primary.main, strokeWidth: 2 }}
              activeDot={{ r: 8, fill: theme.palette.primary.main }}
              name="Sales Amount"
            />
          </LineChart>
        );
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Sales Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={period}
              label="Period"
              onChange={(e) => setPeriod(e.target.value)}
            >
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
          <ButtonGroup variant="outlined" size="small">
            <Button 
              onClick={() => setChartType('line')}
              variant={chartType === 'line' ? 'contained' : 'outlined'}
            >
              Line
            </Button>
            <Button 
              onClick={() => setChartType('area')}
              variant={chartType === 'area' ? 'contained' : 'outlined'}
            >
              Area
            </Button>
            <Button 
              onClick={() => setChartType('bar')}
              variant={chartType === 'bar' ? 'contained' : 'outlined'}
            >
              Bar
            </Button>
          </ButtonGroup>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Sales
              </Typography>
              <Typography variant="h5" color="primary">
                {formatCurrency(summary.total)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Sales
              </Typography>
              <Typography variant="h5" color="primary">
                {formatCurrency(summary.average)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Highest Sales
              </Typography>
              <Typography variant="h5" color="primary">
                {formatCurrency(summary.highest)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Growth Rate
              </Typography>
              <Typography 
                variant="h5" 
                color={summary.growth >= 0 ? 'success.main' : 'error.main'}
              >
                {formatPercent(summary.growth)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper 
        sx={{ 
          p: 3,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[2]
        }}
      >
        <ResponsiveContainer width="100%" height={500}>
          {renderChart()}
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default SalesAnalytics; 