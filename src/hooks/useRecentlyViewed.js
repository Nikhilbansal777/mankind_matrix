import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRecentlyViewed,
  addToRecentlyViewed,
  removeFromRecentlyViewed,
  clearRecentlyViewed,
  selectRecentlyViewed,
  selectRecentlyViewedLoading,
  selectRecentlyViewedError,
  clearError
} from '../redux/slices/recentlyViewedSlice';
import { selectIsAuthenticated } from '../redux/slices/userSlice';

export const useRecentlyViewed = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const recentlyViewed = useSelector(selectRecentlyViewed);
  const loading = useSelector(selectRecentlyViewedLoading);
  const error = useSelector(selectRecentlyViewedError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Fetch recently viewed products
  const getRecentlyViewed = useCallback(async () => {
    if (!isAuthenticated) {
      console.warn('User not authenticated. Recently viewed products require authentication.');
      return;
    }
    
    try {
      await dispatch(fetchRecentlyViewed()).unwrap();
    } catch (err) {
      console.error('Error fetching recently viewed products:', err);
    }
  }, [dispatch, isAuthenticated]);

  // Add product to recently viewed
  const addProductToRecentlyViewed = useCallback(async (productId) => {
    if (!isAuthenticated) {
      console.warn('User not authenticated. Cannot add product to recently viewed.');
      return;
    }

    try {
      await dispatch(addToRecentlyViewed(productId)).unwrap();
    } catch (err) {
      console.error('Error adding product to recently viewed:', err);
    }
  }, [dispatch, isAuthenticated]);

  // Remove product from recently viewed
  const removeProductFromRecentlyViewed = useCallback(async (productId) => {
    if (!isAuthenticated) {
      console.warn('User not authenticated. Cannot remove product from recently viewed.');
      return;
    }

    try {
      await dispatch(removeFromRecentlyViewed(productId)).unwrap();
    } catch (err) {
      console.error('Error removing product from recently viewed:', err);
    }
  }, [dispatch, isAuthenticated]);

  // Clear all recently viewed products
  const clearAllRecentlyViewed = useCallback(async () => {
    if (!isAuthenticated) {
      console.warn('User not authenticated. Cannot clear recently viewed products.');
      return;
    }

    try {
      await dispatch(clearRecentlyViewed()).unwrap();
    } catch (err) {
      console.error('Error clearing recently viewed products:', err);
    }
  }, [dispatch, isAuthenticated]);

  // Clear error
  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    // State
    recentlyViewed,
    loading,
    error,
    isAuthenticated,
    
    // Actions
    getRecentlyViewed,
    addToRecentlyViewed: addProductToRecentlyViewed,
    removeFromRecentlyViewed: removeProductFromRecentlyViewed,
    clearRecentlyViewed: clearAllRecentlyViewed,
    resetError
  }), [
    recentlyViewed,
    loading,
    error,
    isAuthenticated,
    getRecentlyViewed,
    addProductToRecentlyViewed,
    removeProductFromRecentlyViewed,
    clearAllRecentlyViewed,
    resetError
  ]);
};

export default useRecentlyViewed; 