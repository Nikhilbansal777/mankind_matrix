import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  selectCategories,
  selectCurrentCategory,
  selectCategoriesLoading,
  selectCurrentCategoryLoading,
  selectCreateCategoryLoading,
  selectUpdateCategoryLoading,
  selectDeleteCategoryLoading,
  selectCategoriesError,
  clearCurrentCategory,
  clearError
} from '../redux/slices/categorySlice';

export const useCategories = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const categories = useSelector(selectCategories);
  const currentCategory = useSelector(selectCurrentCategory);
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const currentCategoryLoading = useSelector(selectCurrentCategoryLoading);
  const createLoading = useSelector(selectCreateCategoryLoading);
  const updateLoading = useSelector(selectUpdateCategoryLoading);
  const deleteLoading = useSelector(selectDeleteCategoryLoading);
  const error = useSelector(selectCategoriesError);

  // Fetch all categories
  const getCategories = useCallback(async () => {
    try {
      await dispatch(fetchCategories()).unwrap();
    } catch (err) {
      console.error('Error fetching categories:', err);
      throw err;
    }
  }, [dispatch]);

  // Fetch single category by ID
  const getCategory = useCallback(async (id) => {
    try {
      await dispatch(fetchCategoryById(id)).unwrap();
    } catch (err) {
      console.error('Error fetching category:', err);
      throw err;
    }
  }, [dispatch]);

  // Create new category
  const createNewCategory = useCallback(async (data) => {
    try {
      await dispatch(createCategory(data)).unwrap();
    } catch (err) {
      console.error('Error creating category:', err);
      throw err;
    }
  }, [dispatch]);

  // Update category
  const updateExistingCategory = useCallback(async (id, data) => {
    try {
      await dispatch(updateCategory({ id, data })).unwrap();
    } catch (err) {
      console.error('Error updating category:', err);
      throw err;
    }
  }, [dispatch]);

  // Delete category
  const deleteExistingCategory = useCallback(async (id) => {
    try {
      await dispatch(deleteCategory(id)).unwrap();
    } catch (err) {
      console.error('Error deleting category:', err);
      throw err;
    }
  }, [dispatch]);

  // Clear current category
  const clearCategory = useCallback(() => {
    dispatch(clearCurrentCategory());
  }, [dispatch]);

  // Clear error
  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    // State
    categories,
    currentCategory,
    loading: {
      categories: categoriesLoading,
      current: currentCategoryLoading,
      create: createLoading,
      update: updateLoading,
      delete: deleteLoading
    },
    error,
    
    // Actions
    getCategories,
    getCategory,
    createCategory: createNewCategory,
    updateCategory: updateExistingCategory,
    deleteCategory: deleteExistingCategory,
    clearCategory,
    resetError
  }), [
    categories,
    currentCategory,
    categoriesLoading,
    currentCategoryLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    error,
    getCategories,
    getCategory,
    createNewCategory,
    updateExistingCategory,
    deleteExistingCategory,
    clearCategory,
    resetError
  ]);
};

export default useCategories; 