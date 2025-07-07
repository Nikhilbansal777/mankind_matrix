import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated, selectIsInitialized } from '../redux/slices/userSlice';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitialized = useSelector(selectIsInitialized);

  // Memoize the route decision to prevent unnecessary re-renders
  const routeDecision = useMemo(() => {
    // Wait for initialization before making any decisions
    if (!isInitialized) {
      return { type: 'loading', component: <div>Loading...</div> };
    }

    // Check authentication
    if (!isAuthenticated) {
      return { type: 'redirect', component: <Navigate to="/login" replace /> };
    }

    // Check role-based access if roles are specified
    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      return { type: 'redirect', component: <Navigate to="/" replace /> };
    }

    return { type: 'granted', component: children };
  }, [isAuthenticated, isInitialized, user, allowedRoles, children]);

  return routeDecision.component;
};

export default ProtectedRoute;
