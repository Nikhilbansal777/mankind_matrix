import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useUser from '../hooks/useUser';
import { manualLogout, initializeAuth } from '../redux/slices/userSlice';

// Create Auth Context
const AuthContext = createContext();

/**
 * AuthProvider Component
 * Provides authentication context and handles token management
 */
const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { 
    isAuthenticated, 
    token, 
    user, 
    loading,
    getCurrentUser
  } = useUser();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Check token expiration and logout if expired
  const checkTokenExpiration = () => {
    if (!token) return;

    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // If token is expired, logout
      if (payload.exp && payload.exp < currentTime) {
        dispatch(manualLogout());
      }
    } catch (error) {
      console.error('Error checking token expiration:', error);
      // If token is malformed, logout
      dispatch(manualLogout());
    }
  };

  // Set up token expiration check interval
  useEffect(() => {
    if (isAuthenticated && token) {
      // Check immediately
      checkTokenExpiration();
      
      // Set up interval to check every minute
      const interval = setInterval(checkTokenExpiration, 60000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token]);

  // Fetch current user on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && !user) {
      getCurrentUser().catch(() => {
        // If fetching user fails, logout
        dispatch(manualLogout());
      });
    }
  }, [isAuthenticated, user, getCurrentUser, dispatch]);

  // Handle page visibility change to refresh token when user returns
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated && token) {
        checkTokenExpiration();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, token]);

  // Context value
  const contextValue = {
    isAuthenticated,
    user,
    token,
    loading,
    checkTokenExpiration
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 