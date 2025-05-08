import React, { useState } from 'react';
import './payments.css';
import { CreditCard, Wallet, Gift } from 'lucide-react';
import AccountNavigation from './AccountNavigation'; // Import the shared navigation component
import styles from './ProfilePage.module.css'; // Import shared styles
import withLayout from '../../layouts/HOC/withLayout';

const PaymentMethods = ({ onPaymentMethodChange }) => {
  const [selectedMethod, setSelectedMethod] = useState('credit-card');

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
    if (onPaymentMethodChange) {
      onPaymentMethodChange(method);
    }
  };

  return (
    <div className="payment-methods-container">
      <AccountNavigation />
      
      <div className="payment-methods-content">
        <h2 className="page-title">Payment Methods</h2>
        <div className="payment-methods">
          <h3 className="payment-methods-title">Select Payment Method</h3>
          
          <div className="payment-options">
            <div 
              className={`payment-option ${selectedMethod === 'credit-card' ? 'selected' : ''}`}
              onClick={() => handleMethodChange('credit-card')}
            >
              <div className="payment-option-icon">
                <CreditCard size={24} />
              </div>
              <div className="payment-option-details">
                <h4>Credit Card</h4>
                <p>Pay securely with your credit card</p>
              </div>
              <div className="payment-option-select">
                <input 
                  type="radio" 
                  name="payment-method" 
                  checked={selectedMethod === 'credit-card'} 
                  onChange={() => {}} 
                />
              </div>
            </div>

            <div 
              className={`payment-option ${selectedMethod === 'digital-wallet' ? 'selected' : ''}`}
              onClick={() => handleMethodChange('digital-wallet')}
            >
              <div className="payment-option-icon">
                <Wallet size={24} />
              </div>
              <div className="payment-option-details">
                <h4>Digital Wallet</h4>
                <p>Pay with your digital wallet</p>
              </div>
              <div className="payment-option-select">
                <input 
                  type="radio" 
                  name="payment-method" 
                  checked={selectedMethod === 'digital-wallet'} 
                  onChange={() => {}} 
                />
              </div>
            </div>

            <div 
              className={`payment-option ${selectedMethod === 'gift-card' ? 'selected' : ''}`}
              onClick={() => handleMethodChange('gift-card')}
            >
              <div className="payment-option-icon">
                <Gift size={24} />
              </div>
              <div className="payment-option-details">
                <h4>Gift Card</h4>
                <p>Redeem a gift card</p>
              </div>
              <div className="payment-option-select">
                <input 
                  type="radio" 
                  name="payment-method" 
                  checked={selectedMethod === 'gift-card'} 
                  onChange={() => {}} 
                />
              </div>
            </div>
          </div>

          {selectedMethod === 'credit-card' && (
            <div className="payment-details credit-card-details">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="card-number">Card Number</label>
                  <input 
                    type="text" 
                    id="card-number" 
                    placeholder="1234 5678 9012 3456" 
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="card-name">Name on Card</label>
                  <input 
                    type="text" 
                    id="card-name" 
                    placeholder="John Doe" 
                  />
                </div>
              </div>
              
              <div className="form-row two-columns">
                <div className="form-group">
                  <label htmlFor="expiry-date">Expiry Date</label>
                  <input 
                    type="text" 
                    id="expiry-date" 
                    placeholder="MM/YY" 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input 
                    type="text" 
                    id="cvv" 
                    placeholder="123" 
                  />
                </div>
              </div>

              <div className="form-row">
                <button className="save-card-button">Save Card</button>
              </div>
            </div>
          )}

          {selectedMethod === 'digital-wallet' && (
            <div className="payment-details wallet-details">
              <div className="wallet-options">
                <button className="wallet-option">
                  <img src="/api/placeholder/120/40" alt="PayPal" />
                </button>
                <button className="wallet-option">
                  <img src="/api/placeholder/120/40" alt="Apple Pay" />
                </button>
                <button className="wallet-option">
                  <img src="/api/placeholder/120/40" alt="Google Pay" />
                </button>
              </div>
              <p className="wallet-instruction">Select a digital wallet to continue</p>
            </div>
          )}

          {selectedMethod === 'gift-card' && (
            <div className="payment-details gift-card-details">
              <div className="form-group">
                <label htmlFor="gift-card-number">Gift Card Number</label>
                <input 
                  type="text" 
                  id="gift-card-number" 
                  placeholder="Enter gift card code" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="gift-card-pin">PIN (if applicable)</label>
                <input 
                  type="text" 
                  id="gift-card-pin" 
                  placeholder="Enter PIN" 
                />
              </div>
              <button className="verify-gift-card">Verify Card</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withLayout(PaymentMethods);