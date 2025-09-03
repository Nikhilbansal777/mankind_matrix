import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { paymentConfig } from '../../../../../config/payment';
import { PAYMENT_PROVIDERS } from '../../../utils/constants';
import { useOrders } from '../../../../../hooks/useOrders';
import PaymentProviderSelector from '../PaymentProviderSelector';
import StripePaymentForm from '../StripePaymentForm';
import './PaymentFormContainer.css';

// Load Stripe outside of component to avoid recreating on every render
const stripePromise = loadStripe(paymentConfig.stripe.publishableKey);

const PaymentFormContainer = ({ 
  orderId, 
  amount, // Amount in cents from parent component
  currency = 'USD',
  onPaymentSuccess, 
  onPaymentError,
  isProcessing,
  selectedProvider,
  onProviderSelect,
  showPaymentForm,
  paymentIntentLoading
}) => {
  const { paymentIntent, paymentIntentError } = useOrders();

  const renderPaymentForm = () => {
    if (!showPaymentForm) {
      return (
        <div className="payment-method-selection">
          <h3>Select Payment Method</h3>
          <PaymentProviderSelector
            selectedProvider={selectedProvider}
            onProviderSelect={onProviderSelect}
            availableProviders={[PAYMENT_PROVIDERS.STRIPE, PAYMENT_PROVIDERS.PAYPAL]}
          />
        </div>
      );
    }

    if (selectedProvider === PAYMENT_PROVIDERS.STRIPE) {
      if (paymentIntentError) {
        return (
          <div className="payment-error">
            <p>Error: {paymentIntentError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              Retry
            </button>
          </div>
        );
      }

      if (!paymentIntent) {
        return (
          <div className="payment-error">
            <p>Unable to initialize payment. Please try again.</p>
            <button 
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              Retry
            </button>
          </div>
        );
      }

      // Check if the backend returned a different provider than requested
      const actualProvider = paymentIntent.provider || selectedProvider;
      const providerName = paymentIntent.providerName || actualProvider;

      if (actualProvider === PAYMENT_PROVIDERS.STRIPE) {
        // Use paymentIntent.amount if available (from backend), otherwise fall back to amount prop
        // Both are expected to be in cents
        const paymentAmount = paymentIntent.amount || amount;
        
        return (
          <Elements stripe={stripePromise}>
            <StripePaymentForm
              orderId={orderId}
              amount={paymentAmount} // Amount in cents
              currency={paymentIntent.currency || currency}
              paymentIntent={paymentIntent}
              onPaymentSuccess={onPaymentSuccess}
              onPaymentError={onPaymentError}
              isProcessing={isProcessing}
            />
          </Elements>
        );
      } else {
        return (
          <div className="payment-not-implemented">
            <p>⚠️ {providerName} payments are not supported.</p>
            <p>Please select a different payment method.</p>
          </div>
        );
      }
    }
    
    if (selectedProvider === PAYMENT_PROVIDERS.PAYPAL) {
      return (
        <div className="payment-not-implemented">
          <p>⚠️ PayPal payments are not implemented yet.</p>
          <p>Please select a different payment method.</p>
        </div>
      );
    }
    
    return (
      <div className="payment-not-implemented">
        <p>⚠️ {selectedProvider} payments are not supported.</p>
        <p>Please select a different payment method.</p>
      </div>
    );
  };

  return (
    <div className="payment-form-container">
      <div className="payment-form-wrapper">
        {renderPaymentForm()}
      </div>
    </div>
  );
};

export default PaymentFormContainer;
