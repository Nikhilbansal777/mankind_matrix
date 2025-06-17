import { useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshToken,
  getCurrentUser,
  updateUserProfile,
  changePassword,
  fetchUsers,
  fetchUserById,
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectCurrentUser,
  selectUsers,
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
  const currentUser = useSelector(selectCurrentUser);
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

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
      if (user?.id) {
        await dispatch(logoutUser(user.id)).unwrap();
      } else {
        // Manual logout if no user ID
        dispatch(manualLogout());
      }
    } catch (err) {
      console.error('Logout error:', err);
      // Force logout even if API fails
      dispatch(manualLogout());
    }
  }, [dispatch, user?.id]);

  const refreshUserToken = useCallback(async () => {
    try {
      await dispatch(refreshToken()).unwrap();
      return true;
    } catch (err) {
      console.error('Token refresh error:', err);
      throw err;
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

  const getAllUsers = useCallback(async () => {
    try {
      await dispatch(fetchUsers()).unwrap();
    } catch (err) {
      console.error('Error fetching users:', err);
      throw err;
    }
  }, [dispatch]);

  const getUserById = useCallback(async (id) => {
    try {
      await dispatch(fetchUserById(id)).unwrap();
    } catch (err) {
      console.error('Error fetching user by ID:', err);
      throw err;
    }
  }, [dispatch]);

  // Utility actions
  const clearUserError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearCurrentUserData = useCallback(() => {
    dispatch(clearCurrentUser());
  }, [dispatch]);

  // Auto-refresh token on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      // Check if token is about to expire (you can implement token expiration check here)
      // For now, we'll just fetch current user to validate the session
      fetchCurrentUser().catch(() => {
        // If fetching current user fails, try to refresh token
        refreshUserToken().catch(() => {
          // If refresh fails, logout
          dispatch(manualLogout());
        });
      });
    }
  }, [isAuthenticated, token, fetchCurrentUser, refreshUserToken, dispatch]);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    // State
    user,
    token,
    isAuthenticated,
    currentUser,
    users,
    loading,
    error,
    
    // Authentication actions
    login,
    register,
    logout,
    refreshToken: refreshUserToken,
    
    // User management actions
    getCurrentUser: fetchCurrentUser,
    updateProfile,
    changePassword: changeUserPassword,
    getUsers: getAllUsers,
    getUserById,
    
    // Utility actions
    clearError: clearUserError,
    clearCurrentUser: clearCurrentUserData,
    
    // Convenience getters
    isLoggedIn: isAuthenticated,
    hasToken: !!token,
    userFullName: user ? `${user.firstName} ${user.lastName}` : '',
    userInitials: user ? `${user.firstName?.[0]}${user.lastName?.[0]}` : ''
  }), [
    user,
    token,
    isAuthenticated,
    currentUser,
    users,
    loading,
    error,
    login,
    register,
    logout,
    refreshUserToken,
    fetchCurrentUser,
    updateProfile,
    changeUserPassword,
    getAllUsers,
    getUserById,
    clearUserError,
    clearCurrentUserData
  ]);
};

export default useUser; 