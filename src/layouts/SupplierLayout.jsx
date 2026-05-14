import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import SupplierHeader from './components/supplier/SupplierHeader';
import SupplierFooter from './components/supplier/SupplierFooter';
import SupplierSidebar from './components/supplier/SupplierSidebar';

const SupplierLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        bgcolor: '#0b0f19',
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar Navigation */}
      <SupplierSidebar open={sidebarOpen} onToggle={handleToggleSidebar} />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <SupplierHeader onToggleSidebar={handleToggleSidebar} sidebarOpen={sidebarOpen} />
        
        <Box
          className="supplier-content-wrapper"
          sx={{
            p: { xs: 2, sm: 4, md: 5 },
            pt: { xs: '90px', md: '100px' }, // Spacing for fixed header
            flexGrow: 1,
            maxWidth: '1600px',
            width: '100%',
            mx: 'auto',
          }}
        >
          {children}
        </Box>
        
        <SupplierFooter />
      </Box>
    </Box>
  );
};

export default SupplierLayout;
