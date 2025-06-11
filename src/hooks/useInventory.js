import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchInventory,
  createInventory,
  updateInventory,
  selectInventory,
  selectInventoryByProductId,
  selectInventoryLoading,
  selectInventoryError,
  clearInventory,
  clearError
} from '../redux/slices/inventorySlice';

export const useInventory = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const inventory = useSelector(selectInventory);
  const inventoryLoading = useSelector(selectInventoryLoading);
  const error = useSelector(selectInventoryError);

  // Get inventory for a specific product
  const getInventory = useCallback(async (productId) => {
    try {
      await dispatch(fetchInventory(productId)).unwrap();
    } catch (err) {
      console.error('Error fetching inventory:', err);
      throw err;
    }
  }, [dispatch]);

  // Create inventory for a product
  const createNewInventory = useCallback(async (productId, data) => {
    try {
      await dispatch(createInventory({ productId, data })).unwrap();
    } catch (err) {
      console.error('Error creating inventory:', err);
      throw err;
    }
  }, [dispatch]);

  // Update inventory for a product
  const updateExistingInventory = useCallback(async (productId, data) => {
    try {
      await dispatch(updateInventory({ productId, data })).unwrap();
    } catch (err) {
      console.error('Error updating inventory:', err);
      throw err;
    }
  }, [dispatch]);

  // Get inventory for a specific product
  const getInventoryByProductId = useCallback((productId) => {
    return useSelector(state => selectInventoryByProductId(state, productId));
  }, []);

  // Clear all inventory data
  const clearInventoryData = useCallback(() => {
    dispatch(clearInventory());
  }, [dispatch]);

  // Clear error
  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    // State
    inventory,
    loading: inventoryLoading,
    error,
    
    // Actions
    getInventory,
    createInventory: createNewInventory,
    updateInventory: updateExistingInventory,
    getInventoryByProductId,
    clearInventory: clearInventoryData,
    resetError
  }), [
    inventory,
    inventoryLoading,
    error,
    getInventory,
    createNewInventory,
    updateExistingInventory,
    getInventoryByProductId,
    clearInventoryData,
    resetError
  ]);
};

export default useInventory; 