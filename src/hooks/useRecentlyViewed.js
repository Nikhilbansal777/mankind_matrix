import { useCallback, useMemo, useRef, useEffect } from 'react';
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
import { selectIsAuthenticated, selectIsInitialized } from '../redux/slices/userSlice';

export const useRecentlyViewed = () => {
  const dispatch = useDispatch();
  const hasFetchedRef = useRef(false);
  const fetchTimeoutRef = useRef(null);
  
  // Selectors
  const recentlyViewed = useSelector(selectRecentlyViewed);
  const loading = useSelector(selectRecentlyViewedLoading);
  const error = useSelector(selectRecentlyViewedError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitialized = useSelector(selectIsInitialized);

  // Fetch recently viewed products - memoized to prevent infinite calls
  const getRecentlyViewed = useCallback(async () => {
    // Don't make API calls until auth is initialized
    if (!isInitialized) {
      return;
    }
    
    if (!isAuthenticated) {
      console.warn('User not authenticated. Recently viewed products require authentication.');
      return;
    }
    
    // Prevent multiple calls with a timeout-based approach
    if (hasFetchedRef.current) {
      return;
    }
    
    try {
      hasFetchedRef.current = true;
      await dispatch(fetchRecentlyViewed()).unwrap();
    } catch (err) {
      console.error('Error fetching recently viewed products:', err);
      hasFetchedRef.current = false; // Reset on error to allow retry
    }
  }, [dispatch, isAuthenticated, isInitialized]);

  // Reset fetch flag when authentication changes - but only if it actually changes to a different value
  const prevAuthRef = useRef(isAuthenticated);
  useEffect(() => {
    if (prevAuthRef.current !== isAuthenticated) {
      hasFetchedRef.current = false;
      prevAuthRef.current = isAuthenticated;
    }
  }, [isAuthenticated]);

  // Auto-fetch when conditions are met
  useEffect(() => {
    // Only attempt to fetch if auth is initialized, user is authenticated, and we haven't fetched yet
    if (isInitialized && isAuthenticated && !hasFetchedRef.current) {
      // Use a small timeout to prevent double calls in StrictMode
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      
      fetchTimeoutRef.current = setTimeout(() => {
        getRecentlyViewed();
      }, 100);
    }
    
    // Cleanup function to clear the timeout if the component unmounts or dependencies change
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [isInitialized, isAuthenticated, getRecentlyViewed]); // Removed loading.fetch from dependencies
  // The `loading.fetch` state changing should not cause a re-fetch on its own.

  // Add product to recently viewed
  const addProductToRecentlyViewed = useCallback(async (productId) => {
    if (!isInitialized || !isAuthenticated) {
      console.warn('User not authenticated. Cannot add product to recently viewed.');
      return;
    }

    try {
      await dispatch(addToRecentlyViewed(productId)).unwrap();
      // After adding, reset hasFetchedRef to allow re-fetching the updated list
      hasFetchedRef.current = false;
    } catch (err) {
      console.error('Error adding product to recently viewed:', err);
    }
  }, [dispatch, isAuthenticated, isInitialized]);

  // Remove product from recently viewed
  const removeProductFromRecentlyViewed = useCallback(async (productId) => {
    if (!isInitialized || !isAuthenticated) {
      console.warn('User not authenticated. Cannot remove product from recently viewed.');
      return;
    }

    try {
      await dispatch(removeFromRecentlyViewed(productId)).unwrap();
      // After removing, reset hasFetchedRef to allow re-fetching the updated list
      hasFetchedRef.current = false;
    } catch (err) {
      console.error('Error removing product from recently viewed:', err);
    }
  }, [dispatch, isAuthenticated, isInitialized]);

  // Clear all recently viewed products
  const clearAllRecentlyViewed = useCallback(async () => {
    if (!isInitialized || !isAuthenticated) {
      console.warn('User not authenticated. Cannot clear recently viewed products.');
      return;
    }

    try {
      await dispatch(clearRecentlyViewed()).unwrap();
      // After clearing, reset hasFetchedRef to allow re-fetching the updated list
      hasFetchedRef.current = false;
    } catch (err) {
      console.error('Error clearing recently viewed products:', err);
    }
  }, [dispatch, isAuthenticated, isInitialized]);

  // Clear error
  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Reset fetch flag when authentication changes
  const resetFetchFlag = useCallback(() => {
    hasFetchedRef.current = false;
  }, []);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    // State
    recentlyViewed,
    loading,
    error,
    isAuthenticated,
    isInitialized,
    
    // Actions
    getRecentlyViewed,
    addToRecentlyViewed: addProductToRecentlyViewed,
    removeFromRecentlyViewed: removeProductFromRecentlyViewed,
    clearRecentlyViewed: clearAllRecentlyViewed,
    resetError,
    resetFetchFlag
  }), [
    recentlyViewed,
    loading,
    error,
    isAuthenticated,
    isInitialized,
    getRecentlyViewed,
    addProductToRecentlyViewed,
    removeProductFromRecentlyViewed,
    clearAllRecentlyViewed,
    resetError,
    resetFetchFlag
  ]);
};

export default useRecentlyViewed; 