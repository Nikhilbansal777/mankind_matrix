import React, { useState } from 'react';
import { ArrowLeft, Check, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import OrderSummary from '../OrderSummary';
import DeliverySummary from '../DeliverySummary';
import styles from './Payment.module.css';

const Payment = ({ 
  deliveryType, 
  selectedDate, 
  selectedAddress,
  createdOrder,
  onBackToDelivery,
  onPlaceOrder,
  isProcessing 
}) => {
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(true);
  const [deliverySummaryOpen, setDeliverySummaryOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paypal');

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    onPlaceOrder({ method: selectedPaymentMethod });
  };

  const toggleOrderSummary = () => {
    setOrderSummaryOpen(!orderSummaryOpen);
  };

  const toggleDeliverySummary = () => {
    setDeliverySummaryOpen(!deliverySummaryOpen);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };



  const getPaymentMethodName = (method) => {
    switch (method) {
      case 'paypal':
        return 'PayPal';
      case 'stripe':
        return 'Stripe';
      default:
        return 'PayPal';
    }
  };

  return (
    <div className={styles.paymentSection}>
      <h1>Complete Payment</h1>
      
      <div className={styles.paymentLayout}>
        {/* Left Side - Payment */}
        <div className={styles.paymentLeft}>
          <div className={styles.paymentMethods}>
            <h2>Select Payment Method</h2>
            
            {/* PayPal */}
            <div 
              className={`${styles.paymentMethod} ${selectedPaymentMethod === 'paypal' ? styles.selected : ''}`}
              onClick={() => handlePaymentMethodSelect('paypal')}
              data-method="paypal"
            >
              <div className={styles.paymentMethodInfo}>
                <CreditCard className={styles.paymentIcon} />
                <div className={styles.paymentDetails}>
                  <h3>PayPal</h3>
                  <p>Pay securely with PayPal - Fast, secure, and trusted worldwide</p>
                </div>
              </div>
              {selectedPaymentMethod === 'paypal' && <Check className={styles.paymentCheck} />}
            </div>

            {/* Stripe */}
            <div 
              className={`${styles.paymentMethod} ${selectedPaymentMethod === 'stripe' ? styles.selected : ''}`}
              onClick={() => handlePaymentMethodSelect('stripe')}
              data-method="stripe"
            >
              <div className={styles.paymentMethodInfo}>
                <CreditCard className={styles.paymentIcon} />
                <div className={styles.paymentDetails}>
                  <h3>Stripe</h3>
                  <p>Secure payment processing with Stripe - Accepts all major cards</p>
                </div>
              </div>
              {selectedPaymentMethod === 'stripe' && <Check className={styles.paymentCheck} />}
            </div>
          </div>
        </div>

        {/* Right Side - Summaries and Buttons */}
        <div className={styles.summariesRight}>
          {/* Order Summary Accordion */}
          <div className={styles.accordionSection}>
            <button 
              className={styles.accordionHeader}
              onClick={toggleOrderSummary}
            >
              <h3>Order Summary</h3>
              {orderSummaryOpen ? (
                <ChevronUp size={20} className={styles.accordionIcon} />
              ) : (
                <ChevronDown size={20} className={styles.accordionIcon} />
              )}
            </button>
            {orderSummaryOpen && (
              <div className={styles.accordionContent}>
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
              </div>
            )}
          </div>

          {/* Delivery Summary Accordion */}
          <div className={styles.accordionSection}>
            <button 
              className={styles.accordionHeader}
              onClick={toggleDeliverySummary}
            >
              <h3>Delivery Summary</h3>
              {deliverySummaryOpen ? (
                <ChevronUp size={20} className={styles.accordionIcon} />
              ) : (
                <ChevronDown size={20} className={styles.accordionIcon} />
              )}
            </button>
            {deliverySummaryOpen && (
              <div className={styles.accordionContent}>
                <DeliverySummary
                  deliveryType={deliveryType}
                  selectedDate={selectedDate}
                  selectedAddress={selectedAddress}
                  title=""
                />
              </div>
            )}
          </div>

          {/* Action Buttons - Positioned like delivery mode */}
          <div className={styles.paymentActions}>
            <button
              type="submit"
              className={styles.placeOrderButton}
              onClick={handlePaymentSubmit}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing Payment...' : `Pay with ${getPaymentMethodName(selectedPaymentMethod)}`}
            </button>
            
            <button
              type="button"
              className={styles.backButton}
              onClick={onBackToDelivery}
              disabled={isProcessing}
            >
              <ArrowLeft size={16} />
              Back to Delivery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
