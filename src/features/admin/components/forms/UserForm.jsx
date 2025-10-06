import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
  IconButton,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Close as CloseIcon } from '@mui/icons-material';
import useUser from '../../../../hooks/useUser';

const UserForm = ({ userId, open, onClose, onSuccess }) => {
  const { selectedUser, getUserById, updateUserById, loading } = useUser();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'USER',
    active: true,
    phone: ''
  });

  const isFetching = loading.fetchUserById;
  const isSaving = loading.updateUserById;

  useEffect(() => {
    if (open && userId) {
      getUserById(userId);
    }
  }, [open, userId, getUserById]);

  useEffect(() => {
    if (selectedUser && selectedUser.id === userId) {
      setFormData({
        username: selectedUser.username || '',
        email: selectedUser.email || '',
        firstName: selectedUser.firstName || '',
        lastName: selectedUser.lastName || '',
        role: selectedUser.role || 'USER',
        active: typeof selectedUser.active === 'boolean' ? selectedUser.active : true,
        phone: selectedUser.customAttributes?.phone || ''
      });
    }
  }, [selectedUser, userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      username: formData.username,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role,
      profilePictureUrl: selectedUser?.profilePictureUrl || '',
      customAttributes: {
        phone: formData.phone,
        preferredLanguage: 'en'
      }
    };
    try {
      await updateUserById(userId, payload);
      toast.success('User updated successfully');
      if (onSuccess) onSuccess();
    } catch (err) {
      const message = (err && (err.message || err.toString())) || 'Failed to update user';
      toast.error(message);
    }
  };

  const title = 'Edit User';

  return (
    <>
    <Box component="form" onSubmit={handleSubmit} sx={{ minWidth: 520 }}>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <IconButton 
          aria-label="close" 
          onClick={onClose} 
          sx={{ color: (theme) => theme.palette.grey[500], '&:hover': { color: (theme) => theme.palette.grey[700] } }}
          disabled={isSaving}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            fullWidth
            disabled={isFetching}
            autoFocus
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            disabled={isFetching}
          />
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            fullWidth
            disabled={isFetching}
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            fullWidth
            disabled={isFetching}
          />
          <FormControl fullWidth disabled={isFetching}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              label="Role"
              value={formData.role}
              onChange={handleChange}
            >
              <MenuItem value="USER">USER</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Checkbox checked={!!formData.active} onChange={handleChange} name="active" />}
            label="Active"
            sx={{ alignItems: 'center' }}
            disabled={isFetching}
          />
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>Custom Attributes</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            disabled={isFetching}
          />
          <TextField
            label="Preferred Language"
            value="en"
            fullWidth
            disabled
            helperText="Fixed to 'en'"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSaving}>Cancel</Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSaving || isFetching}
          startIcon={isSaving ? <CircularProgress size={20} /> : null}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Box>
    </>
  );
};

export default UserForm;


