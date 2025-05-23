import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  fetchFeaturedProducts,
  fetchProductById,
  selectProducts,
  selectFeaturedProducts,
  selectCurrentProduct,
  selectProductsLoading,
  selectProductsError,
  selectProductsPagination,
  clearCurrentProduct,
  clearError
} from '../redux/slices/productSlice';

export const useProducts = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const products = useSelector(selectProducts);
  const featuredProducts = useSelector(selectFeaturedProducts);
  const currentProduct = useSelector(selectCurrentProduct);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const pagination = useSelector(selectProductsPagination);

  // Fetch all products with pagination
  const getProducts = useCallback(async (page = 0, size = 10) => {
    try {
      await dispatch(fetchProducts({ page, size })).unwrap();
    } catch (err) {
      console.error('Error fetching products:', err);
      throw err;
    }
  }, [dispatch]);

  // Fetch featured products
  const getFeaturedProducts = useCallback(async () => {
    try {
      await dispatch(fetchFeaturedProducts()).unwrap();
    } catch (err) {
      console.error('Error fetching featured products:', err);
      throw err;
    }
  }, [dispatch]);

  // Fetch single product by ID
  const getProduct = useCallback(async (id) => {
    try {
      await dispatch(fetchProductById(id)).unwrap();
    } catch (err) {
      console.error('Error fetching product:', err);
      throw err;
    }
  }, [dispatch]);

  // Clear current product
  const clearProduct = useCallback(() => {
    dispatch(clearCurrentProduct());
  }, [dispatch]);

  // Clear error
  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    products,
    featuredProducts,
    currentProduct,
    loading,
    error,
    pagination,
    
    // Actions
    getProducts,
    getFeaturedProducts,
    getProduct,
    clearProduct,
    resetError
  };
};

export default useProducts; 