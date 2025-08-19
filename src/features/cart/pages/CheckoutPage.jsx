import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import withLayout from '../../../layouts/HOC/withLayout';
import CheckoutSteps from '../components/CheckoutSteps';
import Payment from '../components/Payment';
import Address from '../components/Address';
import Shipping from '../components/Shipping';
import OrderSummary from '../components/OrderSummary';
import './CheckoutPage.css';
import { useCart } from '../../../hooks/useCart';
import { useOrders } from '../../../hooks/useOrders';
import { calculateTax, calculateShipping, calculateFinalTotal } from '../utils/calculations';
import { validateCheckoutForm } from '../utils/validators';

const CheckoutPage = () => {
  const { items, subtotal } = useCart();
  const { createOrder, loading: orderLoading, error: orderError, resetError } = useOrders();
  const [deliveryType, setDeliveryType] = useState("standard");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('delivery'); 
  
  // Address selection state
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressError, setAddressError] = useState('');
  
  // Discount coupon state
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
  // Order state
  const [createdOrder, setCreatedOrder] = useState(null);

  // Shipping component handlers
  const handleDeliveryTypeChange = (type) => {
    setDeliveryType(type);
    // Reset date when delivery type changes
    setSelectedDate(null);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Calculate totals using utility functions
  const taxAmount = calculateTax(subtotal);
  const shippingCost = calculateShipping(deliveryType);
  const finalTotal = calculateFinalTotal(subtotal, taxAmount, shippingCost, discountAmount);

  // Handle address selection changes
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setAddressError('');
  };

  const handleContinue = async () => {
    // Validate form using utility function
    const validation = validateCheckoutForm({
      selectedAddress,
      selectedDate,
      items
    });

    if (!validation.isValid) {
      // Show first error
      setAddressError(validation.errors[0]);
      return;
    }

    // Additional validation for shipping date
    if (!selectedDate) {
      setAddressError('Please select a shipping date to continue');
      return;
    }

    // Clear any address errors
    setAddressError('');
    
    // Set loading state
    setIsProcessing(true);
    
    try {
      // Clear any previous errors
      resetError();
      
      // Prepare order data
      const orderData = {
        shippingAddressId: selectedAddress.id,
        shippingValue: shippingCost,
        shippingDate: selectedDate,
        deliveryType: deliveryType,
        couponCode: appliedCoupon?.code || null,
        notes: `Delivery: ${deliveryType === 'express' ? 'Express' : 'Standard'} on ${selectedDate}`
      };

      // Ensure shipping date is properly formatted
      if (orderData.shippingDate instanceof Date) {
        orderData.shippingDate = orderData.shippingDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      }

      // Log the order data being sent (for debugging)
      console.log('Creating order with data:', orderData);

      // Create order via API
      const result = await createOrder(orderData);
      
      // Store the created order
      setCreatedOrder(result);
      
      // Proceed to payment
      setCurrentStep('payment');
      
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false);
        window.location.href = '/confirmation';
      }, 2000);
      
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleBackToDelivery = () => {
    setCurrentStep('delivery');
    setCreatedOrder(null);
  };

  // Handle coupon application
  const handleCouponApplied = (coupon) => {
    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = (subtotal * coupon.value) / 100;
    } else if (coupon.type === 'FIXED') {
      discount = Math.min(coupon.value, subtotal);
    }
    setDiscountAmount(discount);
    setAppliedCoupon(coupon);
  };

  // Handle coupon removal
  const handleCouponRemoved = () => {
    setDiscountAmount(0);
    setAppliedCoupon(null);
  };

  return (
    <div className="delivery-container page" id="delivery-page">
      <CheckoutSteps currentStep={currentStep} />

      <h1>{currentStep === 'delivery' ? 'Select Delivery Options' : ''}</h1>

      {/* Display order creation errors */}
      {orderError && (
        <div className="error-message" style={{ 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          color: '#dc2626', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>⚠️</span>
          <span>{orderError}</span>
          <button 
            onClick={resetError}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: '#dc2626',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ×
          </button>
        </div>
      )}

      <div className="delivery-content">
        <div className="delivery-main">
          {currentStep === 'delivery' ? (
            <>
              {/* Delivery Address Selection */}
              <div className="delivery-section delivery-address">
                <Address 
                  onAddressSelect={handleAddressSelect}
                  selectedAddressId={selectedAddress?.id}
                />
                {addressError && (
                  <div className="address-error-message">
                    {addressError}
                  </div>
                )}
              </div>

              {/* Shipping Component - Only show when address is selected */}
              {selectedAddress && (
                <Shipping
                  deliveryType={deliveryType}
                  onDeliveryTypeChange={handleDeliveryTypeChange}
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                />
              )}
            </>
          ) : (
            // Payment Section
            <Payment 
              deliveryType={deliveryType}
              selectedDate={selectedDate}
              selectedAddress={selectedAddress}
              createdOrder={createdOrder}
              onBackToDelivery={handleBackToDelivery}
              onPlaceOrder={handlePlaceOrder}
              isProcessing={isProcessing || orderLoading}
            />
          )}
        </div>

        {/* Only show sidebar summary during delivery step */}
        {currentStep === 'delivery' && (
          <div className="delivery-sidebar">
            {/* Order Summary */}
            <OrderSummary
              items={createdOrder ? createdOrder.items : items}
              subtotal={createdOrder ? createdOrder.subtotal : subtotal}
              tax={createdOrder ? createdOrder.tax : taxAmount}
              shipping={createdOrder ? createdOrder.shippingValue : shippingCost}
              discountAmount={createdOrder ? createdOrder.discounts : discountAmount}
              finalTotal={createdOrder ? createdOrder.total : finalTotal}
              createdOrder={createdOrder}
              showCouponInput={!createdOrder}
              showPlaceOrderButton={false}
              onCouponApplied={handleCouponApplied}
              onCouponRemoved={handleCouponRemoved}
            />

            {currentStep === 'delivery' && (
              <>
                <div className="delivery-info">
                  {selectedAddress && deliveryType && selectedDate ? (
                    <div className="selected-delivery">
                      <h3>Selected Delivery:</h3>
                      <p>{deliveryType === 'express' ? 'Express Delivery' : 'Standard Delivery'}</p>
                      <p>{selectedDate}</p>
                      <div className="selected-address">
                        <h4>Delivery Address:</h4>
                        <p>{selectedAddress.streetAddress}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}, {selectedAddress.country}</p>
                      </div>
                      {createdOrder && (
                        <div className="order-info">
                          <h4>Order Created:</h4>
                          <p>Order #{createdOrder.orderNumber || createdOrder.id}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="delivery-prompt">
                      {!selectedAddress && <p>Please select a delivery address</p>}
                      {selectedAddress && !deliveryType && <p>Please select a delivery method</p>}
                      {selectedAddress && deliveryType && !selectedDate && <p>Please select a delivery date</p>}
                    </div>
                  )}
                </div>

                <button
                  className="continue-button"
                  onClick={handleContinue}
                  disabled={!selectedAddress || !deliveryType || !selectedDate || isProcessing}
                >
                  {isProcessing ? 'Creating Order...' : 'Continue to Payment'}
                </button>

                <Link to="/cart" className="back-link">
                  Return to Cart
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default withLayout(CheckoutPage);
