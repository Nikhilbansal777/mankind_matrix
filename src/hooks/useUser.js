import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  updateUserProfile,
  changePassword,
  fetchUsers as fetchUsersThunk,
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectIsInitialized,
  selectCurrentUser,
  selectUsers,
  selectUsersPagination,
  selectUserLoading,
  selectUserError,
  clearError,
  clearCurrentUser,
  manualLogout
} from '../redux/slices/userSlice';

export const useUser = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitialized = useSelector(selectIsInitialized);
  const currentUser = useSelector(selectCurrentUser);
  const users = useSelector(selectUsers);
  const usersPagination = useSelector(selectUsersPagination);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  // Simple token validation
  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  };

  // Check if user is actually authenticated with valid token
  const isActuallyAuthenticated = isAuthenticated && token && isTokenValid(token);

  // Authentication actions
  const login = useCallback(async (credentials) => {
    try {
      await dispatch(loginUser(credentials)).unwrap();
      return true;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  }, [dispatch]);

  const register = useCallback(async (userData) => {
    try {
      await dispatch(registerUser(userData)).unwrap();
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (err) {
      console.error('Logout error:', err);
      dispatch(manualLogout());
    }
  }, [dispatch]);

  // User management actions
  const fetchCurrentUser = useCallback(async () => {
    try {
      await dispatch(getCurrentUser()).unwrap();
    } catch (err) {
      console.error('Error fetching current user:', err);
      throw err;
    }
  }, [dispatch]);

  const updateProfile = useCallback(async (userData) => {
    try {
      await dispatch(updateUserProfile(userData)).unwrap();
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  }, [dispatch]);

  const changeUserPassword = useCallback(async (passwordData) => {
    try {
      await dispatch(changePassword(passwordData)).unwrap();
    } catch (err) {
      console.error('Error changing password:', err);
      throw err;
    }
  }, [dispatch]);

  // Admin: fetch all users
  const getUsers = useCallback(async (page = 0, size = 10, sort = []) => {
    try {
      const result = await dispatch(fetchUsersThunk({ page, size, sort: sort && sort.length > 0 ? sort : undefined })).unwrap();
      return result;
    } catch (err) {
      console.error('Error fetching users:', err);
      return [];
    }
  }, [dispatch]);

  // Utility actions
  const clearUserError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearCurrentUserData = useCallback(() => {
    dispatch(clearCurrentUser());
  }, [dispatch]);

  return {
    // State
    user: user || currentUser,
    token,
    isAuthenticated: isActuallyAuthenticated, // Use validated authentication state
    isInitialized,
    currentUser,
    users,
    usersPagination,
    loading,
    error,
    
    // Authentication actions
    login,
    register,
    logout,
    
    // User management actions
    getCurrentUser: fetchCurrentUser,
    updateProfile,
    changePassword: changeUserPassword,
    getUsers,
    
    // Utility actions
    clearError: clearUserError,
    clearCurrentUser: clearCurrentUserData,
    
    // Convenience getters
    isLoggedIn: isActuallyAuthenticated, // Use validated authentication state
    hasToken: !!token,
    userFullName: (user || currentUser) ? `${(user || currentUser).firstName} ${(user || currentUser).lastName}` : '',
    userInitials: (user || currentUser) ? `${(user || currentUser).firstName?.[0]}${(user || currentUser).lastName?.[0]}` : ''
  };
};

export default useUser; 