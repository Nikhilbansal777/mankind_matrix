import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  fetchFeaturedProducts,
  fetchProductById,
  selectProducts,
  selectFeaturedProducts,
  selectCurrentProduct,
  selectProductsLoading,
  selectFeaturedProductsLoading,
  selectCurrentProductLoading,
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
  const productsLoading = useSelector(selectProductsLoading);
  const featuredLoading = useSelector(selectFeaturedProductsLoading);
  const currentProductLoading = useSelector(selectCurrentProductLoading);
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

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    // State
    products,
    featuredProducts,
    currentProduct,
    loading: productsLoading,
    featuredLoading,
    currentProductLoading,
    error,
    pagination,
    
    // Actions
    getProducts,
    getFeaturedProducts,
    getProduct,
    clearProduct,
    resetError
  }), [
    products,
    featuredProducts,
    currentProduct,
    productsLoading,
    featuredLoading,
    currentProductLoading,
    error,
    pagination,
    getProducts,
    getFeaturedProducts,
    getProduct,
    clearProduct,
    resetError
  ]);
};

export default useProducts; 