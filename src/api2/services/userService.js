import { api } from '../client';

/**
 * User Service
 * Handles all user-related API calls including authentication
 */

/**
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} username - Username
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} email - Email address
 * @property {string} role - User role
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} UserInput
 * @property {string} username - Username
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} email - Email address
 * @property {string} password - Password
 * @property {string} role - User role (e.g., "ADMIN", "USER")
 */

/**
 * @typedef {Object} LoginInput
 * @property {string} username - Username or email
 * @property {string} password - Password
 */

/**
 * @typedef {Object} AuthResponse
 * @property {User} user - User information
 * @property {string} token - JWT token
 * @property {string} refreshToken - Refresh token
 */

const userService = {
  /**
   * Get all users
   * @returns {Promise<User[]>} Array of users
   */
  getUsers: () => 
    api.user.get('/auth/users'),

  /**
   * Get a single user by ID
   * @param {number} id - User ID
   * @returns {Promise<User>} User details
   */
  getUser: (id) => 
    api.user.get(`/auth/users/${id}`),

  /**
   * Create a new user (register)
   * @param {UserInput} data - User data
   * @returns {Promise<AuthResponse>} Created user with tokens
   */
  createUser: (data) => 
    api.user.post('/auth/register', {
      username: data.username,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    }),

  /**
   * User login
   * @param {LoginInput} data - Login credentials
   * @returns {Promise<AuthResponse>} User details with tokens
   */
  loginUser: (data) => 
    api.user.post('/auth/login', {
      username: data.username,
      password: data.password,
    }),

  /**
   * Logout user
   * @param {number} id - User ID to logout
   * @returns {Promise<void>}
   */
  logoutUser: (id) => 
    api.user.post(`/auth/logout/${id}`),

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<{token: string}>} New access token
   */
  refreshToken: (refreshToken) => 
    api.user.post('/auth/refresh', { refreshToken }),

  /**
   * Get current user profile
   * @returns {Promise<User>} Current user details
   */
  getCurrentUser: () => 
    api.user.get('/auth/me'),

  /**
   * Update user profile
   * @param {Partial<UserInput>} data - Updated user data
   * @returns {Promise<User>} Updated user details
   */
  updateProfile: (data) => 
    api.user.put('/auth/profile', data),

  /**
   * Change password
   * @param {Object} data - Password change data
   * @param {string} data.currentPassword - Current password
   * @param {string} data.newPassword - New password
   * @returns {Promise<void>}
   */
  changePassword: (data) => 
    api.user.put('/auth/change-password', data)
};

export default userService; 