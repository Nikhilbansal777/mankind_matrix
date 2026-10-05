import { api } from '../client';

/**
 * Review Service
 * Handles all review-related API calls
 */
const reviewService = {
  // Get all reviews for a product with pagination and sorting
  getReviews: ({ productId, page = 0, size = 10, sort = [] }) =>
    api.product.get(`/reviews/product/${productId}`, {
      page,
      size,
      ...(sort && sort.length > 0 ? { sort } : {})
    }),

  // Create a new review (POST /reviews)
  createReview: ({ productId, rating, comment }) =>
    api.product.post('/reviews', { productId, rating, comment }),

  // Update a review (PUT /reviews/{reviewId})
  updateReview: (reviewId, { productId, rating, comment }) =>
    api.product.put(`/reviews/${reviewId}`, { productId, rating, comment }),

  // Delete a review (DELETE /reviews/{reviewId})
  deleteReview: (reviewId) =>
    api.product.delete(`/reviews/${reviewId}`),
};

export default reviewService; 