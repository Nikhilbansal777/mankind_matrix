import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  updateUserProfile,
  changePassword,
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectCurrentUser,
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
    isAuthenticated,
    currentUser,
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
    
    // Utility actions
    clearError: clearUserError,
    clearCurrentUser: clearCurrentUserData,
    
    // Convenience getters
    isLoggedIn: isAuthenticated,
    hasToken: !!token,
    userFullName: (user || currentUser) ? `${(user || currentUser).firstName} ${(user || currentUser).lastName}` : '',
    userInitials: (user || currentUser) ? `${(user || currentUser).firstName?.[0]}${(user || currentUser).lastName?.[0]}` : ''
  };
};

export default useUser; 