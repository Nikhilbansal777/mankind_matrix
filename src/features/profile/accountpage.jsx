import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './accountpage.css';
import withLayout from '../../layouts/HOC/withLayout';

const AccountPage = () => {
  useEffect(() => {
    // Initialize account page functionality
    if (window.app && typeof window.app.initAccountPage === 'function') {
      window.app.initAccountPage();
    } else {
      // Fallback initialization if the vanilla JS version isn't available
      initBoxInteractions();
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Fallback function if vanilla JS isn't available
  const initBoxInteractions = () => {
    const boxes = document.querySelectorAll('.account-box');
    boxes.forEach(box => {
      box.addEventListener('mouseenter', () => box.classList.add('box-hover'));
      box.addEventListener('mouseleave', () => box.classList.remove('box-hover'));
    });
  };

  return (
    <div className="account-container page" id="account-page">
      <h1>Your Account</h1>
      
      <div className="account-welcome">
        <div className="account-profile-image">
          <img src="/profile-account-picture.png" alt="Profile" />
        </div>
        <div className="account-greeting">
          <h2>Welcome, <span id="account-user-name">John Doe</span></h2>
          <p>Manage your account settings and preferences</p>
        </div>
      </div>
      
      <div className="account-boxes-container">
        <div className="account-box" id="orders-box">
          <h3>Your Orders</h3>
          <div className="account-box-content">
            <div className="account-box-icon">📦</div>
            <div className="account-box-links">
              <Link to="/orders/track">Track packages</Link>
              <Link to="/orders">View orders</Link>
              <Link to="/lists">Shopping lists</Link>
            </div>
          </div>
        </div>
        
        <div className="account-box" id="profile-box">
          <h3>Your Profile</h3>
          <div className="account-box-content">
            <div className="account-box-icon">👤</div>
            <div className="account-box-links">
              <Link to="/profile">Manage profile</Link>
              <Link to="/addresses">Your addresses</Link>
            </div>
          </div>
        </div>
        
        <div className="account-box" id="service-box">
          <h3>Customer Service</h3>
          <div className="account-box-content">
            <div className="account-box-icon">🛎️</div>
            <div className="account-box-links">
              <Link to="/contact">Contact us</Link>
              <Link to="/help">Get help</Link>
              <Link to="/faq">FAQ</Link>
            </div>
          </div>
        </div>
        
        <div className="account-box" id="payment-box">
          <h3>Payment Methods</h3>
          <div className="account-box-content">
            <div className="account-box-icon">💳</div>
            <div className="account-box-links">
              <Link to="/payments">Manage payment methods</Link>
              <Link to="/payments/add">Add a payment method</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="account-recent-activity">
        <h3>Recent Activity</h3>
        <div id="recent-activity-list" className="recent-activity-list">
          {/* This will be populated dynamically if there is any activity */}
          <div className="no-activity-message">No recent activity to show</div>
        </div>
      </div>
    </div>
  );
};

export default withLayout(AccountPage);