import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import withLayout from '../../layouts/HOC/withLayout';
import styles from './CartPage.module.css';

const CartPage = () => {
  const { 
    items, 
    total, 
    subtotal,
    loading, 
    error,
    addToCart, 
    removeFromCart, 
    updateQuantity,
    clearError 
  } = useCart();
  const navigate = useNavigate();
  const [updatingItems, setUpdatingItems] = useState(new Set());
  
  const handleRemoveItem = async (productId) => {
    if (updatingItems.has(productId)) return;
    
    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error(error.message || 'Failed to remove item from cart');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };
  
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (updatingItems.has(productId) || newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      await updateQuantity(productId, newQuantity);
      toast.success('Cart updated');
    } catch (error) {
      toast.error(error.message || 'Failed to update cart');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };
  
  const handleIncreaseQuantity = async (item) => {
    await handleUpdateQuantity(item.productId, item.quantity + 1);
  };
  
  const handleDecreaseQuantity = async (item) => {
    if (item.quantity > 1) {
      await handleUpdateQuantity(item.productId, item.quantity - 1);
    } else {
      await handleRemoveItem(item.productId);
    }
  };

  const handleCheckout = () => {
    navigate('/delivery');
  };
  
  // Clear error when component mounts
  React.useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);
  
  // Show loading state
  if (loading.fetch) {
    return (
      <div className={`${styles.cartPage} ${styles.loadingCart}`}>
        <h1>Your Cart</h1>
        <div className={styles.loadingMessage}>
          <FaSpinner className={styles.spinner} />
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }
  
  if (items.length === 0) {
    return (
      <div className={`${styles.cartPage} ${styles.emptyCart}`}>
        <h1>Your Cart</h1>
        <div className={styles.emptyCartMessage}>
          <p>Your cart is empty.</p>
          <button 
            className={styles.continueShoppingBtn}
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.cartPage}>
      <h1>Your Cart</h1>
      
      <div className={styles.cartContainer}>
        <div className={styles.cartHeader}>
          <div className={styles.productInfo}>Product</div>
          <div className={styles.productPrice}>Price</div>
          <div className={styles.productQuantity}>Quantity</div>
          <div className={styles.productTotal}>Total</div>
          <div className={styles.productRemove}>Remove</div>
        </div>
        
        <div className={styles.cartItems}>
          {items.map(item => {
            const isUpdating = updatingItems.has(item.productId);
            const itemTotal = item.subtotal || (item.price * item.quantity);
            
            return (
              <div className={styles.cartItem} key={item.id}>
                <div className={styles.productInfo}>
                  <div className={styles.productImage}>
                    {/* Display product image if available */}
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} />
                    ) : (
                      <div className={styles.placeholderImage}>{item.productName?.charAt(0) || 'P'}</div>
                    )}
                  </div>
                  <div className={styles.productDetails}>
                    <Link to={`/product/${item.productId}`} className={styles.productName}>
                      <h3>{item.productName}</h3>
                    </Link>
                    <p className={styles.productCategory}>{
                      typeof item.category === 'object' && item.category !== null
                        ? item.category.name
                        : item.category
                    }</p>
                  </div>
                </div>
                
                <div className={styles.productPrice}>
                  ${item.price.toFixed(2)}
                </div>
                
                <div className={styles.productQuantity}>
                  <button 
                    className={`${styles.quantityBtn} ${isUpdating ? styles.disabled : ''}`}
                    onClick={() => handleDecreaseQuantity(item)}
                    disabled={isUpdating}
                    aria-label="Decrease quantity"
                  >
                    {isUpdating ? <FaSpinner size={12} /> : <FaMinus size={12} />}
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button 
                    className={`${styles.quantityBtn} ${isUpdating ? styles.disabled : ''}`}
                    onClick={() => handleIncreaseQuantity(item)}
                    disabled={isUpdating}
                    aria-label="Increase quantity"
                  >
                    {isUpdating ? <FaSpinner size={12} /> : <FaPlus size={12} />}
                  </button>
                </div>
                
                <div className={styles.productTotal}>
                  ${itemTotal.toFixed(2)}
                </div>
                
                <div className={styles.productRemove}>
                  <button 
                    className={`${styles.removeBtn} ${isUpdating ? styles.disabled : ''}`}
                    onClick={() => handleRemoveItem(item.productId)}
                    disabled={isUpdating}
                    aria-label="Remove item"
                  >
                    {isUpdating ? <FaSpinner size={14} /> : <FaTrash size={14} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className={styles.cartSummary}>
          <div className={styles.cartActions}>
            <button 
              className={styles.continueShoppingBtn}
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
          </div>
          
          <div className={styles.cartTotals}>
            <div className={styles.subtotal}>
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.tax}>
              <span>Tax (10%):</span>
              <span>${(subtotal * 0.1).toFixed(2)}</span>
            </div>
            <div className={styles.shipping}>
              <span>Shipping:</span>
              <span>FREE</span>
            </div>
            <div className={styles.grandTotal}>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <button 
              className={`${styles.checkoutBtn} ${loading.add || loading.update || loading.remove ? styles.disabled : ''}`}
              onClick={handleCheckout}
              disabled={loading.add || loading.update || loading.remove}
            >
              {loading.add || loading.update || loading.remove ? (
                <>
                  <FaSpinner size={16} />
                  Processing...
                </>
              ) : (
                'Proceed to Checkout'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLayout(CartPage);