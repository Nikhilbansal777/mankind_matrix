import React, { useState } from 'react';
import { ShoppingBag, CreditCard } from 'lucide-react';
import CouponInput from '../CouponInput';
import './OrderSummary.css';

const OrderSummary = ({ 
  items, 
  subtotal, 
  tax, 
  shipping, 
  discountAmount, 
  finalTotal,
  onPlaceOrder,
  isProcessing 
}) => {
  // Handle coupon application
  const handleCouponApplied = (coupon) => {
    // Calculate discount based on coupon type
    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = (subtotal * coupon.value) / 100;
    } else if (coupon.type === 'FIXED') {
      discount = Math.min(coupon.value, subtotal);
    }
    // Note: In a real implementation, you would update the parent component's discount
    console.log('Coupon applied:', coupon, 'Discount:', discount);
  };

  // Handle coupon removal
  const handleCouponRemoved = () => {
    // Note: In a real implementation, you would clear the parent component's discount
    console.log('Coupon removed');
  };

  return (
    <div className="order-summary">
      <div className="summary-header">
        <ShoppingBag className="summary-icon" />
        <h2>Order Summary</h2>
      </div>
      
      <div className="order-items">
        {items.map(item => (
          <div className="order-item" key={item.id}>
            <div className="order-item-info">
              <span className="item-quantity">{item.quantity}x</span>
              <span className="item-name">{item.productName || item.name}</span>
            </div>
            <span className="item-price">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      
      <div className="order-totals">
        <div className="subtotal">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="tax">
          <span>Tax (10%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="shipping">
          <span>Shipping:</span>
          <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
        </div>
        
        {/* Discount Coupon Section */}
        <CouponInput
          subtotal={subtotal}
          onCouponApplied={handleCouponApplied}
          onCouponRemoved={handleCouponRemoved}
        />
        
        {discountAmount > 0 && (
          <div className="discount">
            <span>Discount:</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="grand-total">
          <span>Total:</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <button 
        className="place-order-btn"
        onClick={onPlaceOrder}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <div className="spinner"></div>
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="order-icon" />
            Place Order
          </>
        )}
      </button>
    </div>
  );
};

export default OrderSummary;
