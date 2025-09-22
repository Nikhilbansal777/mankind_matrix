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
  Chip
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import withLayout from '../../../../layouts/HOC/withLayout';
import useUser from '../../../../hooks/useUser';
import Pagination from '../../../../components/Pagination/Pagination';

const UserManagement = () => {
  const { users, usersPagination, getUsers, loading, error } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

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
            {loading.fetchUsers && (
              <TableRow>
                <TableCell colSpan={5} align="center">Loading...</TableCell>
              </TableRow>
            )}
            {!error && users.length === 0 && !loading.fetchUsers && (
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
                  <IconButton disabled size="small">
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {usersPagination.totalPages > 1 && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          {/* Reuse existing Pagination component used in ProductsPage */}
          <Pagination
            currentPage={currentPage}
            totalPages={usersPagination.totalPages}
            onPageChange={handlePageChange}
          />
        </Box>
      )}

      {/* Details dialog removed until real endpoint is available */}
    </Box>
  );
};

export default withLayout(UserManagement); 