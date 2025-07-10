import { api } from '../client';

/**
 * Address Service
 * Handles all address-related API calls
 */

/**
 * @typedef {Object} Address
 * @property {number} id - Address ID
 * @property {string} addressType - Type of address (e.g., "HOME", "WORK")
 * @property {string} streetAddress - Street address
 * @property {string} city - City
 * @property {string} state - State/Province
 * @property {string} postalCode - Postal code
 * @property {string} country - Country
 * @property {boolean} isDefault - Whether this is the default address
 * @property {string} createTime - Creation timestamp
 * @property {string} updateTime - Last update timestamp
 */

/**
 * @typedef {Object} AddressInput
 * @property {string} addressType - Type of address
 * @property {string} streetAddress - Street address
 * @property {string} city - City
 * @property {string} state - State/Province
 * @property {string} postalCode - Postal code
 * @property {string} country - Country
 * @property {boolean} isDefault - Whether this should be the default address
 */

const addressService = {
  /**
   * Get all addresses for the current user
   * @returns {Promise<Address[]>} Array of user addresses
   */
  getAddresses: () => 
    api.user.get('/addresses'),

  /**
   * Get a specific address by ID
   * @param {number} id - Address ID
   * @returns {Promise<Address>} Address details
   */
  getAddress: (id) => 
    api.user.get(`/addresses/${id}`),

  /**
   * Create a new address
   * @param {AddressInput} data - Address data
   * @returns {Promise<Address>} Created address
   */
  createAddress: (data) => 
    api.user.post('/addresses', {
      addressType: data.addressType,
      streetAddress: data.streetAddress,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
      isDefault: data.isDefault || false
    }),

  /**
   * Update an existing address
   * @param {number} id - Address ID to update
   * @param {AddressInput} data - Updated address data
   * @returns {Promise<Address>} Updated address
   */
  updateAddress: (id, data) => 
    api.user.put(`/addresses/${id}`, {
      addressType: data.addressType,
      streetAddress: data.streetAddress,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
      isDefault: data.isDefault || false
    }),

  /**
   * Delete an address
   * @param {number} id - Address ID to delete
   * @returns {Promise<void>}
   */
  deleteAddress: (id) => 
    api.user.delete(`/addresses/${id}`),

  /**
   * Set an address as default
   * @param {number} id - Address ID to set as default
   * @returns {Promise<Address>} Updated address
   */
  setDefaultAddress: (id) => 
    api.user.patch(`/addresses/${id}/default`, { isDefault: true })
};

export default addressService;
