import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      return {
        items: parsedCart.items || [],
        itemCount: parsedCart.itemCount || 0,
        total: parsedCart.total || 0
      };
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return {
    items: [],
    itemCount: 0,
    total: 0
  };
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Calculate cart total
const calculateTotal = (items) => {
  return items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', '').replace(',', '')) || 0;
    return sum + (price * item.quantity);
  }, 0);
};

// Calculate item count
const calculateItemCount = (items) => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

const initialState = loadCartFromStorage();

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );

      const productQuantity = action.payload.quantity || 1;
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        state.items[existingItemIndex].quantity += productQuantity;
      } else {
        // Add new item
        state.items.push({ ...action.payload, quantity: productQuantity });
      }
      
      // Update totals
      state.itemCount = calculateItemCount(state.items);
      state.total = calculateTotal(state.items);
      
      // Save to localStorage
      saveCartToStorage(state);
    },
    
    removeItem: (state, action) => {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload
      );
      
      if (existingItemIndex >= 0) {
        if (state.items[existingItemIndex].quantity > 1) {
          // Reduce quantity
          state.items[existingItemIndex].quantity -= 1;
        } else {
          // Remove item
          state.items.splice(existingItemIndex, 1);
        }
        
        // Update totals
        state.itemCount = calculateItemCount(state.items);
        state.total = calculateTotal(state.items);
        
        // Save to localStorage
        saveCartToStorage(state);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.total = 0;
      localStorage.removeItem('cart');
    },
    
    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === id);
      
      if (itemIndex >= 0) {
        if (quantity > 0) {
          state.items[itemIndex].quantity = quantity;
        } else {
          state.items.splice(itemIndex, 1);
        }
        
        // Update totals
        state.itemCount = calculateItemCount(state.items);
        state.total = calculateTotal(state.items);
        
        // Save to localStorage
        saveCartToStorage(state);
      }
    }
  }
});

// Export actions
export const { addItem, removeItem, clearCart, updateItemQuantity } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) => state.cart.itemCount;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartItem = (state, id) => 
  state.cart.items.find(item => item.id === id);

export default cartSlice.reducer; 