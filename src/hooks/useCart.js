import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import {
  fetchCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  clearError,
  selectCartItems,
  selectCartItemCount,
  selectCartTotal,
  selectCartSubtotal,
  selectCartStatus,
  selectCartLoading,
  selectCartError
} from '../redux/slices/cartSlice';
import { useUser } from './useUser';

export const useCart = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useUser();
  
  // Selectors
  const items = useSelector(selectCartItems);
  const itemCount = useSelector(selectCartItemCount);
  const total = useSelector(selectCartTotal);
  const subtotal = useSelector(selectCartSubtotal);
  const status = useSelector(selectCartStatus);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  
  // Fetch cart on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);
  
  // Actions
  const addToCart = async (product) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to add items to cart');
    }
    
    try {
      await dispatch(addItemToCart({ 
        productId: product.productId || product.id, 
        quantity: product.quantity || 1 
      })).unwrap();
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  };
  
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to remove items from cart');
    }
    
    try {
      await dispatch(removeCartItem(productId)).unwrap();
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  };
  
  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to update cart items');
    }
    
    try {
      await dispatch(updateCartItemQuantity({ productId, quantity })).unwrap();
    } catch (error) {
      console.error('Error updating item quantity:', error);
      throw error;
    }
  };
  
  const clearCartItems = async () => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to clear cart');
    }
    
    try {
      await dispatch(clearCart()).unwrap();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };
  
  const refreshCart = async () => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to refresh cart');
    }
    
    try {
      await dispatch(fetchCart()).unwrap();
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  };
  
  const clearCartError = () => {
    dispatch(clearError());
  };
  
  const getCartItem = (productId) => {
    return items.find(item => item.productId === productId);
  };
  
  return {
    // State
    items,
    itemCount,
    total,
    subtotal,
    status,
    loading,
    error,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart: clearCartItems,
    refreshCart,
    clearError: clearCartError,
    getCartItem
  };
};

export default useCart; 