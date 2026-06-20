import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Paper, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, IconButton, LinearProgress, Stack, CircularProgress, Alert,
  TextField, InputAdornment
} from '@mui/material';
import {
  TrendingUp, ShoppingCart, Inventory, Star, Add as AddIcon,
  FileDownload as ExportIcon, Store as StoreIcon, SupportAgent as SupportIcon,
  ArrowForwardIos as ArrowIcon, LocalShipping as SupplierIcon,
  Search as SearchIcon, CalendarToday as DateIcon, CheckCircle as ActiveIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip
} from 'recharts';
import SupplierLayout from '../../../layouts/SupplierLayout';
import { useNavigate } from 'react-router-dom';
import supplierService from '../../../api2/services/supplierService';

const chartData = [
  { name: 'Mon', revenue: 4200, orders: 12 },
  { name: 'Tue', revenue: 3800, orders: 8 },
  { name: 'Wed', revenue: 6500, orders: 18 },
  { name: 'Thu', revenue: 5100, orders: 14 },
  { name: 'Fri', revenue: 7800, orders: 22 },
  { name: 'Sat', revenue: 5900, orders: 16 },
  { name: 'Sun', revenue: 9200, orders: 25 },
];

const stats = [
  { title: 'Gross Revenue', value: '$12,450.00', trend: '+14.2%', icon: <TrendingUp />, color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)' },
  { title: 'Orders Placed', value: '24', trend: '3 active', icon: <ShoppingCart />, color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
  { title: 'Active Listings', value: '156', trend: '98% stock', icon: <Inventory />, color: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)' },
  { title: 'Partner Rating', value: '4.85', trend: 'Top 5%', icon: <Star />, color: '#0ea5e9', glow: 'rgba(14, 165, 233, 0.4)' },
];

const dashboardTasks = [
  { id: 'ORD-7728', title: 'Verify Payout Details', type: 'Finance', priority: 'Critical', due: '2h' },
  { id: 'INV-2201', title: 'Restock Matte Hoodie', type: 'Inventory', priority: 'High', due: '5h' },
  { id: 'SUP-0092', title: 'Update Store Policy', type: 'Compliance', priority: 'Normal', due: '2d' },
];

const lowStockItems = [
  { name: 'SpectraForce X Series', sku: 'GPU-X900', stock: 12, threshold: 50, color: '#f59e0b' },
  { name: 'QuantumMind Systems', sku: 'SYS-Q800', stock: 2, threshold: 10, color: '#ec4899' },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ 
          p: 2, borderRadius: '16px', background: 'rgba(15, 23, 42, 0.9)', 
          backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, display: 'block', mb: 1 }}>
          {payload[0].payload.name}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 900, color: '#f8fafc' }}>
          ${payload[0].value.toLocaleString()}
        </Typography>
      </Paper>
    );
  }
  return null;
};


const performanceInsights = [
  { title: 'Inventory Optimization', content: 'Consider restocking "QuantumMind Systems" as demand is projected to increase by 20% next week.', icon: <Inventory sx={{ color: '#ec4899' }} /> },
  { title: 'Revenue Growth', content: 'Your total revenue is up 14.2% compared to last month. Keep it up!', icon: <TrendingUp sx={{ color: '#10b981' }} /> },
  { title: 'Shipping Efficiency', content: 'Orders are being fulfilled 12% faster this month. Great job!', icon: <ShoppingCart sx={{ color: '#0ea5e9' }} /> },
];

// Dark mode component wrapper styles
const darkGlassCard = {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
    color: '#f8fafc'
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const SupplierDashboardPage = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [suppliersLoading, setSuppliersLoading] = useState(true);
  const [suppliersError, setSuppliersError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supplierService.getAdminSummary()
      .then(data => setSuppliers(data))
      .catch(err => setSuppliersError(err.message || 'Failed to load supplier info.'))
      .finally(() => setSuppliersLoading(false));
  }, []);

  const filtered = suppliers.filter(s =>
    s.supplierName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SupplierLayout>
      <Box sx={{ pb: 8, position: 'relative', minHeight: '100vh', bgcolor: '#0b0f19', color: '#f8fafc' }}>
        {/* Neon glowing orbs in the background */}
        <Box sx={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', top: 200, right: -50, width: 300, height: 300, background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -100, left: '30%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' }} />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            >
            {/* Page Header */}
            <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 3 }}>
                <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#f8fafc', letterSpacing: '-1.5px' }}>
                        Overview <span style={{ color: '#8b5cf6', textShadow: '0 0 20px rgba(139,92,246,0.5)' }}>Analytics</span>
                    </Typography>
                    <Chip 
                        label="Live" 
                        size="small" 
                        sx={{ 
                            background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)',
                            fontWeight: 900, fontSize: '0.65rem', height: 20, px: 0.5,
                            '& .MuiChip-label': { px: 1 },
                            animation: 'pulse 2s infinite'
                        }} 
                    />
                </Box>
                <Typography variant="body1" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                    Real-time operational intelligence for your store.
                </Typography>
                </Box>
                
                <Stack direction="row" spacing={2}>
                <Button
                    variant="outlined"
                    startIcon={<ExportIcon />}
                    sx={{ 
                    borderRadius: '16px', px: 3, py: 1.2, textTransform: 'none', fontWeight: 800, 
                    color: '#e2e8f0', borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)',
                    '&:hover': { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.2)' }
                    }}
                >
                    Export Data
                </Button>
                <Button
                    variant="contained"
                    disableElevation
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/supplier/products/add')}
                    sx={{
                    borderRadius: '16px', px: 4, py: 1.2, textTransform: 'none', fontWeight: 800,
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                    boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
                    '&:hover': { background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)', transform: 'translateY(-2px)' },
                    transition: 'all 0.3s ease'
                    }}
                >
                    Create Listing
                </Button>
                </Stack>
            </Box>
            </motion.div>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
            {stats.map((stat, i) => (
                <Grid item xs={12} sm={6} lg={3} key={i}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                    <Card 
                    sx={{ 
                        ...darkGlassCard,
                        borderRadius: '28px', 
                        height: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': { borderColor: stat.color, boxShadow: `0 10px 40px ${stat.glow}` },
                        transition: 'all 0.3s ease'
                    }}
                    >
                    <Box sx={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: stat.glow, filter: 'blur(40px)', zIndex: 0 }} />
                    <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                        <Box sx={{ 
                            width: 52, height: 52, borderRadius: '16px', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)`, 
                            color: stat.color, border: `1px solid rgba(255,255,255,0.05)`,
                            boxShadow: `0 8px 20px ${stat.glow}`
                        }}>
                            {stat.icon}
                        </Box>
                        <Chip 
                                label={stat.trend} 
                                size="small" 
                                sx={{ 
                                background: stat.trend.includes('+') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                                color: stat.trend.includes('+') ? '#10b981' : '#ef4444', 
                                border: `1px solid ${stat.trend.includes('+') ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                                fontWeight: 900, fontSize: '0.75rem', height: 26, borderRadius: '10px' 
                                }} 
                            />
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 900, mb: 0.5, color: '#f8fafc', letterSpacing: '-2px', textShadow: `0 0 20px ${stat.glow}` }}>
                        {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {stat.title}
                        </Typography>
                    </CardContent>
                    </Card>
                </motion.div>
                </Grid>
            ))}
            </Grid>

            <Grid container spacing={4}>
            <Grid item xs={12} xl={8}>
                <Stack spacing={4}>
                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Paper sx={{ ...darkGlassCard, p: 5, borderRadius: '36px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#f8fafc', mb: 0.5 }}>Revenue Velocity</Typography>
                            <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>Comparing current period performance vs benchmark</Typography>
                        </Box>
                        <Stack direction="row" spacing={1} sx={{ background: 'rgba(0,0,0,0.2)', p: 0.5, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Button size="small" variant="text" sx={{ textTransform: 'none', fontWeight: 800, color: '#94a3b8', px: 2 }}>7D</Button>
                            <Button size="small" variant="contained" disableElevation sx={{ textTransform: 'none', fontWeight: 800, background: 'rgba(255,255,255,0.1)', color: '#f8fafc', borderRadius: '8px', px: 2, '&:hover': { background: 'rgba(255,255,255,0.15)' } }}>30D</Button>
                        </Stack>
                    </Box>
                    <Box sx={{ height: 400, width: '100%', ml: -2 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#64748b', fontWeight: 700, fontSize: 12 }} 
                                dy={15} 
                                />
                                <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#64748b', fontWeight: 700, fontSize: 12 }} 
                                tickFormatter={(value) => `$${value/1000}k`}
                                />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#a855f7" 
                                fillOpacity={1} 
                                fill="url(#colorRev)" 
                                strokeWidth={4} 
                                animationDuration={2500}
                                style={{ filter: 'drop-shadow(0 0 10px rgba(168,85,247,0.5))' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                    </Paper>
                </motion.div>

                {/* Actionable Tasks */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <Paper sx={{ ...darkGlassCard, borderRadius: '36px', overflow: 'hidden' }}>
                        <Box sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <Typography variant="h5" sx={{ fontWeight: 900 }}>Priority Actions</Typography>
                            <Button endIcon={<ArrowIcon sx={{ fontSize: 14 }} />} sx={{ fontWeight: 800, textTransform: 'none', color: '#8b5cf6' }}>View Pipeline</Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ background: 'rgba(0,0,0,0.2)' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.7rem', pl: 4, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Task ID</TableCell>
                                        <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Description</TableCell>
                                        <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Priority</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.7rem', pr: 4, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Operation</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dashboardTasks.map((task) => (
                                        <TableRow key={task.id} hover sx={{ '&:last-child td': { border: 0 }, '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                                            <TableCell sx={{ pl: 4, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 900, color: '#f8fafc' }}>{task.id}</Typography>
                                            </TableCell>
                                            <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 800, color: '#f8fafc', mb: 0.5 }}>{task.title}</Typography>
                                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>{task.type}</Typography>
                                                    <Box sx={{ width: 4, height: 4, borderRadius: '50%', background: '#475569' }} />
                                                    <Typography variant="caption" sx={{ color: '#a855f7', fontWeight: 800 }}>Due {task.due}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <Chip 
                                                    label={task.priority} 
                                                    size="small" 
                                                    sx={{ 
                                                        fontWeight: 900, fontSize: '0.65rem', height: 24, borderRadius: '8px',
                                                        background: task.priority === 'Critical' ? 'rgba(239, 68, 68, 0.15)' : task.priority === 'High' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                                                        color: task.priority === 'Critical' ? '#ef4444' : task.priority === 'High' ? '#f59e0b' : '#cbd5e1',
                                                        border: `1px solid ${task.priority === 'Critical' ? 'rgba(239, 68, 68, 0.3)' : task.priority === 'High' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(148, 163, 184, 0.3)'}`
                                                    }} 
                                                />
                                            </TableCell>
                                            <TableCell align="right" sx={{ pr: 4, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <Button 
                                                variant="contained" 
                                                disableElevation
                                                size="small" 
                                                sx={{ 
                                                    fontWeight: 800, background: 'rgba(255,255,255,0.1)', color: '#f8fafc', borderRadius: '10px', px: 2, textTransform: 'none',
                                                    border: '1px solid rgba(255,255,255,0.05)',
                                                    '&:hover': { background: 'rgba(255,255,255,0.2)' }
                                                }}
                                                >
                                                Resolve
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </motion.div>
                </Stack>
            </Grid>

            <Grid item xs={12} xl={4}>
                <Stack spacing={4}>
                {/* Performance Insights */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <Paper sx={{ ...darkGlassCard, p: 4, borderRadius: '36px' }}>
                        <Typography variant="h6" sx={{ fontWeight: 900, mb: 4 }}>AI Insights</Typography>
                        <Stack spacing={3}>
                            {performanceInsights.map((insight, i) => (
                                <Box key={i} sx={{ display: 'flex', gap: 2.5 }}>
                                    <Box sx={{ p: 1.5, borderRadius: '14px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', height: 'fit-content' }}>
                                        {insight.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 800, mb: 0.5 }}>{insight.title}</Typography>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', lineHeight: 1.5, display: 'block', fontWeight: 600 }}>
                                            {insight.content}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                        <Button fullWidth sx={{ mt: 4, py: 1.5, borderRadius: '16px', fontWeight: 800, textTransform: 'none', background: 'rgba(139, 92, 246, 0.1)', color: '#a855f7', border: '1px solid rgba(139, 92, 246, 0.2)', '&:hover': { background: 'rgba(139, 92, 246, 0.2)' } }}>
                            View Strategy Report
                        </Button>
                    </Paper>
                </motion.div>

                {/* Stock Alerts */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <Paper sx={{ ...darkGlassCard, p: 4, borderRadius: '36px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 900 }}>Stock Watchlist</Typography>
                            <Chip label="3 Alerts" size="small" sx={{ fontWeight: 900, height: 24, fontSize: '0.7rem', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }} />
                        </Box>
                        <Stack spacing={4}>
                            {lowStockItems.map((item, i) => (
                                <Box key={i}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 800 }}>{item.name}</Typography>
                                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>SKU: {item.sku}</Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 900, color: item.color, textShadow: `0 0 10px ${item.color}80` }}>{item.stock} unit</Typography>
                                    </Box>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={(item.stock / item.threshold) * 100} 
                                        sx={{ height: 10, borderRadius: 5, background: 'rgba(0,0,0,0.3)', '& .MuiLinearProgress-bar': { background: item.color, borderRadius: 5, boxShadow: `0 0 10px ${item.color}` } }}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </motion.div>

                {/* Supplier Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.65 }}
                >
                    <Paper sx={{ ...darkGlassCard, p: 4, borderRadius: '36px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 900 }}>Supplier Info</Typography>
                            <Chip
                                label={`${suppliers.length} Suppliers`}
                                size="small"
                                sx={{ fontWeight: 900, height: 24, fontSize: '0.7rem', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', color: '#a855f7', border: '1px solid rgba(139,92,246,0.3)' }}
                            />
                        </Box>

                        <TextField
                            placeholder="Search suppliers..."
                            size="small"
                            fullWidth
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#64748b', fontSize: 18 }} /></InputAdornment>,
                                sx: { borderRadius: '14px', bgcolor: 'rgba(0,0,0,0.2)', color: '#f8fafc', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.07)', '& fieldset': { border: 'none' } }
                            }}
                            sx={{ mb: 3, input: { color: '#f8fafc' } }}
                        />

                        {suppliersLoading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                                <CircularProgress size={28} sx={{ color: '#a855f7' }} />
                            </Box>
                        )}

                        {suppliersError && (
                            <Alert severity="error" sx={{ borderRadius: '12px', fontSize: '0.8rem' }}>{suppliersError}</Alert>
                        )}

                        {!suppliersLoading && !suppliersError && (
                            <Stack spacing={2.5}>
                                {filtered.length === 0 && (
                                    <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', py: 2 }}>No suppliers found.</Typography>
                                )}
                                {filtered.map(s => (
                                    <Box
                                        key={s.supplierId}
                                        sx={{
                                            p: 2.5, borderRadius: '18px',
                                            background: 'rgba(0,0,0,0.2)',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            '&:hover': { borderColor: 'rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.05)' },
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {/* Supplier name + status */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(139,92,246,0.2)', color: '#a855f7', fontSize: 13, fontWeight: 900 }}>
                                                    {s.supplierName?.charAt(0)}
                                                </Avatar>
                                                <Typography variant="body2" sx={{ fontWeight: 800, color: '#f8fafc' }}>{s.supplierName}</Typography>
                                            </Box>
                                            <Chip
                                                label={s.activeProducts > 0 ? 'Active' : 'Inactive'}
                                                size="small"
                                                sx={{
                                                    height: 22, fontSize: '0.65rem', fontWeight: 900, borderRadius: '8px',
                                                    background: s.activeProducts > 0 ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)',
                                                    color: s.activeProducts > 0 ? '#10b981' : '#64748b',
                                                    border: `1px solid ${s.activeProducts > 0 ? 'rgba(16,185,129,0.3)' : 'rgba(100,116,139,0.3)'}`
                                                }}
                                            />
                                        </Box>

                                        {/* Date Joined */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <DateIcon sx={{ fontSize: 13, color: '#64748b' }} />
                                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>Joined:</Typography>
                                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>{formatDate(s.createdAt)}</Typography>
                                        </Box>

                                        {/* Last Supplied Item */}
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                                            <SupplierIcon sx={{ fontSize: 13, color: '#64748b', mt: 0.2 }} />
                                            <Box>
                                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>Last Item: </Typography>
                                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                                                    {s.lastSuppliedItemName ? `${s.lastSuppliedItemName} · ${formatDate(s.lastSuppliedItemDate)}` : '—'}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Total Items Supplied */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Inventory sx={{ fontSize: 13, color: '#64748b' }} />
                                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>Total Supplied:</Typography>
                                            <Typography variant="caption" sx={{ color: '#a855f7', fontWeight: 900 }}>{s.totalProducts ?? 0}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </Paper>
                </motion.div>

                {/* Success Partner Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                >
                    <Paper sx={{ 
                        p: 4, borderRadius: '36px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)', color: 'white',
                        position: 'relative', overflow: 'hidden', border: '1px solid rgba(16, 185, 129, 0.2)', backdropFilter: 'blur(16px)'
                    }}>
                        <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(30px)', zIndex: 0 }} />
                        <Box sx={{ position: 'relative', zIndex: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Avatar sx={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}><Star /></Avatar>
                                <Typography variant="h6" sx={{ fontWeight: 900, color: '#f8fafc' }}>Partner Success</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 4, lineHeight: 1.7, fontWeight: 500, color: '#cbd5e1' }}>
                                You are in the top 5% of suppliers this month. Join the Elite Circle for additional benefits.
                            </Typography>
                            <Button fullWidth variant="contained" sx={{ background: '#10b981', color: '#0f172a', fontWeight: 900, borderRadius: '16px', py: 1.5, textTransform: 'none', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)', '&:hover': { background: '#059669' } }}>
                                Upgrade Program
                            </Button>
                        </Box>
                        <SupportIcon sx={{ position: 'absolute', right: -40, bottom: -40, fontSize: 180, color: '#10b981', opacity: 0.1, transform: 'rotate(-15deg)' }} />
                    </Paper>
                </motion.div>
                </Stack>
            </Grid>
            </Grid>
        </Box>
      </Box>
    </SupplierLayout>
  );
};

export default SupplierDashboardPage;
