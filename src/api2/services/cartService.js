import { api } from '../client';

/**
 * Cart Service
 * Handles all cart-related API calls
 */

/**
 * @typedef {Object} CartItem
 * @property {number} id - Cart item ID
 * @property {number} productId - Product ID
 * @property {number} quantity - Item quantity
 * @property {number} price - Item price
 */

/**
 * @typedef {Object} Cart
 * @property {number} id - Cart ID
 * @property {number} userId - User ID
 * @property {string} sessionId - Session ID
 * @property {string} status - Cart status
 * @property {CartItem[]} items - Cart items
 * @property {number} subtotal - Cart subtotal
 * @property {number} total - Cart total
 */

/**
 * @typedef {Object} AddItemRequest
 * @property {number} productId - Product ID to add
 * @property {number} quantity - Quantity to add
 */

const cartService = {
  /**
   * Add item to cart (creates cart if doesn't exist)
   * @param {AddItemRequest} data - Item data to add
   * @returns {Promise<Cart>} Updated cart
   */
  addItem: (data) => {
    if (!data || !data.productId) {
      throw new Error('Product ID is required');
    }

    return api.cart.post('/items', {
      productId: data.productId,
      quantity: data.quantity || 1
    });
  },

  /**
   * Get current user's cart
   * @returns {Promise<Cart>} User's cart
   */
  getCart: () => 
    api.cart.get('/'),

  /**
   * Update item quantity in cart by product ID
   * @param {number} productId - Product ID to update
   * @param {number} quantity - New quantity
   * @returns {Promise<Cart>} Updated cart
   */
  updateItemQuantity: (productId, quantity) => {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    if (quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    return api.cart.patch(`/items/product/${productId}`, {
      quantity
    });
  },

  /**
   * Remove item from cart by product ID
   * @param {number} productId - Product ID to remove
   * @returns {Promise<Cart>} Updated cart
   */
  removeItem: (productId) => {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    return api.cart.delete(`/items/product/${productId}`);
  },

  /**
   * Clear entire cart by removing all items individually
   * @param {CartItem[]} items - Current cart items
   * @returns {Promise<Cart>} Empty cart
   */
  clearCart: async (items) => {
    if (!items || items.length === 0) {
      // If no items, just return empty cart structure
      return {
        id: null,
        userId: null,
        sessionId: null,
        status: null,
        items: [],
        subtotal: 0,
        total: 0
      };
    }

    // Remove all items one by one
    let currentCart = null;
    for (const item of items) {
      try {
        currentCart = await api.cart.delete(`/items/product/${item.productId}`);
      } catch (error) {
        console.error(`Error removing item ${item.productId}:`, error);
        // Continue with other items even if one fails
      }
    }

    return currentCart || {
      id: null,
      userId: null,
      sessionId: null,
      status: null,
      items: [],
      subtotal: 0,
      total: 0
    };
  }
};

export default cartService; 