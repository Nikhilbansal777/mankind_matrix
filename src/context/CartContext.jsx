import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  items: [],
  itemCount: 0,
  total: 0
};

// Create context
const CartContext = createContext();

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );

      let updatedItems;
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
      } else {
        // Add new item with quantity 1
        updatedItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      
      // Calculate new item count
      const itemCount = updatedItems.reduce((total, item) => total + item.quantity, 0);
      
      return {
        ...state,
        items: updatedItems,
        itemCount
      };
    }
    
    case 'REMOVE_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload
      );
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        
        if (updatedItems[existingItemIndex].quantity > 1) {
          // Reduce quantity
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity - 1
          };
        } else {
          // Remove if quantity is 1
          updatedItems.splice(existingItemIndex, 1);
        }
        
        // Calculate new item count
        const itemCount = updatedItems.reduce((total, item) => total + item.quantity, 0);
        
        return {
          ...state,
          items: updatedItems,
          itemCount
        };
      }
      return state;
    }
    
    case 'CLEAR_CART':
      return initialState;
      
    case 'UPDATE_TOTAL':
      const total = state.items.reduce((sum, item) => {
        // Remove $ and convert to number
        const price = parseFloat(item.price.replace('$', '').replace(',', '')) || 0;
        return sum + (price * item.quantity);
      }, 0);
      
      return {
        ...state,
        total
      };
      
    default:
      return state;
  }
};

// Context provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  // Update cart total whenever items change
  useEffect(() => {
    dispatch({ type: 'UPDATE_TOTAL' });
  }, [state.items]);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        
        // Restore cart items
        if (parsedCart.items && Array.isArray(parsedCart.items)) {
          parsedCart.items.forEach(item => {
            dispatch({ type: 'ADD_ITEM', payload: item });
          });
        }
      } catch (error) {
        console.error('Error parsing cart from localStorage', error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify({
      items: state.items,
      itemCount: state.itemCount,
      total: state.total
    }));
  }, [state]);
  
  // Actions
  const addToCart = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };
  
  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  return (
    <CartContext.Provider value={{ 
      cart: state, 
      itemCount: state.itemCount,
      addToCart, 
      removeFromCart, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;