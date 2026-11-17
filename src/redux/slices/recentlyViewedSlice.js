import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import recentlyViewedService from '../../api2/services/recentlyViewedService';

// Async thunks for API calls
export const fetchRecentlyViewed = createAsyncThunk(
  'recentlyViewed/fetchRecentlyViewed',
  async (_, { rejectWithValue }) => {
    try {
      const response = await recentlyViewedService.getRecentlyViewed();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToRecentlyViewed = createAsyncThunk(
  'recentlyViewed/addToRecentlyViewed',
  async (productId, { rejectWithValue }) => {
    try {
      const product = await recentlyViewedService.addToRecentlyViewed(productId);
      return product;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromRecentlyViewed = createAsyncThunk(
  'recentlyViewed/removeFromRecentlyViewed',
  async (productId, { rejectWithValue }) => {
    try {
      await recentlyViewedService.removeFromRecentlyViewed(productId);
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearRecentlyViewed = createAsyncThunk(
  'recentlyViewed/clearRecentlyViewed',
  async (_, { rejectWithValue }) => {
    try {
      await recentlyViewedService.clearRecentlyViewed();
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  loading: {
    fetch: false,
    add: false,
    remove: false,
    clear: false
  },
  error: null
};

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchRecentlyViewed
      .addCase(fetchRecentlyViewed.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchRecentlyViewed.fulfilled, (state, action) => {
        state.loading.fetch = false;
        // Handle different API response structures
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else if (action.payload?.content) {
          state.items = action.payload.content;
        } else if (action.payload?.data) {
          state.items = action.payload.data;
        } else {
          state.items = [];
        }
      })
      .addCase(fetchRecentlyViewed.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })
      
      // Handle addToRecentlyViewed
      .addCase(addToRecentlyViewed.pending, (state) => {
        state.loading.add = true;
        state.error = null;
      })
      .addCase(addToRecentlyViewed.fulfilled, (state, action) => {
        state.loading.add = false;
        // Handle the recently viewed structure: {id, lastViewedAt, product: {...}, userId, viewedAt}
        const newItem = action.payload;
        // Remove existing product if it exists and add to the beginning
        state.items = state.items.filter(item => item.product?.id !== newItem.product?.id);
        state.items.unshift(newItem);
        // Keep only the most recent items (limit to 10)
        if (state.items.length > 10) {
          state.items = state.items.slice(0, 10);
        }
      })
      .addCase(addToRecentlyViewed.rejected, (state, action) => {
        state.loading.add = false;
        state.error = action.payload;
      })
      
      // Handle removeFromRecentlyViewed
      .addCase(removeFromRecentlyViewed.pending, (state) => {
        state.loading.remove = true;
        state.error = null;
      })
      .addCase(removeFromRecentlyViewed.fulfilled, (state, action) => {
        state.loading.remove = false;
        // Remove by product ID from the recently viewed structure
        state.items = state.items.filter(item => item.product?.id !== action.payload);
      })
      .addCase(removeFromRecentlyViewed.rejected, (state, action) => {
        state.loading.remove = false;
        state.error = action.payload;
      })
      
      // Handle clearRecentlyViewed
      .addCase(clearRecentlyViewed.pending, (state) => {
        state.loading.clear = true;
        state.error = null;
      })
      .addCase(clearRecentlyViewed.fulfilled, (state) => {
        state.loading.clear = false;
        state.items = [];
      })
      .addCase(clearRecentlyViewed.rejected, (state, action) => {
        state.loading.clear = false;
        state.error = action.payload;
      });
  }
});

// Selectors
export const selectRecentlyViewed = (state) => state.recentlyViewed.items;
export const selectRecentlyViewedLoading = (state) => state.recentlyViewed.loading;
export const selectRecentlyViewedError = (state) => state.recentlyViewed.error;

export const { clearError } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer; 