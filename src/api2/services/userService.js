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
   * Get all users
   * @returns {Promise<User[]>} List of users
   */
  getUsers: (params = {}) => 
    api.user.get('/', params),
  /**
   * Get user by id
   * @param {number|string} id - User ID
   * @returns {Promise<User>} User details
   */
  getById: (id) =>
    api.user.get(`/${id}`),
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
   * Update user by id (admin)
   * @param {number|string} id - User ID
   * @param {Partial<UserInput> & { customAttributes?: Record<string, any> }} data - Updated user data
   * @returns {Promise<User>} Updated user details
   */
  updateById: (id, data) =>
    api.user.put(`/${id}`, data),

  /**
   * Admin: Get addresses for a specific user
   * @param {number|string} userId
   * @returns {Promise<Array>} List of addresses
   */
  getUserAddresses: (userId) =>
    api.user.get(`/${userId}/addresses`),

  /**
   * Admin: Update a user's address
   * @param {number|string} userId
   * @param {number|string} addressId
   * @param {Object} data
   * @returns {Promise<Object>} Updated address
   */
  updateUserAddress: (userId, addressId, data) =>
    api.user.put(`/${userId}/addresses/${addressId}`, data),

  /**
   * Admin: Delete a user's address
   * @param {number|string} userId
   * @param {number|string} addressId
   * @returns {Promise<void>}
   */
  deleteUserAddress: (userId, addressId) =>
    api.user.delete(`/${userId}/addresses/${addressId}`),

  /**
   * Admin: Create a user's address
   * @param {number|string} userId
   * @param {Object} data
   * @returns {Promise<Object>} Created address
   */
  createUserAddress: (userId, data) =>
    api.user.post(`/${userId}/addresses`, data),

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