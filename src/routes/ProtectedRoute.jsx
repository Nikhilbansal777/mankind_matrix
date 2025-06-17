import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useUser from '../hooks/useUser';

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authenticated
 * @param {boolean} props.requireAuth - Whether authentication is required (default: true)
 * @param {string} props.redirectTo - Where to redirect if not authenticated (default: '/login')
 * @param {string[]} props.allowedRoles - Array of allowed roles (optional)
 */
const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login',
  allowedRoles = []
}) => {
  const { isAuthenticated, user, loading } = useUser();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading.currentUser) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // If authentication is not required, render children
  if (!requireAuth) {
    return children;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has required role
  if (allowedRoles.length > 0 && user) {
    const userRole = user.role || 'user'; // Default role if not specified
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authenticated and authorized, render children
  return children;
};

export default ProtectedRoute;
