import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-toastify';
import OrderSummary from '../OrderSummary';
import DeliverySummary from '../DeliverySummary';
import PaymentFormContainer from './PaymentFormContainer';
import { useOrders } from '../../../../hooks/useOrders';
import { handlePaymentSuccess, handlePaymentError } from '../../../../utils/payment';
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
  const [selectedProvider, setSelectedProvider] = useState('STRIPE');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentIntentLoading, setPaymentIntentLoading] = useState(false);
  
  const { createPaymentIntent, payOrder } = useOrders();

  const toggleOrderSummary = () => {
    setOrderSummaryOpen(!orderSummaryOpen);
  };

  const toggleDeliverySummary = () => {
    setDeliverySummaryOpen(!deliverySummaryOpen);
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setShowPaymentForm(false);
  };

  const handlePayClick = async () => {
    if (selectedProvider === 'STRIPE') {
      setPaymentIntentLoading(true);
      try {
        // Call the payment intent API
        await createPaymentIntent(createdOrder.id, selectedProvider);
        setShowPaymentForm(true);
      } catch (error) {
        console.error('Failed to create payment intent:', error);
        // Show error message to user using toast
        toast.error('Failed to create payment intent. Please try again.', {
          position: 'bottom-center'
        });
      } finally {
        setPaymentIntentLoading(false);
      }
    } else if (selectedProvider === 'PAYPAL') {
      setShowPaymentForm(true);
    }
  };

  const handleStripePaymentSuccess = async (paymentIntent) => {
    console.log('Stripe payment successful:', paymentIntent);
    
    try {
      // Call the pay endpoint with the payment intent ID
      const paidOrder = await payOrder(createdOrder.id, paymentIntent.id);
      
      // Use utility function to handle success
      handlePaymentSuccess(paidOrder);
    } catch (error) {
      // Use utility function to handle error and show toast
      const errorMessage = handlePaymentError(error, 'Payment successful but confirmation failed. Please contact support.');
      toast.error(errorMessage, {
        position: 'bottom-center'
      });
    }
  };

  const handleStripePaymentError = (error) => {
    console.error('Stripe payment failed:', error);
    // Error is handled within the Stripe component
  };

  // Convert total to cents for Stripe (amount should be in smallest currency unit)
  const stripeAmount = createdOrder ? Math.round(parseFloat(createdOrder.total) * 100) : 0;

  return (
    <div className={styles.paymentSection}>
      <h1>Complete Payment</h1>
      
      <div className={styles.paymentLayout}>
        {/* Left Side - Payment */}
        <div className={styles.paymentLeft}>
          <PaymentFormContainer
            orderId={createdOrder?.id}
            amount={stripeAmount}
            currency="USD"
            onPaymentSuccess={handleStripePaymentSuccess}
            onPaymentError={handleStripePaymentError}
            isProcessing={isProcessing}
            selectedProvider={selectedProvider}
            onProviderSelect={handleProviderSelect}
            showPaymentForm={showPaymentForm}
            paymentIntentLoading={paymentIntentLoading}
          />
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
          
          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            {!showPaymentForm && (
              <button
                type="button"
                className={styles.payButton}
                onClick={handlePayClick}
                disabled={isProcessing || paymentIntentLoading}
              >
                {paymentIntentLoading ? (
                  <>
                    <div className={styles.buttonLoadingSpinner}></div>
                    Generating Payment...
                  </>
                ) : isProcessing ? (
                  'Processing...'
                ) : (
                  `Pay with ${selectedProvider}`
                )}
              </button>
            )}
            
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
