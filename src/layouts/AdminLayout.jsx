import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { AdminHeader, AdminSidebar } from './components/admin';
import AdminFooter from './components/admin/AdminFooter';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed by default

  // Handle responsive sidebar behavior
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
    // On desktop, keep it closed by default (user can open manually)
  }, [isMobile]);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} onToggle={handleToggleSidebar} />

      {/* Header */}
      <AdminHeader 
        onToggleSidebar={handleToggleSidebar} 
        sidebarOpen={sidebarOpen}
      />

      {/* Main content area */}
      <Box
        component="main"
        className="admin-main-wrapper"
        sx={{
          marginTop: '64px', // Account for fixed header
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 64px)',
          position: 'relative',
          zIndex: 1,
          width: '100%', // Always full width
        }}
      >
        {/* Content */}
        <Box className="admin-content-wrapper">
          {children}
        </Box>
        
        {/* Footer */}
        <AdminFooter />
      </Box>
    </div>
  );
};

export default AdminLayout;
