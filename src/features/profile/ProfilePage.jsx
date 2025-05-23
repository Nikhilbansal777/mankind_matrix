import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AccountNavigation from './AccountNavigation';
import withLayout from '../../layouts/HOC/withLayout';

const ProfilePageContent = () => {
  const [profile, setProfile] = useState({
    fullName: 'Loading...',
    email: 'Loading...',
    mobileNumber: null,
    username: 'Loading...',
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set default profile initially
    const defaultProfile = {
      fullName: 'Guest User',
      email: 'guest@example.com',
      mobileNumber: null,
      username: 'guest',
    };
    setProfile(defaultProfile);

    // Fetch profile data from API
    axios('/api/profile')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setProfile(data);
      })
      .catch(err => {
        setError('Failed to load profile information.');
      });
  }, []);

  const handleEditProfileClick = () => {
    navigate('/edit-profile');
  };

  const handleAddMobile = () => {
    alert('Add mobile number functionality will be implemented here.');
  };

  return (
    <div className="profile-card">
      <div className="edit-button-container">
        <button 
          id="editProfileButton" 
          className="edit-button" 
          onClick={handleEditProfileClick}
        >
          Edit Profile
        </button>
      </div>
      <h2>Your Profile</h2>
      <div className="profile-info">
        <div className="info-item">
          <span className="label">Name</span>
          <span className="value">{profile.fullName || 'N/A'}</span>
        </div>
        <div className="info-item">
          <span className="label">Email</span>
          <span className="value">{profile.email || 'N/A'}</span>
        </div>
        <div className="info-item">
          <span className="label">Mobile number</span>
          {profile.mobileNumber ? (
            <div className="mobile-info">
              <span className="value">{profile.mobileNumber}</span>
              <p className="security-note">
                <span className="warning-icon">⚠️</span>
                For stronger account security, add your mobile number. If there's an
                unusual sign-in, we'll text you and verify that it's really you.
              </p>
            </div>
          ) : (
            <button className="add-button" onClick={handleAddMobile}>Add</button>
          )}
        </div>
        <div className="info-item">
          <span className="label">Username</span>
          <span className="value">{profile.username || 'N/A'}</span>
        </div>
        <div className="info-item">
          <span className="label">Password</span>
          <span className="value">********</span>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

const ProfilePage = () => (
  <div className="profile-page-container">
    <AccountNavigation />
    <ProfilePageContent />
  </div>
);

export default withLayout(ProfilePage);