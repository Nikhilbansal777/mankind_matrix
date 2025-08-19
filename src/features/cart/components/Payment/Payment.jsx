import React from 'react';
import { ArrowLeft, Check, CreditCard } from 'lucide-react';
import OrderSummary from '../OrderSummary';
import DeliverySummary from '../DeliverySummary';
import './Payment.css';

const Payment = ({ 
  deliveryType, 
  selectedDate, 
  selectedAddress,
  createdOrder,
  onBackToDelivery,
  onPlaceOrder,
  isProcessing 
}) => {

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    onPlaceOrder();
  };

  return (
    <div className="payment-section">
      {/* Delivery Summary - First */}
      <DeliverySummary
        deliveryType={deliveryType}
        selectedDate={selectedDate}
        selectedAddress={selectedAddress}
        title="Delivery Summary"
      />

      {/* Order Summary Component - Second */}
      {createdOrder && (
        <OrderSummary
          items={createdOrder.items}
          subtotal={createdOrder.subtotal}
          tax={createdOrder.tax}
          shipping={createdOrder.shippingValue}
          discountAmount={createdOrder.discounts}
          finalTotal={createdOrder.total}
          createdOrder={createdOrder}
          showCouponInput={false}
          showPlaceOrderButton={false}
        />
      )}
      
      {/* Payment Methods - Third */}
      <div className="payment-methods">
        <h2>Select Payment Method</h2>
        <div className={`payment-method selected`}>
          <div className="payment-method-info">
            <CreditCard className="payment-icon" />
            <div className="payment-details">
              <h3>Credit Card</h3>
              <p>Pay securely with your credit or debit card</p>
            </div>
          </div>
          <Check className="payment-check" />
        </div>
      </div>

      {/* Payment Form */}
      <div className="payment-form">
        <form onSubmit={handlePaymentSubmit}>
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="text"
                id="expiryDate"
                placeholder="MM/YY"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                placeholder="123"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="cardholderName">Cardholder Name</label>
            <input
              type="text"
              id="cardholderName"
              placeholder="John Doe"
              required
            />
          </div>
        </form>
      </div>

      {/* Action Buttons */}
      <div className="payment-actions">
        <button
          type="button"
          className="back-button"
          onClick={onBackToDelivery}
          disabled={isProcessing}
        >
          <ArrowLeft size={16} />
          Back to Delivery
        </button>
        
        <button
          type="submit"
          className="place-order-button"
          onClick={handlePaymentSubmit}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing Payment...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default Payment;
