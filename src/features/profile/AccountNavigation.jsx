import React from 'react';
import { NavLink } from 'react-router-dom';
import './ProfilePage.css'; // Changed to standard CSS import

const AccountNavigation = () => {
  // Array of navigation items
  const navItems = [
    { path: '/profile', label: 'Your Profile' },
    { path: '/orders', label: 'Your Orders' },
    { path: '/addresses', label: 'Your Addresses' },
    { path: '/payments', label: 'Payment Methods' },
    { path: '/help', label: 'Help & FAQ' }
  ];

  return (
    <div className="account-navigation-container">
      <h3>Account Navigation</h3>
      <ul className="account-navigation-list">
        {navItems.map((item) => (
          <li key={item.path} className="account-navigation-item">
            <NavLink 
              to={item.path} 
              className={({ isActive }) => 
                isActive ? 'account-navigation-link active' : 'account-navigation-link'
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountNavigation;