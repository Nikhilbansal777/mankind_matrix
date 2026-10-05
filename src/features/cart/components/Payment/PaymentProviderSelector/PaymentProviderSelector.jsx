import React from 'react';
import { Check, CreditCard } from 'lucide-react';
import { PAYMENT_PROVIDERS, PAYMENT_PROVIDER_NAMES } from '../../../utils/constants';
import './PaymentProviderSelector.css';

const PaymentProviderSelector = ({ 
  selectedProvider, 
  onProviderSelect,
  availableProviders = [PAYMENT_PROVIDERS.STRIPE, PAYMENT_PROVIDERS.PAYPAL]
}) => {
  const getProviderIcon = (provider) => {
    switch (provider) {
      case PAYMENT_PROVIDERS.STRIPE:
        return <CreditCard className="payment-icon stripe-icon" />;
      case PAYMENT_PROVIDERS.PAYPAL:
        return <CreditCard className="payment-icon paypal-icon" />;
      default:
        return <CreditCard className="payment-icon" />;
    }
  };

  const getProviderDescription = (provider) => {
    switch (provider) {
      case PAYMENT_PROVIDERS.STRIPE:
        return 'Secure payment processing with Stripe - Accepts all major cards';
      case PAYMENT_PROVIDERS.PAYPAL:
        return 'Pay securely with PayPal - Fast, secure, and trusted worldwide';
      default:
        return 'Secure payment processing';
    }
  };

  return (
    <div className="payment-provider-selector">
      <h2>Select Payment Method</h2>
      
      {availableProviders.map((provider) => (
        <div 
          key={provider}
          className={`payment-provider ${selectedProvider === provider ? 'selected' : ''}`}
          onClick={() => onProviderSelect(provider)}
          data-provider={provider}
        >
          <div className="payment-provider-info">
            {getProviderIcon(provider)}
            <div className="payment-provider-details">
              <h3>{PAYMENT_PROVIDER_NAMES[provider]}</h3>
              <p>{getProviderDescription(provider)}</p>
            </div>
          </div>
          {selectedProvider === provider && <Check className="payment-check" />}
        </div>
      ))}
    </div>
  );
};

export default PaymentProviderSelector;
