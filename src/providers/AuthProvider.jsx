import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuth, getCurrentUser, selectUser, selectToken } from '../redux/slices/userSlice';

// Create Auth Context
const AuthContext = createContext();

/**
 * AuthProvider Component
 * Handles authentication state initialization and user data fetching
 */
const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const hasInitialized = useRef(false);

  // Initialize auth state from localStorage on mount (only once)
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      dispatch(initializeAuth());
    }
  }, [dispatch]);

  // Fetch user data if we have a token but no user (only once after initialization)
  useEffect(() => {
    if (hasInitialized.current && token && !user) {
      dispatch(getCurrentUser()).catch((error) => {
        console.error('Failed to fetch user data:', error);
      });
    }
  }, [token, user, dispatch]);

  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 