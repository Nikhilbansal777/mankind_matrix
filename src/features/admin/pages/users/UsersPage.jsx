import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import withLayout from '../../../../layouts/HOC/withLayout';
import useUser from '../../../../hooks/useUser';
import Pagination from '../../../../components/Pagination/Pagination';
import UserForm from '../../components/forms/UserForm';

const UserManagement = () => {
  const { users, usersPagination, getUsers, loading, error } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [openForm, setOpenForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      const pageIndex = currentPage - 1;
      await getUsers(pageIndex, usersPerPage);
    };
    loadUsers();
  }, [getUsers, currentPage, usersPerPage]);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleOpenForm = useCallback((id) => {
    try {
      if (document && document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }
    } catch (_) {}
    setSelectedUserId(id);
    setOpenForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setOpenForm(false);
    setSelectedUserId(null);
  }, []);

  const handleFormSuccess = useCallback(async () => {
    // refresh the list and close
    const pageIndex = currentPage - 1;
    await getUsers(pageIndex, usersPerPage);
    handleCloseForm();
  }, [currentPage, usersPerPage, getUsers, handleCloseForm]);

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage user accounts, roles, and permissions.
        </Typography>
      </Box>
      
      {loading.fetchUsers ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {error && (
                <TableRow>
                  <TableCell colSpan={5}>Failed to load users.</TableCell>
                </TableRow>
              )}
              {!error && users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>No users found.</TableCell>
                </TableRow>
              )}
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user.username || user.email)}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role}
                      color={user.role === 'ADMIN' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.createTime ? new Date(user.createTime).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit user">
                      <IconButton aria-label="Edit user" color="primary" size="small" onClick={() => handleOpenForm(user.id)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      {usersPagination.totalPages > 1 && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            currentPage={currentPage}
            totalPages={usersPagination.totalPages}
            onPageChange={handlePageChange}
          />
        </Box>
      )}

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        {selectedUserId && (
          <UserForm
            userId={selectedUserId}
            open={openForm}
            onClose={handleCloseForm}
            onSuccess={handleFormSuccess}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default withLayout(UserManagement); 