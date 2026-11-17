import { api } from '../client';
import config from '../config';
import { mockProducts } from '../../api/productService';

const parseMockPrice = (price) => {
  if (typeof price === 'number') return price;
  const numericPrice = Number(String(price || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(numericPrice) ? numericPrice : null;
};

const normalizeMockProduct = (product) => {
  const price = parseMockPrice(product.price);

  return {
    ...product,
    description: product.description || product.longDescription || product.shortDescription || '',
    shortDescription: product.shortDescription || product.description || '',
    images: product.images || (product.imageUrl ? [product.imageUrl] : []),
    isFeatured: product.isFeatured ?? product.featured ?? false,
    inventoryStatus: product.inventoryStatus || {
      status: 'IN_STOCK',
      availableQuantity: 25,
      price
    },
    averageRating: product.averageRating ?? 0
  };
};

const normalizedMockProducts = mockProducts.map(normalizeMockProduct);

const getMockProductsPage = ({ page = 0, size = 10 } = {}) => {
  const start = page * size;
  const content = normalizedMockProducts.slice(start, start + size);

  return {
    content,
    totalElements: normalizedMockProducts.length,
    totalPages: Math.ceil(normalizedMockProducts.length / size),
    size,
    number: page
  };
};

const withDevelopmentFallback = async (request, fallback) => {
  try {
    return await request();
  } catch (error) {
    const canUseLocalData =
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      [404, 502, 503, 504].includes(error.response?.status);

    if (config.isDev && canUseLocalData) {
      return fallback();
    }

    throw error;
  }
};

/**
 * Product Service
 * Handles all product-related API calls
 */
const productService = {
  // Get all products with pagination and sorting
  getProducts: ({ page = 0, size = 10, sort } = {}) =>
    withDevelopmentFallback(
      () => api.product.get('/products', {
        page,
        size,
        ...(sort && sort.length > 0 ? { sort } : {})
      }),
      () => getMockProductsPage({ page, size })
    ),

  // Get a single product by ID
  getProduct: (id) => 
    withDevelopmentFallback(
      () => api.product.get(`/products/${id}`),
      () => {
        const product = normalizedMockProducts.find(item => String(item.id) === String(id));
        if (!product) {
          throw new Error('Product not found');
        }
        return product;
      }
    ),

  // Get products by category
  getProductsByCategory: (categoryId, { page = 0, size = 10, sort } = {}) =>
    api.product.get(`/products/category/${categoryId}`, {
      page,
      size,
      ...(sort && sort.length > 0 ? { sort } : {})
    }),

  // Get featured products
  getFeaturedProducts: () =>
    withDevelopmentFallback(
      () => api.product.get('/products/featured'),
      () => normalizedMockProducts.filter(product => product.isFeatured)
    ),

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
