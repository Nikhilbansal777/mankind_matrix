import React from 'react';
import { CreditCard } from 'lucide-react';
import CouponInput from '../CouponInput';
import './OrderSummary.css';

const OrderSummary = ({ 
  items, 
  subtotal, 
  tax, 
  shipping, 
  discountAmount, 
  finalTotal,
  createdOrder,
  showCouponInput = true,
  showPlaceOrderButton = true,
  onPlaceOrder,
  isProcessing,
  onCouponApplied,
  onCouponRemoved
}) => {
  return (
    <div className="order-summary">
      <div className="summary-header">
        {createdOrder && (
          <div className="order-number">
            <span>Order #{createdOrder.orderNumber || createdOrder.id}</span>
          </div>
        )}
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
        
        {/* Discount Coupon Section - Only show if enabled */}
        {showCouponInput && onCouponApplied && onCouponRemoved && (
          <CouponInput
            subtotal={subtotal}
            onCouponApplied={onCouponApplied}
            onCouponRemoved={onCouponRemoved}
          />
        )}
        
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

      {/* Place Order Button - Only show if enabled */}
      {showPlaceOrderButton && onPlaceOrder && (
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
      )}
    </div>
  );
};

export default OrderSummary;
