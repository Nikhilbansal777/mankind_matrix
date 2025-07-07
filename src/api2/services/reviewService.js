import { api } from '../client';

/**
 * Review Service
 * Handles all review-related API calls
 */
const reviewService = {
  // Get all reviews for a product
  getReviews: (productId) =>
    api.product.get(`/reviews/product/${productId}`),

  // Create a new review
  submitReview: (data) =>
    api.product.post('/reviews', {
      userId: data.userId,
      productId: data.productId,
      rating: Number(data.rating),
      comment: data.comment,
    }),

  // Update a review
  updateReview: (reviewId, data) =>
    api.product.put(`/reviews/${reviewId}`, {
      userId: data.userId,
      productId: data.productId,
      rating: data.rating,
      comment: data.comment,
    }),

  // Delete a review
  deleteReview: (reviewId) =>
    api.product.delete(`/reviews/${reviewId}`),
};

export default reviewService; 