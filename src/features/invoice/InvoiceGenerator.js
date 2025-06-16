import React from 'react';
import { Box, Typography, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import withLayout from '../../layouts/HOC/withLayout';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  margin: theme.spacing(2),
  backgroundColor: '#ffffff',
  boxShadow: '0 0 20px rgba(0,0,0,0.08)',
  borderRadius: '12px',
  maxWidth: '1000px',
  margin: '0 auto',
  marginTop: '80px',
  position: 'relative',
  zIndex: 1,
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
  color: '#000000',
  fontWeight: 600,
}));

const SubHeaderTypography = styled(Typography)(({ theme }) => ({
  color: '#455a64',
  fontWeight: 500,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: '1px solid #e0e0e0',
  padding: theme.spacing(2),
  '&.MuiTableCell-head': {
    backgroundColor: '#f5f5f5',
    color: '#000000',
    fontWeight: 600,
  },
}));

const TotalBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8f9fa',
  padding: theme.spacing(3),
  borderRadius: '8px',
  marginTop: theme.spacing(4),
}));

const InvoiceGenerator = ({ orderData }) => {
  // This would typically come from your order data
  const invoiceData = {
    invoiceNumber: 'INV-2024-001',
    date: new Date().toLocaleDateString(),
    company: {
      name: 'Mankind Matrix',
      address: '123 Business Street',
      city: 'New York',
      country: 'USA',
      email: 'contact@mankindmatrix.com',
      phone: '+1 (555) 123-4567'
    },
    customer: {
      name: orderData?.customerName || 'John Doe',
      address: orderData?.customerAddress || '456 Customer Ave',
      city: orderData?.customerCity || 'New York',
      country: orderData?.customerCountry || 'USA',
      email: orderData?.customerEmail || 'customer@example.com'
    },
    items: orderData?.items || [
      { id: 1, name: 'Product 1', quantity: 2, price: 99.99 },
      { id: 2, name: 'Product 2', quantity: 1, price: 149.99 }
    ],
    paymentMethod: orderData?.paymentMethod || 'Credit Card',
    subtotal: 349.97,
    tax: 34.99,
    total: 384.96
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      py: 4,
      px: 2
    }}>
      <StyledPaper>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Grid container justifyContent="space-between" alignItems="flex-start">
            <Grid item xs={12} md={6}>
              <HeaderTypography variant="h4" gutterBottom>
                {invoiceData.company.name}
              </HeaderTypography>
              <Box sx={{ mt: 2 }}>
                <SubHeaderTypography variant="body1" sx={{ mb: 1 }}>
                  {invoiceData.company.address}
                </SubHeaderTypography>
                <SubHeaderTypography variant="body1" sx={{ mb: 1 }}>
                  {invoiceData.company.city}, {invoiceData.company.country}
                </SubHeaderTypography>
                <SubHeaderTypography variant="body1" sx={{ mb: 1 }}>
                  {invoiceData.company.email}
                </SubHeaderTypography>
                <SubHeaderTypography variant="body1">
                  {invoiceData.company.phone}
                </SubHeaderTypography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                backgroundColor: '#000000', 
                color: 'white', 
                p: 4, 
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transform: 'translateY(-10px)',
                position: 'relative'
              }}>
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    mb: 2
                  }}
                >
                  Invoice
                </Typography>
                <Box sx={{ 
                  borderTop: '1px solid rgba(255,255,255,0.2)',
                  pt: 2
                }}>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Invoice #: {invoiceData.invoiceNumber}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Date: {invoiceData.date}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Customer Information */}
        <Box sx={{ mb: 6 }}>
          <HeaderTypography variant="h6" gutterBottom>
            Bill To:
          </HeaderTypography>
          <Box sx={{ 
            backgroundColor: '#f8f9fa', 
            p: 3, 
            borderRadius: '8px',
            mt: 2
          }}>
            <SubHeaderTypography variant="body1" sx={{ mb: 1 }}>
              {invoiceData.customer.name}
            </SubHeaderTypography>
            <SubHeaderTypography variant="body1" sx={{ mb: 1 }}>
              {invoiceData.customer.address}
            </SubHeaderTypography>
            <SubHeaderTypography variant="body1" sx={{ mb: 1 }}>
              {invoiceData.customer.city}, {invoiceData.customer.country}
            </SubHeaderTypography>
            <SubHeaderTypography variant="body1">
              {invoiceData.customer.email}
            </SubHeaderTypography>
          </Box>
        </Box>

        {/* Items Table */}
        <TableContainer sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Item</StyledTableCell>
                <StyledTableCell align="right">Quantity</StyledTableCell>
                <StyledTableCell align="right">Price</StyledTableCell>
                <StyledTableCell align="right">Total</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoiceData.items.map((item) => (
                <TableRow key={item.id}>
                  <StyledTableCell>{item.name}</StyledTableCell>
                  <StyledTableCell align="right">{item.quantity}</StyledTableCell>
                  <StyledTableCell align="right">${item.price.toFixed(2)}</StyledTableCell>
                  <StyledTableCell align="right">
                    ${(item.quantity * item.price).toFixed(2)}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Totals */}
        <TotalBox>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <SubHeaderTypography variant="body1">Subtotal:</SubHeaderTypography>
            </Grid>
            <Grid item xs={6}>
              <SubHeaderTypography variant="body1" align="right">
                ${invoiceData.subtotal.toFixed(2)}
              </SubHeaderTypography>
            </Grid>
            <Grid item xs={6}>
              <SubHeaderTypography variant="body1">Tax (10%):</SubHeaderTypography>
            </Grid>
            <Grid item xs={6}>
              <SubHeaderTypography variant="body1" align="right">
                ${invoiceData.tax.toFixed(2)}
              </SubHeaderTypography>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            <Grid item xs={6}>
              <HeaderTypography variant="h6">Total:</HeaderTypography>
            </Grid>
            <Grid item xs={6}>
              <HeaderTypography variant="h6" align="right">
                ${invoiceData.total.toFixed(2)}
              </HeaderTypography>
            </Grid>
          </Grid>
        </TotalBox>

        {/* Payment Information */}
        <Box sx={{ 
          mt: 4, 
          p: 3, 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <SubHeaderTypography variant="body1" sx={{ mb: 1 }}>
            Payment Method: {invoiceData.paymentMethod}
          </SubHeaderTypography>
          <Typography variant="body2" color="text.secondary">
            Thank you for your business!
          </Typography>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default withLayout(InvoiceGenerator); 