import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import withLayout from '../../../../layouts/HOC/withLayout';
import useUser from '../../../../hooks/useUser';
import { toast } from 'react-toastify';

const UserAddressesPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = useMemo(() => Number(id), [id]);
  const headerRef = useRef(null);
  const {
    selectedUser,
    selectedUserAddresses,
    loading,
    getUserById,
    getUserAddresses,
    saveUserAddress,
    removeUserAddress,
    createUserAddress
  } = useUser();

  const [openEdit, setOpenEdit] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const isLoadingList = loading.fetchUserAddresses;
  const isSaving = loading.updateUserAddress || loading.createUserAddress;

  useEffect(() => {
    const load = async () => {
      try {
        if (!selectedUser || selectedUser.id !== userId) {
          await getUserById(userId);
        }
        await getUserAddresses(userId);
      } catch (err) {
        toast.error((err && err.message) || 'Failed to load addresses');
      }
    };
    load();
    // Move focus to the page header to avoid focus remaining on hidden ancestors
    setTimeout(() => {
      try { headerRef.current && headerRef.current.focus && headerRef.current.focus(); } catch(_) {}
    }, 0);
  }, [userId, getUserById, getUserAddresses, selectedUser]);

  const handleBack = () => navigate('/admin/users');

  const blurActiveElement = () => {
    try { if (document.activeElement && typeof document.activeElement.blur === 'function') { document.activeElement.blur(); } } catch (_) {}
  };

  const handleEdit = (address) => {
    blurActiveElement();
    setEditingAddress({ ...address });
    setOpenEdit(true);
  };

  const handleDelete = async (address) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await removeUserAddress(userId, address.id);
      toast.success('Address deleted');
      await getUserAddresses(userId);
    } catch (err) {
      toast.error((err && err.message) || 'Failed to delete address');
    }
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditingAddress(null);
    // Return focus to a safe, visible element
    setTimeout(() => {
      try { headerRef.current && headerRef.current.focus && headerRef.current.focus(); } catch(_) {}
    }, 0);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress?.id) {
        await saveUserAddress(userId, editingAddress.id, {
          streetAddress: editingAddress.streetAddress,
          city: editingAddress.city,
          state: editingAddress.state,
          postalCode: editingAddress.postalCode,
          country: editingAddress.country,
          isDefault: !!editingAddress.isDefault,
        });
        toast.success('Address updated');
      } else {
        await createUserAddress(userId, {
          addressType: editingAddress.addressType || 'shipping',
          isDefault: !!editingAddress.isDefault,
          streetAddress: editingAddress.streetAddress,
          city: editingAddress.city,
          state: editingAddress.state,
          postalCode: editingAddress.postalCode,
          country: editingAddress.country,
        });
        toast.success('Address created');
      }
      await getUserAddresses(userId);
      handleCloseEdit();
    } catch (err) {
      toast.error((err && err.message) || 'Failed to update address');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button variant="text" startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Back to Users
          </Button>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }} tabIndex={-1} ref={headerRef}>
            {`Manage Addresses${selectedUser ? ` — ${(
              selectedUser.firstName || selectedUser.lastName
            ) ? `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() : (selectedUser.username || '')}` : ''}`}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            try { if (document.activeElement?.blur) document.activeElement.blur(); } catch(_) {}
            setEditingAddress({ addressType: 'shipping', isDefault: false, streetAddress: '', city: '', state: '', postalCode: '', country: '' });
            setOpenEdit(true);
          }}
        >
          Add Address
        </Button>
      </Box>

      {isLoadingList ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Street</TableCell>
                <TableCell>City</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Postal Code</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Default</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(!selectedUserAddresses || selectedUserAddresses.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">No addresses found.</TableCell>
                </TableRow>
              ) : (
                selectedUserAddresses.map(addr => (
                  <TableRow key={addr.id}>
                    <TableCell>{addr.addressType}</TableCell>
                    <TableCell>{addr.streetAddress}</TableCell>
                    <TableCell>{addr.city}</TableCell>
                    <TableCell>{addr.state}</TableCell>
                    <TableCell>{addr.postalCode}</TableCell>
                    <TableCell>{addr.country}</TableCell>
                    <TableCell>{addr.isDefault ? 'Yes' : 'No'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit address">
                        <IconButton color="primary" size="small" onClick={() => handleEdit(addr)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete address">
                        <IconButton color="error" size="small" onClick={() => handleDelete(addr)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Address</DialogTitle>
        <Box component="form" onSubmit={handleSave}>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {!editingAddress?.id && (
                <FormControl fullWidth required>
                  <InputLabel id="address-type-label">Address Type</InputLabel>
                  <Select
                    labelId="address-type-label"
                    label="Address Type"
                    value={editingAddress?.addressType || 'shipping'}
                    onChange={(e) => setEditingAddress(prev => ({ ...prev, addressType: e.target.value }))}
                  >
                    <MenuItem value="shipping">Shipping</MenuItem>
                    <MenuItem value="billing">Billing</MenuItem>
                  </Select>
                </FormControl>
              )}
              <TextField
                label="Street Address"
                fullWidth
                value={editingAddress?.streetAddress || ''}
                onChange={(e) => setEditingAddress(prev => ({ ...prev, streetAddress: e.target.value }))}
                required
              />
              <TextField
                label="City"
                fullWidth
                value={editingAddress?.city || ''}
                onChange={(e) => setEditingAddress(prev => ({ ...prev, city: e.target.value }))}
                required
              />
              <TextField
                label="State"
                fullWidth
                value={editingAddress?.state || ''}
                onChange={(e) => setEditingAddress(prev => ({ ...prev, state: e.target.value }))}
                required
              />
              <TextField
                label="Postal Code"
                fullWidth
                value={editingAddress?.postalCode || ''}
                onChange={(e) => setEditingAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                required
              />
              <TextField
                label="Country"
                fullWidth
                value={editingAddress?.country || ''}
                onChange={(e) => setEditingAddress(prev => ({ ...prev, country: e.target.value }))}
                required
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!editingAddress?.isDefault}
                    onChange={(e) => setEditingAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                  />
                }
                label="Default address"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit} disabled={isSaving}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default withLayout(UserAddressesPage);


