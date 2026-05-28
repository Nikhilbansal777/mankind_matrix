import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchReviews,
  createReview,
  updateReview,
  deleteReview,
  selectReviews,
  selectReviewsLoading,
  selectReviewsError,
  selectReviewsPagination,
  selectCreateReviewLoading,
  selectUpdateReviewLoading,
  selectDeleteReviewLoading,
  clearReviews,
  clearError
} from '../redux/slices/reviewSlice';

export const useReviews = () => {
  const dispatch = useDispatch();

  // Selectors
  const reviews = useSelector(selectReviews);
  const loading = useSelector(selectReviewsLoading);
  const error = useSelector(selectReviewsError);
  const pagination = useSelector(selectReviewsPagination);
  const createLoading = useSelector(selectCreateReviewLoading);
  const updateLoading = useSelector(selectUpdateReviewLoading);
  const deleteLoading = useSelector(selectDeleteReviewLoading);

  // Fetch reviews for a product with pagination and sorting
  const getReviews = useCallback(async (productId, page = 0, size = 10, sort = []) => {
    try {
      await dispatch(fetchReviews({ productId, page, size, sort })).unwrap();
    } catch (err) {
      console.error('Error fetching reviews:', err);
      throw err;
    }
  }, [dispatch]);

  // Clear reviews
  const resetReviews = useCallback(() => {
    dispatch(clearReviews());
  }, [dispatch]);

  // Clear error
  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const createNewReview = useCallback(async (data) => {
    try {
      await dispatch(createReview(data)).unwrap();
    } catch (err) {
      console.error('Error creating review:', err);
      throw err;
    }
  }, [dispatch]);

  const updateExistingReview = useCallback(async (reviewId, data) => {
    try {
      await dispatch(updateReview({ reviewId, data })).unwrap();
    } catch (err) {
      console.error('Error updating review:', err);
      throw err;
    }
  }, [dispatch]);

  const deleteExistingReview = useCallback(async (reviewId) => {
    try {
      await dispatch(deleteReview(reviewId)).unwrap();
    } catch (err) {
      console.error('Error deleting review:', err);
      throw err;
    }
  }, [dispatch]);

  // Memoize the return value
  return useMemo(() => ({
    reviews,
    loading,
    error,
    pagination,
    getReviews,
    resetReviews,
    resetError,
    createReview: createNewReview,
    updateReview: updateExistingReview,
    deleteReview: deleteExistingReview,
    createLoading,
    updateLoading,
    deleteLoading,
  }), [reviews, loading, error, pagination, getReviews, resetReviews, resetError, createNewReview, updateExistingReview, deleteExistingReview, createLoading, updateLoading, deleteLoading]);
};

export default useReviews; 