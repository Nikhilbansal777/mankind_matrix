import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import withLayout from '../../layouts/HOC/withLayout';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    paymentMethod: 'credit-card'
  });
  const [orderComplete, setOrderComplete] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you would send this data to your backend
    console.log('Order submitted:', { ...formData, orderItems: items });
    
    // Simulate order completion (would normally come from API)
    setTimeout(() => {
      setOrderComplete(true);
      clearCart();
    }, 1500);
  };
  
  if (items.length === 0 && !orderComplete) {
    // Redirect back to cart if cart is empty and order not complete
    window.location.href = '/cart';
    return null;
  }
  
  if (orderComplete) {
    return (
      <div className="checkout-page order-complete">
        <div className="order-success">
          <div className="success-icon">✓</div>
          <h1>Order Successful!</h1>
          <p>Thank you for your purchase. Your order has been received.</p>
          <p>A confirmation email has been sent to {formData.email}.</p>
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
    <div className="checkout-page">
      <h1>Checkout</h1>
      
      <div className="checkout-container">
        <div className="checkout-form-container">
          <h2>Shipping Information</h2>
          
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input 
                type="text" 
                id="address" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="zipCode">Zip Code</label>
                <input 
                  type="text" 
                  id="zipCode" 
                  name="zipCode" 
                  value={formData.zipCode} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <select 
                id="country" 
                name="country" 
                value={formData.country} 
                onChange={handleChange} 
                required
              >
                <option value="">Select Country</option>
                <option value="us">United States</option>
                <option value="ca">Canada</option>
                <option value="uk">United Kingdom</option>
                <option value="au">Australia</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <h2>Payment Method</h2>
            
            <div className="payment-methods">
              <div className="payment-method">
                <input 
                  type="radio" 
                  id="credit-card" 
                  name="paymentMethod" 
                  value="credit-card" 
                  checked={formData.paymentMethod === 'credit-card'} 
                  onChange={handleChange} 
                />
                <label htmlFor="credit-card">Credit Card</label>
              </div>
              
              <div className="payment-method">
                <input 
                  type="radio" 
                  id="paypal" 
                  name="paymentMethod" 
                  value="paypal" 
                  checked={formData.paymentMethod === 'paypal'} 
                  onChange={handleChange} 
                />
                <label htmlFor="paypal">PayPal</label>
              </div>
            </div>
            
            {formData.paymentMethod === 'credit-card' && (
              <div className="credit-card-fields">
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" required />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input type="text" id="expiryDate" placeholder="MM/YY" required />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input type="text" id="cvv" placeholder="123" required />
                  </div>
                </div>
              </div>
            )}
            
            <div className="form-actions">
              <button type="button" onClick={() => window.location.href = '/cart'}>
                Back to Cart
              </button>
              <button type="submit" className="place-order-btn">
                Place Order
              </button>
            </div>
          </form>
        </div>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          
          <div className="order-items">
            {items.map(item => (
              <div className="order-item" key={item.id}>
                <div className="order-item-info">
                  <span className="item-quantity">{item.quantity}x</span>
                  <span className="item-name">{item.name}</span>
                </div>
                <span className="item-price">
                  ${(parseFloat(item.price.replace('$', '').replace(',', '')) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="order-totals">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLayout(CheckoutPage);