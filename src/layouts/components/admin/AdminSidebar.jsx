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
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  People as UsersIcon,
  ShoppingCart as OrdersIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import './AdminSidebar.css';

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/admin',
  },
  {
    id: 'products',
    label: 'Products',
    icon: <ProductsIcon />,
    children: [
      { id: 'products-list', label: 'Product List', path: '/admin/products' },
      { id: 'categories', label: 'Categories', path: '/admin/categories' },
    ],
  },
  {
    id: 'users',
    label: 'Users',
    icon: <UsersIcon />,
    children: [
      { id: 'users-list', label: 'User List', path: '/admin/users' },
    ],
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: <OrdersIcon />,
    children: [
      { id: 'orders-list', label: 'Order List', path: '/admin/orders' },
      { id: 'coupons', label: 'Coupons', path: '/admin/coupons' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <AnalyticsIcon />,
    path: '/admin/analytics',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon />,
    path: '/admin/settings',
  },
];

const AdminSidebar = ({ open, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedItems, setExpandedItems] = useState({
    products: true,
    users: true,
    orders: true,
  });

  // const drawerWidth = 280;

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
        <Box className="admin-drawer-header">
          <Typography
            variant="h6"
            className="admin-drawer-title"
          >
            Admin Panel
          </Typography>
      </Box>

      {/* Navigation */}
      <List className="admin-nav-list">
        {navigationItems.map(renderNavigationItem)}
      </List>

      {/* Footer */}
      <Box className="admin-drawer-footer">
        <Typography
          variant="caption"
          className="admin-drawer-footer-text"
        >
          Mankind Admin v1.0
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
          keepMounted: true, // Better open performance on mobile.
        }}
        className="admin-mobile-drawer"
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        className={`admin-desktop-drawer ${!open ? 'closed' : ''}`}
        open={open && !isMobile}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default AdminSidebar;
