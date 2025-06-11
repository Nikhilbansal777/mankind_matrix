import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import inventoryService from '../../api2/services/inventoryService';

// Async thunks for API calls
export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await inventoryService.getInventory(productId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createInventory = createAsyncThunk(
  'inventory/createInventory',
  async ({ productId, data }, { rejectWithValue }) => {
    try {
      const response = await inventoryService.createInventory(productId, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateInventory = createAsyncThunk(
  'inventory/updateInventory',
  async ({ productId, data }, { rejectWithValue }) => {
    try {
      const response = await inventoryService.updateInventory(productId, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: {}, // Map of productId -> inventory data
  loading: {
    fetch: false,
    create: false,
    update: false
  },
  error: null
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearInventory: (state) => {
      state.items = {};
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchInventory
      .addCase(fetchInventory.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.items[action.payload.productId] = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })
      
      // Handle createInventory
      .addCase(createInventory.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createInventory.fulfilled, (state, action) => {
        state.loading.create = false;
        state.items[action.payload.productId] = action.payload;
      })
      .addCase(createInventory.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })
      
      // Handle updateInventory
      .addCase(updateInventory.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateInventory.fulfilled, (state, action) => {
        state.loading.update = false;
        state.items[action.payload.productId] = action.payload;
      })
      .addCase(updateInventory.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      });
  }
});

// Selectors
export const selectInventory = (state) => state.inventory.items;
export const selectInventoryByProductId = (state, productId) => state.inventory.items[productId];
export const selectInventoryLoading = (state) => state.inventory.loading;
export const selectInventoryError = (state) => state.inventory.error;

// Actions
export const { clearInventory, clearError } = inventorySlice.actions;

export default inventorySlice.reducer; 