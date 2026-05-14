import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import SupplierLayout from '../../../layouts/SupplierLayout';
import { Store as StoreIcon } from '@mui/icons-material';

const SupplierStorePage = () => {
  return (
    <SupplierLayout>
      <Box sx={{ pb: 8, position: 'relative', minHeight: '100vh' }}>
        <div className="mesh-background" />
        
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Header */}
          <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
                width: 52, height: 52, borderRadius: '16px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: '#10b98110', color: '#10b981',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.15)'
            }}>
                <StoreIcon />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-1.5px', mb: 0.5 }}>
                My <span style={{ color: '#10b981' }}>Store</span>
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 600 }}>
                Manage your storefront details and policies.
              </Typography>
            </Box>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Paper className="glass-card" sx={{ p: 6, borderRadius: '36px', textAlign: 'center', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
             <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>Store Settings Coming Soon</Typography>
             <Typography variant="body1" sx={{ color: '#64748b', maxWidth: '500px' }}>This page will allow you to update your store logo, banner, return policies, and business information.</Typography>
          </Paper>
        </motion.div>
      </Box>
    </SupplierLayout>
  );
};

export default SupplierStorePage;
