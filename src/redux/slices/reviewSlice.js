import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewService from '../../api2/services/reviewService';

// Async thunk for fetching reviews by productId with pagination and sorting
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async ({ productId, page = 0, size = 10, sort = [] }, { rejectWithValue }) => {
    try {
      const response = await reviewService.getReviews({ productId, page, size, sort });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for creating a review
export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (data, { rejectWithValue }) => {
    try {
      const response = await reviewService.createReview(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating a review
export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, data }, { rejectWithValue }) => {
    try {
      const response = await reviewService.updateReview(reviewId, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting a review
export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      await reviewService.deleteReview(reviewId);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10
  },
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.items = [];
      state.pagination = initialState.pagination;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content || action.payload;
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalElements,
          itemsPerPage: action.payload.size
        };
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create review
      .addCase(createReview.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.createLoading = false;
        // Try to preserve username if user is available in window or localStorage
        let username = action.payload.username;
        if (!username) {
          try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
              const user = JSON.parse(userStr);
              username = user?.username || user?.name || undefined;
            }
          } catch (err) {
            // Intentionally ignored: fallback to no username if localStorage is unavailable or invalid
            console.error('Failed to parse user from localStorage. Parsing error occurred.');
          }
        }
        state.items.unshift({ ...action.payload, username });
        state.pagination.totalItems += 1;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      // Update review
      .addCase(updateReview.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.updateLoading = false;
        const idx = state.items.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) {
          // Preserve username if missing in the response
          const prev = state.items[idx];
          state.items[idx] = {
            ...prev,
            ...action.payload,
            username: action.payload.username || prev.username,
          };
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.items = state.items.filter(r => r.id !== action.payload);
        state.pagination.totalItems -= 1;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  }
});

// Selectors
export const selectReviews = (state) => state.reviews.items;
export const selectReviewsLoading = (state) => state.reviews.loading;
export const selectReviewsError = (state) => state.reviews.error;
export const selectReviewsPagination = (state) => state.reviews.pagination;
export const selectCreateReviewLoading = (state) => state.reviews.createLoading;
export const selectUpdateReviewLoading = (state) => state.reviews.updateLoading;
export const selectDeleteReviewLoading = (state) => state.reviews.deleteLoading;

export const { clearReviews, clearError } = reviewSlice.actions;
export default reviewSlice.reducer; 