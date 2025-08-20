import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOrders,
  createOrder,
  getOrder,
  payOrder as payOrderThunk,
  selectOrders,
  selectCurrentOrder,
  selectOrdersLoading,
  selectOrdersError,
  selectOrdersPagination,
  selectPaymentLoading,
  selectPaymentError,
  clearCurrentOrder,
  clearError
} from '../redux/slices/orderSlice';
import { useUser } from './useUser';

export const useOrders = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isInitialized } = useUser();
  
  // Selectors
  const orders = useSelector(selectOrders);
  const currentOrder = useSelector(selectCurrentOrder);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const pagination = useSelector(selectOrdersPagination);
  const paymentLoading = useSelector(selectPaymentLoading);
  const paymentError = useSelector(selectPaymentError);

  // Fetch orders with pagination
  const getOrders = useCallback(async (page = 0, size = 10, sort = ['createdAt,desc']) => {
    if (!isInitialized || !isAuthenticated) {
      throw new Error('You must be logged in to fetch orders');
    }
    
    try {
      await dispatch(fetchOrders({ page, size, sort })).unwrap();
    } catch (err) {
      console.error('Error fetching orders:', err);
      throw err;
    }
  }, [dispatch, isInitialized, isAuthenticated]);

  // Create a new order
  const createNewOrder = useCallback(async (orderData) => {
    if (!isInitialized || !isAuthenticated) {
      throw new Error('You must be logged in to create orders');
    }
    
    try {
      const result = await dispatch(createOrder(orderData)).unwrap();
      return result;
    } catch (err) {
      console.error('Error creating order:', err);
      throw err;
    }
  }, [dispatch, isInitialized, isAuthenticated]);

  // Get a single order by ID
  const getOrderById = useCallback(async (orderId) => {
    if (!isInitialized || !isAuthenticated) {
      throw new Error('You must be logged in to fetch order details');
    }
    
    try {
      await dispatch(getOrder(orderId)).unwrap();
    } catch (err) {
      console.error('Error fetching order:', err);
      throw err;
    }
  }, [dispatch, isInitialized, isAuthenticated]);

  // Clear current order
  const clearOrder = useCallback(() => {
    dispatch(clearCurrentOrder());
  }, [dispatch]);

  // Clear error
  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Pay order
  const payOrder = useCallback(async (orderId, paymentData) => {
    if (!isInitialized || !isAuthenticated) {
      throw new Error('You must be logged in to pay for orders');
    }
    try {
      const result = await dispatch(payOrderThunk({ orderId, paymentData })).unwrap();
      return result;
    } catch (err) {
      console.error('Error paying for order:', err);
      throw err;
    }
  }, [dispatch, isInitialized, isAuthenticated]);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    // State
    orders,
    currentOrder,
    loading,
    error,
    paymentLoading,
    paymentError,
    pagination,
    
    // Actions
    getOrders,
    createOrder: createNewOrder,
    getOrder: getOrderById,
    payOrder,
    clearOrder,
    resetError
  }), [
    orders,
    currentOrder,
    loading,
    error,
    paymentLoading,
    paymentError,
    pagination,
    getOrders,
    createNewOrder,
    getOrderById,
    payOrder,
    clearOrder,
    resetError
  ]);
};

export default useOrders;
