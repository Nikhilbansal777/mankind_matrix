import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCoupons,
  createCoupon,
  updateCoupon,
  deactivateCoupon,
  getCoupon,
  validateCoupon,
  selectCoupons,
  selectCurrentCoupon,
  selectValidatedCoupon,
  selectCouponsLoading,
  selectCouponsError,
  selectCouponsPagination,
  clearCurrentCoupon,
  clearValidatedCoupon,
  clearError
} from '../redux/slices/couponSlice';
import { useUser } from './useUser';

export const useCoupons = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isInitialized } = useUser();
  
  // Selectors
  const coupons = useSelector(selectCoupons);
  const currentCoupon = useSelector(selectCurrentCoupon);
  const validatedCoupon = useSelector(selectValidatedCoupon);
  const loading = useSelector(selectCouponsLoading);
  const error = useSelector(selectCouponsError);
  const pagination = useSelector(selectCouponsPagination);

  // Fetch coupons with pagination
  const getCoupons = useCallback(async (page = 0, size = 10, sort = ['createdAt,desc']) => {
    if (!isInitialized || !isAuthenticated) {
      throw new Error('You must be logged in to fetch coupons');
    }
    
    try {
      await dispatch(fetchCoupons({ page, size, sort })).unwrap();
    } catch (err) {
      console.error('Error fetching coupons:', err);
      throw err;
    }
  }, [dispatch, isInitialized, isAuthenticated]);

  // Create a new coupon
  const createNewCoupon = useCallback(async (couponData) => {
    if (!isInitialized || !isAuthenticated) {
      throw new Error('You must be logged in to create coupons');
    }
    
    try {
      const result = await dispatch(createCoupon(couponData)).unwrap();
      return result;
    } catch (err) {
      console.error('Error creating coupon:', err);
      throw err;
    }
  }, [dispatch, isInitialized, isAuthenticated]);

  // Update an existing coupon
  const updateExistingCoupon = useCallback(async (id, couponData) => {
    if (!isInitialized || !isAuthenticated) {
      throw new Error('You must be logged in to update coupons');
    }
    
    try {
      const result = await dispatch(updateCoupon({ id, couponData })).unwrap();
      return result;
    } catch (err) {
      console.error('Error updating coupon:', err);
      throw err;
    }
  }, [dispatch, isInitialized, isAuthenticated]);

  // Deactivate a coupon
  const deactivateExistingCoupon = useCallback(async (id) => {
    if (!isInitialized || !isAuthenticated) {
      throw new Error('You must be logged in to deactivate coupons');
    }
    
    try {
      await dispatch(deactivateCoupon(id)).unwrap();
    } catch (err) {
      console.error('Error deactivating coupon:', err);
      throw err;
    }
  }, [dispatch, isInitialized, isAuthenticated]);

  // Get a single coupon by ID
  const getCouponById = useCallback(async (id) => {
    if (!isInitialized || !isAuthenticated) {
      throw new Error('You must be logged in to fetch coupon details');
    }
    
    try {
      await dispatch(getCoupon(id)).unwrap();
    } catch (err) {
      console.error('Error fetching coupon:', err);
      throw err;
    }
  }, [dispatch, isInitialized, isAuthenticated]);

  // Validate coupon code
  const validateCouponCode = useCallback(async (code) => {
    if (!isInitialized || !isAuthenticated) {
      throw new Error('You must be logged in to validate coupons');
    }
    
    try {
      await dispatch(validateCoupon(code)).unwrap();
    } catch (err) {
      console.error('Error validating coupon:', err);
      throw err;
    }
  }, [dispatch, isInitialized, isAuthenticated]);



  // Clear current coupon
  const clearCoupon = useCallback(() => {
    dispatch(clearCurrentCoupon());
  }, [dispatch]);

  // Clear validated coupon
  const clearValidatedCouponData = useCallback(() => {
    dispatch(clearValidatedCoupon());
  }, [dispatch]);

  // Clear error
  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    // State
    coupons,
    currentCoupon,
    validatedCoupon,
    loading,
    error,
    pagination,
    
    // Actions
    getCoupons,
    createCoupon: createNewCoupon,
    updateCoupon: updateExistingCoupon,
    deactivateCoupon: deactivateExistingCoupon,
    getCoupon: getCouponById,
    validateCoupon: validateCouponCode,
    clearCoupon,
    clearValidatedCoupon: clearValidatedCouponData,
    resetError
  }), [
    coupons,
    currentCoupon,
    validatedCoupon,
    loading,
    error,
    pagination,
    getCoupons,
    createNewCoupon,
    updateExistingCoupon,
    deactivateExistingCoupon,
    getCouponById,
    validateCouponCode,
    clearCoupon,
    clearValidatedCouponData,
    resetError
  ]);
};

export default useCoupons;
