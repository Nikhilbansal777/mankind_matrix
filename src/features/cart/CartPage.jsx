import React from 'react';
import { useCart } from '../../hooks/useCart';
import { useNavigate, Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import withLayout from '../../layouts/HOC/withLayout';
import styles from './CartPage.module.css';

const CartPage = () => {
  const { items, total, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();
  
  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };
  
  const handleAddItem = (product) => {
    // Add just one item at a time
    addToCart({ ...product, quantity: 1 });
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  if (items.length === 0) {
    return (
      <div className={`${styles.cartPage} ${styles.emptyCart}`}>
        <h1>Your Cart</h1>
        <div className={styles.emptyCartMessage}>
          <p>Your cart is empty.</p>
          <button 
            className={styles.continueShoppingBtn}
            onClick={() => window.location.href = '/products'}
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
            // Calculate item total
            const priceValue = parseFloat(item.price.replace('$', '').replace(',', '')) || 0;
            const itemTotal = priceValue * item.quantity;
            
            return (
              <div className={styles.cartItem} key={item.id}>
                <div className={styles.productInfo}>
                  <div className={styles.productImage}>
                    {/* Display product image if available */}
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      <div className={styles.placeholderImage}>{item.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className={styles.productDetails}>
                    <Link to={`/product/${item.id}`} className={styles.productName}>
                      <h3>{item.name}</h3>
                    </Link>
                    <p className={styles.productCategory}>{item.category}</p>
                  </div>
                </div>
                
                <div className={styles.productPrice}>{item.price}</div>
                
                <div className={styles.productQuantity}>
                  <button 
                    className={styles.quantityBtn}
                    onClick={() => handleRemoveItem(item.id)}
                    aria-label="Decrease quantity"
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button 
                    className={styles.quantityBtn}
                    onClick={() => handleAddItem(item)}
                    aria-label="Increase quantity"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
                
                <div className={styles.productTotal}>${itemTotal.toFixed(2)}</div>
                
                <div className={styles.productRemove}>
                  <button 
                    className={styles.removeBtn}
                    onClick={() => {
                      for (let i = 0; i < item.quantity; i++) {
                        handleRemoveItem(item.id);
                      }
                    }}
                    aria-label="Remove item"
                  >
                    <FaTrash size={14} />
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
              <span>${total.toFixed(2)}</span>
            </div>
            <div className={styles.tax}>
              <span>Tax (10%):</span>
              <span>${(total * 0.1).toFixed(2)}</span>
            </div>
            <div className={styles.shipping}>
              <span>Shipping:</span>
              <span>FREE</span>
            </div>
            <div className={styles.grandTotal}>
              <span>Total:</span>
              <span>${(total + total * 0.1).toFixed(2)}</span>
            </div>
            
            <button 
              className={styles.checkoutBtn}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLayout(CartPage);