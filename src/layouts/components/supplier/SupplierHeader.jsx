import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Badge,
  Tooltip,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  NotificationsNoneOutlined as NotificationsIcon,
  SettingsOutlined as SettingsIcon,
  Search as SearchIcon,
  HelpOutline as HelpIcon,
  LogoutOutlined as LogoutIcon,
  PersonOutlineOutlined as ProfileIcon,
  TrendingUp,
  ShoppingCart,
  Inventory,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/slices/userSlice';
import LogoutButton from '../../../features/auth/LogoutButton';
import { FaSignOutAlt } from 'react-icons/fa';
import '../admin/AdminHeader.css';

const SupplierHeader = ({ onToggleSidebar, sidebarOpen }) => {
  const user = useSelector(selectUser);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleNotifClick = (event) => setNotifAnchorEl(event.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
    setNotifAnchorEl(null);
  };
  
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: sidebarOpen ? 'calc(100% - 280px)' : '100%' },
        left: { md: sidebarOpen ? '280px' : '0' },
        right: 0,
        background: 'rgba(11, 15, 25, 0.8)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        transition: (theme) => theme.transitions.create(['width', 'left'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: { xs: 2, md: 4 }, minHeight: '80px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <IconButton
            edge="start"
            onClick={onToggleSidebar}
            sx={{ mr: 1, display: { md: 'none' }, color: 'var(--slate-600)' }}
          >
            <MenuIcon />
          </IconButton>

          {/* Search Bar */}
          <Box className="header-search-container" sx={{ display: { xs: 'none', md: 'flex' }, maxWidth: 420, width: '100%', ml: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', px: 1.5, py: 0.5, alignItems: 'center' }}>
            <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
            <input 
              type="text" 
              placeholder="Search analytics, orders, products..." 
              style={{ 
                width: '100%', 
                background: 'transparent', 
                border: 'none', 
                outline: 'none', 
                padding: '8px 12px', 
                fontWeight: 600,
                fontSize: '0.9rem',
                color: '#f8fafc'
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ background: 'rgba(255,255,255,0.1)', px: 1, py: 0.5, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 800, fontSize: '0.65rem' }}>⌘</Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 800, fontSize: '0.65rem' }}>K</Typography>
                </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 3 } }}>
          {/* Live Clock */}
          <Box sx={{ display: { xs: 'none', lg: 'block' }, textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#f8fafc', lineHeight: 1.2 }}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
              {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ my: 2, display: { xs: 'none', lg: 'block' } }} />

          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Support">
              <IconButton sx={{ color: '#94a3b8', '&:hover': { color: '#f8fafc', background: 'rgba(255,255,255,0.1)' } }}>
                <HelpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <IconButton 
                onClick={handleNotifClick}
                sx={{ color: '#94a3b8', '&:hover': { color: '#f8fafc', background: 'rgba(255,255,255,0.1)' } }}
            >
                <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontWeight: 800, border: '2px solid #0b0f19' } }}>
                    <NotificationsIcon fontSize="small" />
                </Badge>
            </IconButton>
          </Stack>

          <Box 
            onClick={handleProfileClick}
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                cursor: 'pointer',
                p: 0.5,
                pr: { xs: 0.5, sm: 2 },
                borderRadius: '16px',
                transition: '0.2s',
                '&:hover': { background: 'rgba(255,255,255,0.05)' }
            }}
          >
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                boxShadow: '0 8px 16px rgba(139, 92, 246, 0.3)',
                fontSize: '0.9rem',
                fontWeight: 700,
              }}
            >
              {user?.firstName?.[0] || 'S'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#f8fafc', lineHeight: 1.2 }}>
                {user?.firstName || 'Supplier'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#a855f7', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Elite Partner
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Notifications Menu */}
        <Menu
            anchorEl={notifAnchorEl}
            open={Boolean(notifAnchorEl)}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    mt: 1.5, width: 320, borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid var(--slate-100)', p: 1
                }
            }}
        >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Notifications</Typography>
                <Typography variant="caption" sx={{ color: 'var(--primary)', fontWeight: 800, cursor: 'pointer' }}>Mark all as read</Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <MenuItem onClick={handleClose} sx={{ borderRadius: '16px', py: 1.5, mb: 0.5 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ p: 1, borderRadius: '12px', bgcolor: 'var(--slate-50)' }}><ShoppingCart sx={{ color: 'var(--primary)', fontSize: 20 }} /></Box>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>New Order #7728</Typography>
                        <Typography variant="caption" sx={{ color: 'var(--slate-500)', display: 'block' }}>A new order has been placed by John Doe.</Typography>
                        <Typography variant="caption" sx={{ color: 'var(--slate-400)', fontWeight: 600 }}>2 mins ago</Typography>
                    </Box>
                </Box>
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ borderRadius: '16px', py: 1.5, mb: 0.5 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ p: 1, borderRadius: '12px', bgcolor: 'var(--slate-50)' }}><Inventory sx={{ color: 'var(--error)', fontSize: 20 }} /></Box>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>Low Stock Alert</Typography>
                        <Typography variant="caption" sx={{ color: 'var(--slate-500)', display: 'block' }}>Matte Grey Hoodie is running low (12 left).</Typography>
                        <Typography variant="caption" sx={{ color: 'var(--slate-400)', fontWeight: 600 }}>1 hour ago</Typography>
                    </Box>
                </Box>
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <Button fullWidth sx={{ textTransform: 'none', fontWeight: 800, py: 1.5, borderRadius: '16px' }}>View All Notifications</Button>
        </Menu>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              width: 240,
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '1px solid var(--slate-100)',
              p: 1
            }
          }}
        >
          <MenuItem onClick={handleClose} sx={{ borderRadius: '16px', mb: 0.5 }}>
            <ListItemIcon><ProfileIcon sx={{ fontSize: 20 }} /></ListItemIcon>
            <ListItemText primary="Partner Profile" primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }} />
          </MenuItem>
          <MenuItem onClick={handleClose} sx={{ borderRadius: '16px', mb: 0.5 }}>
            <ListItemIcon><SettingsIcon sx={{ fontSize: 20 }} /></ListItemIcon>
            <ListItemText primary="Account Settings" primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }} />
          </MenuItem>
          <Divider sx={{ my: 1 }} />
          <MenuItem sx={{ p: 0 }}>
            <LogoutButton 
                sx={{ 
                    width: '100%', 
                    justifyContent: 'flex-start', 
                    color: 'error.main', 
                    fontWeight: 700, 
                    borderRadius: '16px',
                    textTransform: 'none',
                    py: 1,
                    px: 2,
                    '&:hover': { bgcolor: 'error.lighter' }
                }}
                children={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LogoutIcon sx={{ fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>Log Out</Typography>
                    </Box>
                }
                showConfirmation={true}
            />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default SupplierHeader;
