import { api } from '../client';

/**
 * Category Service
 * Handles all category-related API calls
 * Categories are returned in a tree structure
 */

/**
 * @typedef {Object} Category
 * @property {number} id - Category ID
 * @property {string} name - Category name
 * @property {string} description - Category description
 * @property {number|null} parentId - ID of parent category (null for root categories)
 * @property {string[]} subcategories - Array of subcategory IDs
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} CategoryInput
 * @property {string} name - Category name
 * @property {string} description - Category description
 * @property {number|null} parentId - ID of parent category (null for root categories)
 */

const categoryService = {
  /**
   * Get all categories in a tree structure
   * @returns {Promise<Category[]>} Array of categories with their subcategories
   */
  getCategories: () => 
    api.product.get('/categories'),

  /**
   * Get a single category by ID
   * @param {number} id - Category ID
   * @returns {Promise<Category>} Category details with subcategories
   */
  getCategory: (id) => 
    api.product.get(`/categories/${id}`),

  /**
   * Create a new category
   * @param {CategoryInput} data - Category data
   * @returns {Promise<Category>} Created category
   */
  createCategory: (data) => 
    api.product.post('/categories', {
      name: data.name,
      description: data.description,
      parentId: data.parentId || null
    }),

  /**
   * Update an existing category
   * @param {number} id - Category ID to update
   * @param {CategoryInput} data - Updated category data
   * @returns {Promise<Category>} Updated category
   */
  updateCategory: (id, data) => {
    if (!data) {
      throw new Error('Update data cannot be null');
    }
    
    return api.product.put(`/categories/${id}`, {
      name: data.name,
      description: data.description,
      parentId: data.parentId || null
    });
  },

  /**
   * Delete a category
   * @param {number} id - Category ID to delete
   * @returns {Promise<void>}
   */
  deleteCategory: (id) => 
    api.product.delete(`/categories/${id}`)
};

export default categoryService; 