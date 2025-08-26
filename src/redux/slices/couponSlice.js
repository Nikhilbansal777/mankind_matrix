import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import couponService from '../../api2/services/couponService';

// Async thunks
export const fetchCoupons = createAsyncThunk(
  'coupons/fetchCoupons',
  async ({ page = 0, size = 10, sort = ['createdAt,desc'] } = {}, { rejectWithValue }) => {
    try {
      const response = await couponService.getCoupons({ page, size, sort });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch coupons');
    }
  }
);

export const createCoupon = createAsyncThunk(
  'coupons/createCoupon',
  async (couponData, { rejectWithValue }) => {
    try {
      const response = await couponService.createCoupon(couponData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create coupon');
    }
  }
);

export const updateCoupon = createAsyncThunk(
  'coupons/updateCoupon',
  async ({ id, couponData }, { rejectWithValue }) => {
    try {
      const response = await couponService.updateCoupon(id, couponData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update coupon');
    }
  }
);

export const deactivateCoupon = createAsyncThunk(
  'coupons/deactivateCoupon',
  async (id, { rejectWithValue }) => {
    try {
      await couponService.deactivateCoupon(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to deactivate coupon');
    }
  }
);

export const getCoupon = createAsyncThunk(
  'coupons/getCoupon',
  async (id, { rejectWithValue }) => {
    try {
      const response = await couponService.getCoupon(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch coupon');
    }
  }
);

export const validateCoupon = createAsyncThunk(
  'coupons/validateCoupon',
  async (code, { rejectWithValue }) => {
    try {
      const response = await couponService.validateCoupon(code);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to validate coupon');
    }
  }
);



// Initial state
const initialState = {
  coupons: [],
  currentCoupon: null,
  validatedCoupon: null,
  loading: false,
  error: null,
  pagination: {
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0
  },
  filters: {
    type: null,
    isActive: null,
    search: ''
  }
};

// Slice
const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCoupon: (state) => {
      state.currentCoupon = null;
    },
    clearValidatedCoupon: (state) => {
      state.validatedCoupon = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    resetCoupons: (state) => {
      state.coupons = [];
      state.currentCoupon = null;
      state.validatedCoupon = null;
      state.pagination = initialState.pagination;
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    // Fetch coupons
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.content || [];
        state.pagination = {
          page: action.payload.number || 0,
          size: action.payload.size || 10,
          totalPages: action.payload.totalPages || 0,
          totalElements: action.payload.totalElements || 0
        };
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch coupons';
      });

    // Create coupon
    builder
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new coupon to the beginning of the list
        state.coupons.unshift(action.payload);
        // Update pagination
        state.pagination.totalElements += 1;
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create coupon';
      });

    // Update coupon
    builder
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        // Update coupon in the list
        const index = state.coupons.findIndex(coupon => coupon.id === action.payload.id);
        if (index !== -1) {
          state.coupons[index] = { ...state.coupons[index], ...action.payload };
        }
        // Update current coupon if it's the same
        if (state.currentCoupon?.id === action.payload.id) {
          state.currentCoupon = { ...state.currentCoupon, ...action.payload };
        }
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update coupon';
      });

    // Deactivate coupon
    builder
      .addCase(deactivateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        // Update coupon in the list to mark as inactive
        const index = state.coupons.findIndex(coupon => coupon.id === action.payload);
        if (index !== -1) {
          state.coupons[index] = { ...state.coupons[index], isActive: false };
        }
        // Update current coupon if it's the same
        if (state.currentCoupon?.id === action.payload) {
          state.currentCoupon = { ...state.currentCoupon, isActive: false };
        }
      })
      .addCase(deactivateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to deactivate coupon';
      });

    // Get single coupon
    builder
      .addCase(getCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCoupon = action.payload;
      })
      .addCase(getCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch coupon';
      });

    // Validate coupon
    builder
      .addCase(validateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.validatedCoupon = action.payload;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to validate coupon';
      });


  }
});

// Export actions
export const {
  clearError,
  clearCurrentCoupon,
  clearValidatedCoupon,
  setFilters,
  clearFilters,
  resetCoupons
} = couponSlice.actions;

// Export selectors
export const selectCoupons = (state) => state.coupons.coupons;
export const selectCurrentCoupon = (state) => state.coupons.currentCoupon;
export const selectValidatedCoupon = (state) => state.coupons.validatedCoupon;
export const selectCouponsLoading = (state) => state.coupons.loading;
export const selectCouponsError = (state) => state.coupons.error;
export const selectCouponsPagination = (state) => state.coupons.pagination;
export const selectCouponsFilters = (state) => state.coupons.filters;

// Export reducer
export default couponSlice.reducer;
