import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../api2/services/orderService';

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ page = 0, size = 10, sort = ['createdAt,desc'] } = {}, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrders({ page, size, sort });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(orderData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create order');
    }
  }
);

export const getOrder = createAsyncThunk(
  'orders/getOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrder(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch order');
    }
  }
);



// Initial state
const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: {
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0
  },
  filters: {
    status: null,
    dateRange: null,
    search: ''
  }
};

// Slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    resetOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.pagination = initialState.pagination;
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    // Fetch orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.content || [];
        state.pagination = {
          page: action.payload.number || 0,
          size: action.payload.size || 10,
          totalPages: action.payload.totalPages || 0,
          totalElements: action.payload.totalElements || 0
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch orders';
      });

    // Create order
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new order to the beginning of the list
        state.orders.unshift(action.payload);
        // Update pagination
        state.pagination.totalElements += 1;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create order';
      });

    // Get single order
    builder
      .addCase(getOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order';
      });


  }
});

// Export actions
export const {
  clearError,
  clearCurrentOrder,
  setFilters,
  clearFilters,
  resetOrders
} = orderSlice.actions;

// Export selectors
export const selectOrders = (state) => state.orders.orders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;
export const selectOrdersPagination = (state) => state.orders.pagination;
export const selectOrdersFilters = (state) => state.orders.filters;

// Export reducer
export default orderSlice.reducer;
