import React from 'react';
import { Box, Typography, Link, Container, Divider, Stack } from '@mui/material';

const SupplierFooter = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 6, 
        mt: 'auto',
        background: 'transparent',
        position: 'relative',
        zIndex: 1
      }}
    >
      <Container maxWidth="xl">
        <Divider sx={{ mb: 4, borderColor: 'rgba(226, 232, 240, 0.6)' }} />
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          justifyContent="space-between" 
          alignItems="center" 
          spacing={3}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-1px', color: 'var(--slate-800)', mb: 0.5, fontSize: '1.1rem' }}>
              MANKIND<span style={{ color: 'var(--primary)' }}>MATRIX</span>
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--slate-500)', fontWeight: 600 }}>
              &copy; {new Date().getFullYear()} Mankind Matrix Technologies. Supplier Infrastructure v2.4.0
            </Typography>
          </Box>

          <Stack direction="row" spacing={4}>
            {['Status', 'Documentation', 'API Reference', 'Support', 'Privacy'].map((item) => (
              <Link 
                key={item} 
                href="#" 
                underline="none" 
                sx={{ 
                  color: 'var(--slate-500)', 
                  fontSize: '0.8rem', 
                  fontWeight: 700,
                  '&:hover': { color: 'var(--primary)' },
                  transition: 'color 0.2s'
                }}
              >
                {item}
              </Link>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default SupplierFooter;
