import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/slices/userSlice';
import { FaSignOutAlt } from 'react-icons/fa';
import NotificationsUI from '../../../features/profile/NotificationsUI';
import LogoutButton from '../../../features/auth/LogoutButton';
import './AdminHeader.css';

const AdminHeader = ({ onToggleSidebar, sidebarOpen }) => {
  const user = useSelector(selectUser);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    handleProfileMenuClose();
  };

  const handleSettings = () => {
    // TODO: Navigate to settings
    handleProfileMenuClose();
  };

  const open = Boolean(anchorEl);

  return (
    <AppBar
      position="fixed"
      className="admin-header-appbar"
    >
      <Toolbar>
        {/* Menu toggle button */}
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          edge="start"
          onClick={onToggleSidebar}
          className="admin-menu-toggle-btn"
        >
          <MenuIcon />
        </IconButton>

        <Link to="/" className="admin-logo-link">
          <Typography
            variant="h6"
            component="div"
            className="admin-title"
          >
            Mankind Matrix
          </Typography>
        </Link>

        {/* Right side actions */}
        <Box className="admin-right-actions">
          {/* User Profile - First */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            className="admin-user-profile-btn"
          >
            <Avatar className="admin-user-avatar">
              {user?.firstName?.[0] || user?.email?.[0] || 'A'}
            </Avatar>
          </IconButton>

          {/* Notifications */}
          <NotificationsUI />

          {/* Logout Button */}
          <LogoutButton 
            className="header-logout-btn"
            children={<FaSignOutAlt />}
            showConfirmation={true}
          />


          {/* Profile dropdown menu */}
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
            PaperProps={{
              elevation: 0,
              className: "admin-profile-menu"
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleProfileMenuClose}>
              <Avatar className="admin-menu-item-avatar" />
              <ListItemText
                primary={user?.firstName ? `${user.firstName} ${user.lastName}` : 'Admin User'}
                secondary={user?.email || 'admin@example.com'}
              />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleSettings}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
