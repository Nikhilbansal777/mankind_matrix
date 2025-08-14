import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Check, MapPin, Calendar, Clock, Truck } from 'lucide-react';
import './Payment.css';

const Payment = ({ 
  deliveryType, 
  selectedDate, 
  selectedTimeSlot, 
  deliveryOptions,
  onBackToDelivery,
  onPlaceOrder,
  isProcessing 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('paypal');

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    onPlaceOrder();
  };

  return (
    <div className="payment-section">
      {/* Updated Delivery Summary */}
      <div className="content-card">
        <h2>Delivery Summary</h2>
        <div className="delivery-summary-content">
          <div className="delivery-summary-row">
            <div className="summary-icon">
              {deliveryType === "express" ? <Clock size={18} /> : <Truck size={18} />}
            </div>
            <div className="summary-detail">
              <span className="detail-label">Method</span>
              <span className="detail-value">{deliveryOptions[deliveryType]?.title}</span>
            </div>
          </div>
          
          <div className="delivery-summary-row">
            <div className="summary-icon">
              <Calendar size={18} />
            </div>
            <div className="summary-detail">
              <span className="detail-label">Date</span>
              <span className="detail-value">{selectedDate}</span>
            </div>
          </div>
          
          <div className="delivery-summary-row">
            <div className="summary-icon">
              <Clock size={18} />
            </div>
            <div className="summary-detail">
              <span className="detail-label">Time</span>
              <span className="detail-value">{selectedTimeSlot}</span>
            </div>
          </div>
          
          <div className="delivery-summary-row">
            <div className="summary-icon">
              <MapPin size={18} />
            </div>
            <div className="summary-detail address-detail">
              <span className="detail-label">Address</span>
              <span className="detail-value">
                123 Main Street, Apt 4B<br/>
                New York, NY 10001
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="payment-methods">
        <h2>Select Payment Method</h2>
        <div 
          className={`payment-method selected`}
        >
          <div className="method-icon">
            <CreditCard size={24} />
          </div>
          <div className="method-details">
            <h3>PayPal</h3>
            <p>Pay securely with your PayPal account</p>
          </div>
          <div className="method-check">
            <Check size={16} />
          </div>
        </div>
      </div>
      
      <form className="content-card payment-form" onSubmit={handlePaymentSubmit}>
        <h2>Payment Information</h2>
        
        <div className="paypal-info">
          <div className="paypal-logo">
            <span className="paypal-text">PayPal</span>
          </div>
          <p className="paypal-description">
            You will be redirected to PayPal to complete your payment securely. 
            After successful payment, you will be redirected back to complete your order.
          </p>
        </div>
        
        <div className="button-group">
          <button 
            type="button" 
            className="back-button"
            onClick={onBackToDelivery}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          
          <button 
            type="submit" 
            className="place-order-button"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Proceed to PayPal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Payment;
