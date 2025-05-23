import React from 'react';
import { useCart } from '../../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import withLayout from '../../layouts/HOC/withLayout';
import './CartPage.css';

const CartPage = () => {
  const { items, total, addToCart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  
  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };
  
  const handleAddItem = (product) => {
    addToCart(product);
  };
  
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  if (items.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <h1>Your Cart</h1>
        <div className="empty-cart-message">
          <p>Your cart is empty.</p>
          <button 
            className="continue-shopping-btn"
            onClick={() => window.location.href = '/products'}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      
      <div className="cart-container">
        <div className="cart-header">
          <div className="product-info">Product</div>
          <div className="product-price">Price</div>
          <div className="product-quantity">Quantity</div>
          <div className="product-total">Total</div>
          <div className="product-remove">Remove</div>
        </div>
        
        <div className="cart-items">
          {items.map(item => {
            // Calculate item total
            const priceValue = parseFloat(item.price.replace('$', '').replace(',', '')) || 0;
            const itemTotal = priceValue * item.quantity;
            
            return (
              <div className="cart-item" key={item.id}>
                <div className="product-info">
                  <div className="product-image">
                    {/* Display product image if available */}
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      <div className="placeholder-image">{item.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="product-details">
                    <h3>{item.name}</h3>
                    <p className="product-category">{item.category}</p>
                  </div>
                </div>
                
                <div className="product-price">{item.price}</div>
                
                <div className="product-quantity">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <FaMinus />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleAddItem(item)}
                  >
                    <FaPlus />
                  </button>
                </div>
                
                <div className="product-total">${itemTotal.toFixed(2)}</div>
                
                <div className="product-remove">
                  <button 
                    className="remove-btn"
                    onClick={() => {
                      for (let i = 0; i < item.quantity; i++) {
                        handleRemoveItem(item.id);
                      }
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="cart-summary">
          <div className="cart-actions">
            <button 
              className="continue-shopping-btn"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
            <button 
              className="clear-cart-btn"
              onClick={handleClearCart}
            >
              Clear Cart
            </button>
          </div>
          
          <div className="cart-totals">
            <div className="subtotal">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="tax">
              <span>Tax (10%):</span>
              <span>${(total * 0.1).toFixed(2)}</span>
            </div>
            <div className="shipping">
              <span>Shipping:</span>
              <span>FREE</span>
            </div>
            <div className="grand-total">
              <span>Total:</span>
              <span>${(total + total * 0.1).toFixed(2)}</span>
            </div>
            
            <button 
              className="checkout-btn"
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