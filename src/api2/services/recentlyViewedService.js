import { api } from '../client';

/**
 * Recently Viewed Products Service
 * Handles all recently viewed products-related API calls
 */

/**
 * @typedef {Object} RecentlyViewedProduct
 * @property {number} id - ID of the recently viewed product entry
 * @property {number} userId - ID of the user who viewed the product
 * @property {Object} product - Product details (ProductResponseDTO)
 * @property {string} viewedAt - Date and time when the product was first viewed (ISO string)
 * @property {string} lastViewedAt - Date and time when the product was last viewed (ISO string)
 */

const recentlyViewedService = {
  /**
   * Get user's recently viewed products
   * @returns {Promise<RecentlyViewedProduct[]>} Array of recently viewed products
   */
  getRecentlyViewed: () => 
    api.product.get('/recently-viewed'),

  /**
   * Add a product to recently viewed
   * @param {number} productId - Product ID to add to recently viewed
   * @returns {Promise<RecentlyViewedProduct>} Added product with timestamp
   */
  addToRecentlyViewed: (productId) => 
    api.product.post(`/recently-viewed?productId=${productId}`),

  /**
   * Remove a product from recently viewed
   * @param {number} productId - Product ID to remove from recently viewed
   * @returns {Promise<void>}
   */
  removeFromRecentlyViewed: (productId) => 
    api.product.delete(`/recently-viewed?productId=${productId}`),

  /**
   * Clear all recently viewed products
   * @returns {Promise<void>}
   */
  clearRecentlyViewed: () => 
    api.product.delete('/recently-viewed/clear')
};

export default recentlyViewedService; 