import { api } from '../client';

/**
 * Address Service
 * Handles all address-related API calls
 */

/**
 * @typedef {Object} Address
 * @property {number} id - Address ID
 * @property {number} userId - User ID
 * @property {string} addressType - Type of address (e.g., "shipping", "billing")
 * @property {string} streetAddress - Street address
 * @property {string} city - City
 * @property {string} state - State/Province
 * @property {string} postalCode - Postal code
 * @property {string} country - Country
 * @property {boolean} isDefault - Whether this is the default address
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} AddressInput
 * @property {string} streetAddress - Street address
 * @property {string} city - City
 * @property {string} state - State/Province
 * @property {string} postalCode - Postal code
 * @property {string} country - Country
 * @property {boolean} isDefault - Whether this should be the default address
 */

const wrapData = async (request) => ({ data: await request() });

const addressService = {
  /**
   * Get all addresses for the current user
   * @returns {Promise<Address[]>} Array of user addresses
   */
  getAddresses: async () => {
    return wrapData(() => api.user.get('/me/addresses'));
  },

  /**
   * Get a specific address by ID
   * @param {number} id - Address ID
   * @returns {Promise<Address>} Address details
   */
  getAddress: async (id) => {
    return wrapData(() => api.user.get(`/me/addresses/${id}`));
  },

  /**
   * Create a new address
   * @param {AddressInput} data - Address data
   * @returns {Promise<Address>} Created address
   */
  createAddress: async (data) => {
    const addressData = {
      ...data,
      addressType: data.addressType || 'shipping'
    };

    return wrapData(() => api.user.post('/me/addresses', addressData));
  },

  /**
   * Update an existing address
   * @param {number} id - Address ID to update
   * @param {AddressInput} data - Updated address data
   * @returns {Promise<Address>} Updated address
   */
  updateAddress: async (id, data) => {
    return wrapData(() => api.user.put(`/me/addresses/${id}`, data));
  },

  /**
   * Delete an address
   * @param {number} id - Address ID to delete
   * @returns {Promise<void>}
   */
  deleteAddress: async (id) => {
    return wrapData(() => api.user.delete(`/me/addresses/${id}`));
  },


};

export default addressService;
