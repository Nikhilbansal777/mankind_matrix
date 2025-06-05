import { api } from '../client';

/**
 * Product Service
 * Handles all product-related API calls
 */
const productService = {
  // Get all products with pagination and sorting
  getProducts: ({ 
    page = 0, 
    size = 10, 
    sort = [] 
  } = {}) => 
    api.product.get('/products', {
      page,
      size,
      sort: sort.length > 0 ? sort : undefined
    }),

  // Get a single product by ID
  getProduct: (id) => 
    api.product.get(`/products/${id}`),

  // Get products by category
  getProductsByCategory: (categoryId, { 
    page = 0, 
    size = 10, 
    sort = [] 
  } = {}) => 
    api.product.get(`/products/category/${categoryId}`, {
      page,
      size,
      sort: sort.length > 0 ? sort : undefined
    }),

  // Get featured products
  getFeaturedProducts: () =>
    api.product.get('/products/featured'),

  // Create a new product
  createProduct: (data) => 
    api.product.post('/products', {
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      sku: data.sku,
      brand: data.brand,
      model: data.model,
      specifications: data.specifications || null,
      images: data.images || [],
      isFeatured: data.isFeatured || false
    }),

  // Update a product
  updateProduct: (id, data) => {
    if (!data) {
      throw new Error('Update data cannot be null');
    }
    
    return api.product.put(`/products/${id}`, {
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      sku: data.sku,
      brand: data.brand,
      model: data.model,
      specifications: data.specifications || null,
      images: data.images || [],
      isFeatured: data.isFeatured || false
    });
  },

  // Set product as featured
  setProductFeatured: (id, isFeatured = true) => 
    api.product.patch(`/products/${id}/featured`, { isFeatured }),

  // Delete a product
  deleteProduct: (id) => 
    api.product.delete(`/products/${id}`)
};

export default productService;