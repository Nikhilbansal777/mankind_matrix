import { api } from '../client';

/**
 * User Service
 * Handles all user-related API calls (excluding authentication)
 */

/**
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} username - Username
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} email - Email address
 * @property {string} role - User role
 * @property {boolean} active - User active status
 * @property {string} profilePictureUrl - Profile picture URL
 * @property {string} createTime - Creation timestamp
 * @property {string} updateTime - Last update timestamp
 */

/**
 * @typedef {Object} UserInput
 * @property {string} username - Username
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} email - Email address
 * @property {string} role - User role (e.g., "ADMIN", "USER")
 */

const userService = {
  /**
   * Get current user profile
   * @returns {Promise<User>} Current user details
   */
  getCurrentUser: () => 
    api.user.get('/me'),

  /**
   * Update user profile
   * @param {Partial<UserInput>} data - Updated user data
   * @returns {Promise<User>} Updated user details
   */
  updateProfile: (data) => 
    api.user.put('/profile', data),

  /**
   * Change password
   * @param {Object} data - Password change data
   * @param {string} data.currentPassword - Current password
   * @param {string} data.newPassword - New password
   * @returns {Promise<void>}
   */
  changePassword: (data) => 
    api.user.put('/change-password', data)

};

export default userService; 