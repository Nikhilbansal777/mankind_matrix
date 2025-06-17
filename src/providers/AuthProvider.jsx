import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useUser from '../hooks/useUser';
import { manualLogout } from '../redux/slices/userSlice';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

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
    getCurrentUser,
    refreshToken 
  } = useUser();

  // Check token expiration and refresh if needed
  const checkTokenExpiration = () => {
    if (!token) return;

    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // If token expires in less than 5 minutes, refresh it
      if (payload.exp && payload.exp - currentTime < 300) {
        refreshToken().catch(() => {
          // If refresh fails, logout
          dispatch(manualLogout());
        });
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