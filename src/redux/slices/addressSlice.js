import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import addressService from '../../api2/services/addressService';

// Async thunks
export const fetchAddresses = createAsyncThunk(
  'addresses/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await addressService.getAddresses();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
    }
  }
);

export const createAddress = createAsyncThunk(
  'addresses/createAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await addressService.createAddress(addressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create address');
    }
  }
);

export const updateAddress = createAsyncThunk(
  'addresses/updateAddress',
  async ({ id, addressData }, { rejectWithValue }) => {
    try {
      const response = await addressService.updateAddress(id, addressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update address');
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'addresses/deleteAddress',
  async (id, { rejectWithValue }) => {
    try {
      await addressService.deleteAddress(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete address');
    }
  }
);

const initialState = {
  addresses: [],
  selectedAddress: null,
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false
};

const addressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    clearSelectedAddress: (state) => {
      state.selectedAddress = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch addresses
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Addresses fetched successfully:', action.payload);
        
        // Ensure we have an array, even if empty
        const addresses = Array.isArray(action.payload) ? action.payload : [];
        state.addresses = addresses;
        state.error = null;
        
        // Auto-select the first default address if no address is currently selected
        if (addresses.length > 0 && !state.selectedAddress) {
          // Find all default addresses
          const defaultAddresses = addresses.filter(addr => addr.isDefault);
          
          if (defaultAddresses.length > 0) {
            // If multiple defaults, select the first one
            state.selectedAddress = defaultAddresses[0];
            console.log('Auto-selected first default address:', defaultAddresses[0]);
            
            // If there are multiple defaults, log a warning
            if (defaultAddresses.length > 1) {
              console.warn(`Multiple default addresses found (${defaultAddresses.length}). Selected the first one.`);
            }
          } else {
            // If no default address, select the first one
            state.selectedAddress = addresses[0];
            console.log('Auto-selected first address (no default):', addresses[0]);
          }
        } else if (addresses.length === 0) {
          // Clear selected address if no addresses exist
          state.selectedAddress = null;
        }
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        console.error('Addresses fetch failed:', action.payload, action.error);
        state.error = action.payload;
      })
      
      // Create address
      .addCase(createAddress.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.createLoading = false;
        state.addresses.push(action.payload);
        state.error = null;
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      
      // Update address
      .addCase(updateAddress.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
          
          // If this address is being set as default, remove default flag from others
          if (action.payload.isDefault) {
            state.addresses.forEach((addr, i) => {
              if (i !== index && addr.isDefault) {
                state.addresses[i] = { ...addr, isDefault: false };
              }
            });
          }
        }
        state.error = null;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      
      // Delete address
      .addCase(deleteAddress.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
        if (state.selectedAddress?.id === action.payload) {
          state.selectedAddress = null;
        }
        state.error = null;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })
      

  }
});

export const { clearError, setSelectedAddress, clearSelectedAddress } = addressSlice.actions;

// Selectors
export const selectAddresses = (state) => state.addresses.addresses;
export const selectSelectedAddress = (state) => state.addresses.selectedAddress;
export const selectAddressesLoading = (state) => state.addresses.loading;
export const selectAddressesError = (state) => state.addresses.error;
export const selectCreateAddressLoading = (state) => state.addresses.createLoading;
export const selectUpdateAddressLoading = (state) => state.addresses.updateLoading;
export const selectDeleteAddressLoading = (state) => state.addresses.deleteLoading;
export const selectDefaultAddress = (state) => state.addresses.addresses.find(addr => addr.isDefault);
export const selectFirstThreeAddresses = (state) => state.addresses.addresses.slice(0, 3);

export default addressSlice.reducer;
