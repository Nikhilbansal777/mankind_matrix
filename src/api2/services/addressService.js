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

// Helper function to check if API is available
const isApiAvailable = () => {
  try {
    // Check if the api object exists and has the user property
    const isAvailable = api && api.user && typeof api.user.get === 'function';
    console.log('API availability check:', { 
      apiExists: !!api, 
      userExists: !!api?.user, 
      getMethodExists: typeof api?.user?.get === 'function',
      isAvailable,
      apiKeys: api ? Object.keys(api) : 'no api object'
    });
    return isAvailable;
  } catch (error) {
    console.warn('API not available:', error);
    return false;
  }
};

// Helper function to handle API calls with graceful fallback
const apiCall = async (apiCall, operation) => {
  if (!isApiAvailable()) {
    console.warn(`API not available for ${operation}, returning empty result`);
    // Return appropriate empty results instead of throwing errors
    if (operation === 'getAddresses') {
      return { data: [] };
    } else if (operation === 'getAddress') {
      return { data: null };
    } else if (operation === 'createAddress') {
      throw new Error('Cannot create address: API not available');
    } else if (operation === 'updateAddress') {
      throw new Error('Cannot update address: API not available');
    } else if (operation === 'deleteAddress') {
      throw new Error('Cannot delete address: API not available');
    } else if (operation === 'setDefaultAddress') {
      throw new Error('Cannot set default address: API not available');
    }
  }

  try {
    const response = await apiCall();
    // The API client returns data directly, so we wrap it in the expected format
    return { data: response };
  } catch (error) {
    console.error(`API call failed for ${operation}:`, error);
    
    // For getAddresses, return empty array instead of throwing
    if (operation === 'getAddresses') {
      console.warn('Returning empty addresses array due to API failure');
      return { data: [] };
    }
    
    throw error;
  }
};

const addressService = {
  /**
   * Get all addresses for the current user
   * @returns {Promise<Address[]>} Array of user addresses
   */
  getAddresses: async () => {
    console.log('getAddresses called');
    
    const result = await apiCall(
      () => api.user.get('me/addresses'),
      'getAddresses'
    );
    
    console.log('getAddresses result:', result);
    return result;
  },

  /**
   * Get a specific address by ID
   * @param {number} id - Address ID
   * @returns {Promise<Address>} Address details
   */
  getAddress: async (id) => {
    return apiCall(
      () => api.user.get(`me/addresses/${id}`),
      'getAddress'
    );
  },

  /**
   * Create a new address
   * @param {AddressInput} data - Address data
   * @returns {Promise<Address>} Created address
   */
  createAddress: async (data) => {
    // Always set address type as 'shipping' for new addresses
    const addressData = {
      ...data,
      addressType: 'shipping'
    };

    return apiCall(
      () => api.user.post('me/addresses', addressData),
      'createAddress'
    );
  },

  /**
   * Update an existing address
   * @param {number} id - Address ID to update
   * @param {AddressInput} data - Updated address data
   * @returns {Promise<Address>} Updated address
   */
  updateAddress: async (id, data) => {
    return apiCall(
      () => api.user.put(`me/addresses/${id}`, data),
      'updateAddress'
    );
  },

  /**
   * Delete an address
   * @param {number} id - Address ID to delete
   * @returns {Promise<void>}
   */
  deleteAddress: async (id) => {
    return apiCall(
      () => api.user.delete(`me/addresses/${id}`),
      'deleteAddress'
    );
  },


};

export default addressService;
