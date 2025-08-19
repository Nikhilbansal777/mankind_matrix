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
import { CHECKOUT_STEPS } from '../utils/constants';

const CheckoutPage = () => {
  const { items, subtotal } = useCart();
  const { createOrder, loading: orderLoading, error: orderError, resetError } = useOrders();
  const [deliveryType, setDeliveryType] = useState("standard");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(CHECKOUT_STEPS.DELIVERY); 
  
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
        shippingAddressId: Number(selectedAddress.id),
        shippingValue: Number(shippingCost),
        shippingDate: selectedDate,
        deliveryType: deliveryType === 'standard' ? 'STANDARD' : 'EXPRESS',
        couponCode: appliedCoupon?.code || null,
        notes: `Delivery: ${deliveryType === 'express' ? 'Express' : 'Standard'} on ${selectedDate}`
      };

      // Ensure shipping date is properly formatted as YYYY-MM-DD
      if (orderData.shippingDate) {
        // The date should already be in YYYY-MM-DD format from Shipping component
        // Just verify it's a valid date string
        if (!/^\d{4}-\d{2}-\d{2}$/.test(orderData.shippingDate)) {
          setAddressError('Invalid shipping date format');
          setIsProcessing(false);
          return;
        }
      }

      // Ensure couponCode is properly formatted
      if (orderData.couponCode === null || orderData.couponCode === undefined) {
        orderData.couponCode = null; // Explicitly set to null
      } else if (typeof orderData.couponCode === 'string') {
        const trimmedCode = orderData.couponCode.trim();
        orderData.couponCode = trimmedCode.length > 0 ? trimmedCode : null;
      } else {
        orderData.couponCode = null; // Fallback to null for any other type
      }

      // Validate required fields
      if (!orderData.shippingAddressId || !orderData.shippingDate || !orderData.deliveryType) {
        setAddressError('Missing required shipping information');
        setIsProcessing(false);
        return;
      }

      // Final data validation and formatting
      const finalOrderData = {
        shippingAddressId: orderData.shippingAddressId,
        shippingValue: orderData.shippingValue,
        shippingDate: orderData.shippingDate,
        deliveryType: orderData.deliveryType,
        couponCode: orderData.couponCode,
        notes: orderData.notes
      };

      // Log the order data being sent (for debugging)
      console.log('Creating order with data:', finalOrderData);
      console.log('Data types:', {
        shippingAddressId: typeof finalOrderData.shippingAddressId,
        shippingValue: typeof finalOrderData.shippingValue,
        shippingDate: typeof finalOrderData.shippingDate,
        deliveryType: typeof finalOrderData.deliveryType,
        couponCode: typeof finalOrderData.couponCode,
        notes: typeof finalOrderData.notes
      });
      console.log('JSON.stringify result:', JSON.stringify(finalOrderData));
      console.log('API endpoint:', 'POST /api/v1/orders/');
      console.log('Request headers:', { 'Content-Type': 'application/json' });

      // Create order via API
      const result = await createOrder(finalOrderData);
      
      // Store the created order
      setCreatedOrder(result);
      
      // Proceed to payment
      setCurrentStep(CHECKOUT_STEPS.PAYMENT);
      
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
      // In a real implementation, this would redirect to the selected payment method
      console.log('Processing payment...');
      
      setTimeout(() => {
        setIsProcessing(false);
        // Simulate successful payment and redirect to confirmation with order data
        const orderData = {
          orderNumber: createdOrder?.orderNumber || createdOrder?.id || `ORD-${Date.now()}`,
          orderDate: new Date().toLocaleDateString(),
          total: createdOrder?.total || finalTotal
        };
        
        // Navigate to confirmation page with order data
        window.location.href = `/confirmation?orderData=${encodeURIComponent(JSON.stringify(orderData))}`;
      }, 2000);
      
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleBackToDelivery = () => {
    setCurrentStep(CHECKOUT_STEPS.DELIVERY);
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

      <h1>{currentStep === CHECKOUT_STEPS.DELIVERY ? 'Select Delivery Options' : ''}</h1>

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
          {currentStep === CHECKOUT_STEPS.DELIVERY ? (
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
        {currentStep === CHECKOUT_STEPS.DELIVERY && (
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

            {currentStep === CHECKOUT_STEPS.DELIVERY && (
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
