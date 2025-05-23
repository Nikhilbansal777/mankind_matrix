import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Tabs, Tab } from '@mui/material';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import SalesAnalytics from './SalesAnalytics';

const AdminPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Products" />
            <Tab label="Users" />
            <Tab label="Sales Analytics" />
          </Tabs>
        </Paper>

        {selectedTab === 0 && <ProductManagement />}
        {selectedTab === 1 && <UserManagement />}
        {selectedTab === 2 && <SalesAnalytics />}
      </Box>
    </Container>
  );
};

export default AdminPage;
