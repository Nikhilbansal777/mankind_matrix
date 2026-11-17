import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryService from '../../api2/services/categoryService';

// Async thunks for API calls
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategories();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id, { rejectWithValue }) => {
    try {
      const category = await categoryService.getCategory(id);
      return category;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (data, { rejectWithValue }) => {
    try {
      const category = await categoryService.createCategory(data);
      return category;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const category = await categoryService.updateCategory(id, data);
      return category;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await categoryService.deleteCategory(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  currentCategory: null,
  loading: {
    categories: false,
    current: false,
    create: false,
    update: false,
    delete: false
  },
  error: null
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.loading.categories = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading.categories = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading.categories = false;
        state.error = action.payload;
      })
      
      // Handle fetchCategoryById
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading.current = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading.current = false;
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading.current = false;
        state.error = action.payload;
      })
      
      // Handle createCategory
      .addCase(createCategory.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading.create = false;
        state.items.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })
      
      // Handle updateCategory
      .addCase(updateCategory.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading.update = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentCategory?.id === action.payload.id) {
          state.currentCategory = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })
      
      // Handle deleteCategory
      .addCase(deleteCategory.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.currentCategory?.id === action.payload) {
          state.currentCategory = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload;
      });
  }
});

// Selectors
export const selectCategories = (state) => state.categories.items;
export const selectCurrentCategory = (state) => state.categories.currentCategory;
export const selectCategoriesLoading = (state) => state.categories.loading.categories;
export const selectCurrentCategoryLoading = (state) => state.categories.loading.current;
export const selectCreateCategoryLoading = (state) => state.categories.loading.create;
export const selectUpdateCategoryLoading = (state) => state.categories.loading.update;
export const selectDeleteCategoryLoading = (state) => state.categories.loading.delete;
export const selectCategoriesError = (state) => state.categories.error;

export const { clearCurrentCategory, clearError } = categorySlice.actions;
export default categorySlice.reducer; 