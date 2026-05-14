import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import SupplierLayout from '../../../layouts/SupplierLayout';
import { Settings as SettingsIcon } from '@mui/icons-material';

const SupplierSettingsPage = () => {
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
                bgcolor: '#64748b10', color: '#64748b',
                boxShadow: '0 8px 20px rgba(100, 116, 139, 0.15)'
            }}>
                <SettingsIcon />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-1.5px', mb: 0.5 }}>
                Account <span style={{ color: '#64748b' }}>Settings</span>
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 600 }}>
                Manage your profile, billing, and notifications.
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
             <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>Settings Coming Soon</Typography>
             <Typography variant="body1" sx={{ color: '#64748b', maxWidth: '500px' }}>This page will let you manage your password, 2FA, payout methods, and team members.</Typography>
          </Paper>
        </motion.div>
      </Box>
    </SupplierLayout>
  );
};

export default SupplierSettingsPage;
