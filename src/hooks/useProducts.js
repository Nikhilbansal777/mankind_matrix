import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  fetchProductsByCategory,
  fetchFeaturedProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  selectProducts,
  selectFeaturedProducts,
  selectCurrentProduct,
  selectProductsLoading,
  selectFeaturedProductsLoading,
  selectCurrentProductLoading,
  selectCreateProductLoading,
  selectUpdateProductLoading,
  selectDeleteProductLoading,
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
  const createLoading = useSelector(selectCreateProductLoading);
  const updateLoading = useSelector(selectUpdateProductLoading);
  const deleteLoading = useSelector(selectDeleteProductLoading);
  const error = useSelector(selectProductsError);
  const pagination = useSelector(selectProductsPagination);

  // Fetch all products with pagination
  const getProducts = useCallback(async (page = 0, size = 10, sort = []) => {
    try {
      await dispatch(fetchProducts({ page, size, sort: sort && sort.length > 0 ? sort : undefined })).unwrap();
    } catch (err) {
      console.error('Error fetching products:', err);
      throw err;
    }
  }, [dispatch]);

  // Fetch products by category with pagination
  const getProductsByCategory = useCallback(async (categoryId, page = 0, size = 10, sort = []) => {
    try {
      await dispatch(fetchProductsByCategory({ categoryId, page, size, sort: sort && sort.length > 0 ? sort : undefined })).unwrap();
    } catch (err) {
      console.error('Error fetching products by category:', err);
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

  // Create new product
  const createNewProduct = useCallback(async (data) => {
    try {
      await dispatch(createProduct(data)).unwrap();
    } catch (err) {
      console.error('Error creating product:', err);
      throw err;
    }
  }, [dispatch]);

  // Update existing product
  const updateExistingProduct = useCallback(async (id, data) => {
    try {
      await dispatch(updateProduct({ id, data })).unwrap();
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  }, [dispatch]);

  // Delete product
  const deleteExistingProduct = useCallback(async (id) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
    } catch (err) {
      console.error('Error deleting product:', err);
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
    loading: {
      products: productsLoading,
      featured: featuredLoading,
      current: currentProductLoading,
      create: createLoading,
      update: updateLoading,
      delete: deleteLoading
    },
    error,
    pagination,
    
    // Actions
    getProducts,
    getProductsByCategory,
    getFeaturedProducts,
    getProduct,
    createProduct: createNewProduct,
    updateProduct: updateExistingProduct,
    deleteProduct: deleteExistingProduct,
    clearProduct,
    resetError
  }), [
    products,
    featuredProducts,
    currentProduct,
    productsLoading,
    featuredLoading,
    currentProductLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    error,
    pagination,
    getProducts,
    getProductsByCategory,
    getFeaturedProducts,
    getProduct,
    createNewProduct,
    updateExistingProduct,
    deleteExistingProduct,
    clearProduct,
    resetError
  ]);
};

export default useProducts; 