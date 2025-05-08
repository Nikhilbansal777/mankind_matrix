import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './edit-profile.css';
import AccountNavigation from './AccountNavigation'; // Import the AccountNavigation component
import withLayout from '../../layouts/HOC/withLayout';

function EditProfile() {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    username: '',
    password: '********' // For display only
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Fetch profile data (replace with your actual API call)
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile', { // Replace with your actual API endpoint for fetching
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Include any necessary authorization headers
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data = await response.json();
        setProfile({ ...data, password: '********' }); // Add password placeholder
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage({ type: 'error', text: 'Failed to load profile information.' });
        // Optionally set a default profile in case of an error
        setProfile({
          fullName: 'Guest User',
          email: 'guest@example.com',
          mobileNumber: '',
          username: 'guestuser',
          password: '********'
        });
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));

    // Clear any error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!profile.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    }

    if (!profile.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (profile.mobileNumber && !/^\d{10}$/.test(profile.mobileNumber.replace(/\D/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (!profile.username.trim()) {
      newErrors.username = 'Username is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('/api/profile', { // Replace with your actual API endpoint for updating
        method: 'PUT', // Or 'POST', depending on your API
        headers: {
          'Content-Type': 'application/json',
          // Include any necessary authorization headers (e.g., JWT token)
          // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage({
          type: 'error',
          text: errorData.message || `Failed to update profile: ${response.status}`,
        });
        return;
      }

      const updatedProfileData = await response.json(); // Or just check for response.ok
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!',
      });
      setProfile(updatedProfileData); // Update local state with updated data

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);

    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: 'Error while updating your profile.',
      });
    }
  };

  return (
    <div className="edit-profile-page-container">
      <AccountNavigation />
      <div className="edit-profile-content">
        <h2>Edit Profile</h2>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={profile.mobileNumber}
              onChange={handleChange}
              placeholder="e.g., 555-123-4567"
              className={errors.mobileNumber ? 'error' : ''}
            />
            {errors.mobileNumber && <span className="error-text">{errors.mobileNumber}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                type="password"
                id="password"
                name="password"
                value={profile.password}
                disabled
              />
              <Link to="/change-password" className="change-password-link">Change</Link>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={() => window.history.back()}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withLayout(EditProfile);