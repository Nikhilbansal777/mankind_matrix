import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  ShoppingCart as OrdersIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Store as StoreIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import '../admin/AdminSidebar.css'; // Reusing CSS for consistency

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/supplier/dashboard',
  },
  {
    id: 'products',
    label: 'My Products',
    icon: <ProductsIcon />,
    children: [
      { id: 'products-list', label: 'All Products', path: '/supplier/products' },
      { id: 'add-product', label: 'Add New Product', path: '/supplier/products/add' },
    ],
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: <OrdersIcon />,
    path: '/supplier/orders',
  },
  {
    id: 'store',
    label: 'My Store',
    icon: <StoreIcon />,
    path: '/supplier/store-settings',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <AnalyticsIcon />,
    path: '/supplier/analytics',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon />,
    path: '/supplier/settings',
  },
];

const SupplierSidebar = ({ open, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedItems, setExpandedItems] = useState({
    products: true,
  });

  const handleItemClick = (item) => {
    if (item.path) {
      navigate(item.path);
      if (isMobile) {
        onToggle();
      }
    } else if (item.children) {
      setExpandedItems(prev => ({
        ...prev,
        [item.id]: !prev[item.id],
      }));
    }
  };

  const isItemActive = (item) => {
    if (item.path) {
      return location.pathname === item.path;
    }
    if (item.children) {
      return item.children.some(child => location.pathname === child.path);
    }
    return false;
  };

  const isChildActive = (child) => {
    return location.pathname === child.path;
  };

  const renderNavigationItem = (item) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.id];
    const isActive = isItemActive(item);

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            className={`admin-nav-item-btn ${isActive ? 'active' : ''}`}
          >
            <ListItemIcon className="admin-nav-item-icon">
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              className={`admin-nav-item-text ${isActive ? 'active' : ''}`}
            />
            {hasChildren && open && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>
        
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => (
                <ListItem key={child.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleItemClick(child)}
                    className={`admin-nav-child-btn ${isChildActive(child) ? 'active' : ''}`}
                  >
                    <ListItemText
                      primary={child.label}
                      className={`admin-nav-child-text ${isChildActive(child) ? 'active' : ''}`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawerContent = (
    <Box className="admin-drawer-content">
      {/* Header */}
      <Box className="admin-drawer-header" sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)',
              flexShrink: 0,
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, fontSize: '1.2rem' }}>M</Typography>
          </Box>
          <Box>
            <Typography
                variant="h6"
                sx={{
                color: 'white',
                fontWeight: 900,
                letterSpacing: '-0.5px',
                fontSize: '1.25rem',
                lineHeight: 1,
                }}
            >
                MANKIND
            </Typography>
            <Typography
                variant="caption"
                sx={{
                color: '#6366f1',
                fontWeight: 900,
                letterSpacing: '2px',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                }}
            >
                MATRIX
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <List className="admin-nav-list" sx={{ px: 1, py: 1 }}>
        {navigationItems.map(renderNavigationItem)}
      </List>

      {/* Footer / User Profile Brief */}
      <Box sx={{ p: 2, mt: 'auto', mb: 1 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            S
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 700, noWrap: true }}>
              Elite Supplier
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
              Standard Partner
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box className="admin-drawer-footer">
        <Typography variant="caption" className="admin-drawer-footer-text">
          Portal v2.4.0 • 2026
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open && isMobile}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true,
        }}
        className="admin-mobile-drawer"
        sx={{
          '& .MuiDrawer-paper': { 
            width: 280,
            backgroundColor: '#0f172a',
            border: 'none',
          }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        className={`admin-desktop-drawer ${!open ? 'closed' : ''}`}
        open={open && !isMobile}
        sx={{
          width: open ? 280 : 0,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '& .MuiDrawer-paper': { 
            width: 280,
            border: 'none',
            overflowX: 'hidden',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundColor: '#0f172a',
          }
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default SupplierSidebar;
