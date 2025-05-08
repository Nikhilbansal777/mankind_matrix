import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './ProfilePage.module.css'; // Or wherever your shared styles are

const AccountNavigation = () => (
  <div className={styles.accountNavigationContainer}>
    <h3>Account Navigation</h3>
    <ul>
      <li>
        <NavLink to="/profile" className={({ isActive }) => isActive ? styles.active : ''}>
          Your Profile
        </NavLink>
      </li>
      <li>
        <NavLink to="/orders" className={({ isActive }) => isActive ? styles.active : ''}>
          Your Orders
        </NavLink>
      </li>
      <li>
        <NavLink to="/addresses" className={({ isActive }) => isActive ? styles.active : ''}>
          Your Addresses
        </NavLink>
      </li>
      <li>
        <NavLink to="/payments" className={({ isActive }) => isActive ? styles.active : ''}>
          Payment Methods
        </NavLink>
      </li>
      <li>
        <NavLink to="/help" className={({ isActive }) => isActive ? styles.active : ''}>
          Help & FAQ
        </NavLink>
      </li>
      {/* Add more navigation links here */}
    </ul>
  </div>
);

export default AccountNavigation;