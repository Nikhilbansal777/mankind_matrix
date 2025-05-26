import { useDispatch, useSelector } from 'react-redux';
import {
  addItem,
  removeItem,
  clearCart,
  updateItemQuantity,
  selectCartItems,
  selectCartItemCount,
  selectCartTotal
} from '../redux/slices/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const items = useSelector(selectCartItems);
  const itemCount = useSelector(selectCartItemCount);
  const total = useSelector(selectCartTotal);
  
  // Actions
  const addToCart = (product) => {
    dispatch(addItem(product));
  };
  
  const removeFromCart = (productId) => {
    dispatch(removeItem(productId));
  };
  
  const clearCartItems = () => {
    dispatch(clearCart());
  };
  
  const updateQuantity = (productId, quantity) => {
    dispatch(updateItemQuantity({ id: productId, quantity }));
  };
  
  const getCartItem = (productId) => {
    return items.find(item => item.id === productId);
  };
  
  return {
    // State
    items,
    itemCount,
    total,
    
    // Actions
    addToCart,
    removeFromCart,
    clearCart: clearCartItems,
    updateQuantity,
    getCartItem
  };
};

export default useCart; 