import { api } from '../client';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

/**
 * @typedef {Object} RegisterInput
 * @property {string} username - Username
 * @property {string} email - Email address
 * @property {string} password - Password
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {Object} customAttributes - Custom user attributes
 */

/**
 * @typedef {Object} LoginInput
 * @property {string} username - Username
 * @property {string} password - Password
 */

/**
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} username - Username
 * @property {string} email - Email address
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} role - User role
 * @property {boolean} active - User active status
 * @property {string} createTime - Creation timestamp
 * @property {string} updateTime - Last update timestamp
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} access_token - JWT access token
 * @property {string} refresh_token - JWT refresh token
 * @property {number} expires_in - Token expiration time in seconds
 */

const authService = {
  /**
   * Register a new user
   * @param {RegisterInput} data - User registration data
   * @returns {Promise<User>} Created user details
   */
  register: (data) => 
    api.auth.post('/register', {
      username: data.username,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      customAttributes: data.customAttributes || {}
    }),

  /**
   * User login
   * @param {LoginInput} data - Login credentials
   * @returns {Promise<AuthResponse>} Authentication tokens
   */
  login: (data) => 
    api.auth.post('/login', {
      username: data.username,
      password: data.password,
    }),

  /**
   * User logout
   * @param {string} refreshToken - Refresh token to invalidate
   * @returns {Promise<void>}
   */
  logout: (refreshToken) => 
    api.auth.post('/logout', { refreshToken }),


};

export default authService; 