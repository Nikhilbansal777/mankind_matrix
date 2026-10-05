import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import useUser from '../../hooks/useUser';

/**
 * LogoutButton Component
 * A simple button component that handles user logout
 */
const LogoutButton = ({ 
  className = '', 
  children = 'Logout',
  onLogout,
  showConfirmation = true 
}) => {
  const { logout, loading } = useUser();

  const handleLogout = async () => {
    if (showConfirmation) {
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (!confirmed) return;
    }

    try {
      await logout();
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading.logout}
      className={`logout-button ${className} ${loading.logout ? 'loading' : ''}`}
    >
      {loading.logout ? (
        <FaSpinner className="logout-spinner" />
      ) : (
        children
      )}
    </button>
  );
};

export default LogoutButton; 