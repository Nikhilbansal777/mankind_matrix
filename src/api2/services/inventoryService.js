import { api } from '../client';

/**
 * Inventory Service
 * Handles all inventory-related API calls for products
 */

/**
 * @typedef {Object} InventoryInput
 * @property {number} price - Product price
 * @property {string} currency - Currency code (e.g., "USD")
 * @property {number} availableQuantity - Available quantity in stock
 * @property {number} maxQuantityPerPurchase - Maximum quantity allowed per purchase
 */

/**
 * @typedef {Object} Inventory
 * @property {number} id - Inventory record ID
 * @property {number} productId - Associated product ID
 * @property {string} productName - Associated product name
 * @property {number} price - Product price
 * @property {string} priceDisplay - Formatted price display string
 * @property {string} currency - Currency code
 * @property {number} availableQuantity - Available quantity in stock
 * @property {number} reservedQuantity - Quantity reserved in carts/orders
 * @property {number} soldQuantity - Total quantity sold
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 * @property {number} maxQuantityPerPurchase - Maximum quantity allowed per purchase
 */

const inventoryService = {
  /**
   * Get inventory information for a product
   * @param {number} productId - Product ID to get inventory for
   * @returns {Promise<Inventory>} Inventory information
   */
  getInventory: (productId) => 
    api.product.get(`/inventory/${productId}`),

  /**
   * Create inventory record for a product
   * @param {number} productId - Product ID to create inventory for
   * @param {InventoryInput} data - Inventory data
   * @returns {Promise<Inventory>} Created inventory record
   */
  createInventory: (productId, data) => {
    if (!data) {
      throw new Error('Inventory data cannot be null');
    }

    return api.product.post(`/inventory/${productId}`, {
      price: data.price,
      currency: data.currency,
      availableQuantity: data.availableQuantity,
      maxQuantityPerPurchase: data.maxQuantityPerPurchase
    });
  },

  /**
   * Update inventory record for a product
   * @param {number} productId - Product ID to update inventory for
   * @param {InventoryInput} data - Updated inventory data
   * @returns {Promise<Inventory>} Updated inventory record
   */
  updateInventory: (productId, data) => {
    if (!data) {
      throw new Error('Update data cannot be null');
    }

    return api.product.put(`/inventory/${productId}`, {
      price: data.price,
      currency: data.currency,
      availableQuantity: data.availableQuantity,
      maxQuantityPerPurchase: data.maxQuantityPerPurchase
    });
  }
};

export default inventoryService; 