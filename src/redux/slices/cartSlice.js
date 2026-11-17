import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../api2/services/cartService';

// Async thunks for API calls
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const cart = await cartService.getCart();
      return cart;
    } catch (error) {
      // Handle 404 as expected when no cart exists
      if (error.message && error.message.includes('404')) {
        return {
          id: null,
          userId: null,
          sessionId: null,
          status: null,
          items: [],
          subtotal: 0,
          total: 0
        };
      }
      return rejectWithValue(error.message);
    }
  }
);

export const addItemToCart = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const cart = await cartService.addItem({ productId, quantity });
      return cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateItemQuantity',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const cart = await cartService.updateItemQuantity(productId, quantity);
      return cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async (productId, { rejectWithValue }) => {
    try {
      const cart = await cartService.removeItem(productId);
      return cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentItems = state.cart.items;
      const cart = await cartService.clearCart(currentItems);
      return cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Calculate item count from cart items
const calculateItemCount = (items) => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

const initialState = {
  id: null,
  userId: null,
  sessionId: null,
  status: null,
  items: [],
  subtotal: 0,
  total: 0,
  itemCount: 0,
  loading: {
    fetch: false,
    add: false,
    update: false,
    remove: false,
    clear: false
  },
  error: null
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCart: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading.fetch = false;
        const cart = action.payload;
        state.id = cart.id;
        state.userId = cart.userId;
        state.sessionId = cart.sessionId;
        state.status = cart.status;
        state.items = cart.items || [];
        state.subtotal = cart.subtotal || 0;
        state.total = cart.total || 0;
        state.itemCount = calculateItemCount(cart.items || []);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })
      
      // Add item to cart
      .addCase(addItemToCart.pending, (state) => {
        state.loading.add = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading.add = false;
        const cart = action.payload;
        state.id = cart.id;
        state.userId = cart.userId;
        state.sessionId = cart.sessionId;
        state.status = cart.status;
        state.items = cart.items || [];
        state.subtotal = cart.subtotal || 0;
        state.total = cart.total || 0;
        state.itemCount = calculateItemCount(cart.items || []);
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading.add = false;
        state.error = action.payload;
      })
      
      // Update item quantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading.update = false;
        const cart = action.payload;
        state.id = cart.id;
        state.userId = cart.userId;
        state.sessionId = cart.sessionId;
        state.status = cart.status;
        state.items = cart.items || [];
        state.subtotal = cart.subtotal || 0;
        state.total = cart.total || 0;
        state.itemCount = calculateItemCount(cart.items || []);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })
      
      // Remove item from cart
      .addCase(removeCartItem.pending, (state) => {
        state.loading.remove = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading.remove = false;
        const cart = action.payload;
        state.id = cart.id;
        state.userId = cart.userId;
        state.sessionId = cart.sessionId;
        state.status = cart.status;
        state.items = cart.items || [];
        state.subtotal = cart.subtotal || 0;
        state.total = cart.total || 0;
        state.itemCount = calculateItemCount(cart.items || []);
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading.remove = false;
        state.error = action.payload;
      })
      
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading.clear = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading.clear = false;
        const cart = action.payload;
        state.id = cart.id;
        state.userId = cart.userId;
        state.sessionId = cart.sessionId;
        state.status = cart.status;
        state.items = cart.items || [];
        state.subtotal = cart.subtotal || 0;
        state.total = cart.total || 0;
        state.itemCount = calculateItemCount(cart.items || []);
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading.clear = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const { clearError, resetCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) => state.cart.itemCount;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartSubtotal = (state) => state.cart.subtotal;
export const selectCartStatus = (state) => state.cart.status;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectCartItem = (state, productId) => 
  state.cart.items.find(item => item.productId === productId);

export default cartSlice.reducer; 