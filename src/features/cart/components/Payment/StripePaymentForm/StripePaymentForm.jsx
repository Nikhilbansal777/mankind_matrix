import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { formatCurrency } from '../../../utils/formatCurrency';
import './StripePaymentForm.css';

const StripePaymentForm = ({ 
  orderId, 
  amount, 
  currency = 'USD',
  paymentIntent,
  onPaymentSuccess, 
  onPaymentError,
  isProcessing 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !paymentIntent) {
      return;
    }

    setPaymentLoading(true);
    setError(null);

    try {
      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(
        paymentIntent.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              // You can add billing details here if needed
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        onPaymentError?.(stripeError.message);
      } else if (confirmedIntent.status === 'succeeded') {
        // Payment successful
        onPaymentSuccess?.(confirmedIntent);
      } else {
        setError('Payment failed. Please try again.');
        onPaymentError?.('Payment failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      onPaymentError?.('An unexpected error occurred. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      <div className="payment-amount">
        <h3>Payment Amount</h3>
        <p className="amount">
          {formatCurrency(amount / 100, currency)}
        </p>
      </div>

      <div className="card-element-container">
        <label htmlFor="card-element">Credit or debit card</label>
        <CardElement
          id="card-element"
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="payment-error">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || paymentLoading || isProcessing}
        className="payment-button"
      >
        {paymentLoading || isProcessing ? 'Processing...' : `Pay ${formatCurrency(amount / 100, currency)}`}
      </button>
    </form>
  );
};

export default StripePaymentForm;
