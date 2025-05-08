import React, { useState, useEffect } from 'react';
import styles from './ProfilePage.module.css';
import './accountpage.css';
import { NavLink, useNavigate } from 'react-router-dom';
import AccountNavigation from './AccountNavigation'; // Adjust the import path as necessary
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
    fetch('/api/profile')
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
        console.error('Error fetching profile:', err);
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
    <div className={styles.profileCard}>
      <div style={{ textAlign: 'right', marginBottom: '15px' }}>
        <button id="editProfileButton" className={styles.editButton} onClick={handleEditProfileClick}>
          Edit Profile
        </button>
      </div>
      <h2>Your Profile</h2>
      <div className={styles.profileInfo}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Name</span>
          <span className={styles.value}>{profile.fullName || 'N/A'}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Email</span>
          <span className={styles.value}>{profile.email || 'N/A'}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Mobile number</span>
          {profile.mobileNumber ? (
            <div className={styles.mobileInfo}>
              <span className={styles.value}>{profile.mobileNumber}</span>
              <p className={styles.securityNote}>
                <span style={{ color: 'orange', fontSize: '1.2em' }}>⚠️</span>
                For stronger account security, add your mobile number. If there's an
                unusual sign-in, we'll text you and verify that it's really you.
              </p>
            </div>
          ) : (
            <button className={styles.addButton} onClick={handleAddMobile}>Add</button>
          )}
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Username</span>
          <span className={styles.value}>{profile.username || 'N/A'}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Password</span>
          <span className={styles.value}>********</span>
        </div>
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

const ProfilePage = () => (
  <div className={styles.profilePageContainer}>
    <AccountNavigation />
    <ProfilePageContent />
  </div>
);

export default withLayout(ProfilePage);