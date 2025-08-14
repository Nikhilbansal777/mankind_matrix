import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Truck, Check } from 'lucide-react';
import withLayout from '../../../layouts/HOC/withLayout';
import CheckoutSteps from '../components/CheckoutSteps';
import Payment from '../components/Payment';
import Address from '../components/Address';
import './CheckoutPage.css';
import { useCart } from '../../../hooks/useCart';
import CouponInput from '../components/CouponInput';

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const [deliveryType, setDeliveryType] = useState("standard");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deliveryOptions, setDeliveryOptions] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('delivery'); 
  
  // Address selection state
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressError, setAddressError] = useState('');
  
  // Discount coupon state
  const [discountAmount, setDiscountAmount] = useState(0);

  const taxRate = 0.10;
  // Use subtotal for tax calculation, not total (which already includes tax)
  const taxAmount = subtotal * taxRate;
  const deliveryFee = deliveryOptions[deliveryType]?.price || 0;
  // Calculate final total using subtotal + tax + delivery - discount
  const finalTotal = subtotal + taxAmount + deliveryFee - discountAmount;



  // Default delivery options if API fails
  const getDefaultDeliveryOptions = () => {
    const currentDate = new Date();
    
    // Standard delivery dates (starting from current date + 5 days / 120 hours)
    const standardDeliveryDays = [];
    for (let i = 0; i < 3; i++) {
      const deliveryDate = new Date(currentDate);
      deliveryDate.setHours(currentDate.getHours() + 120 + (i * 24)); // 5 days + additional days
      
      const formattedDate = deliveryDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
      const dayName = deliveryDate.toLocaleDateString('en-US', { weekday: 'long' });
      
      standardDeliveryDays.push({
        date: formattedDate,
        day: dayName,
        slots: ["8AM - 12PM", "12PM - 4PM", "4PM - 9PM"]
      });
    }
    
    // Express delivery dates (starting from current date + 3 days / 72 hours)
    const expressDeliveryDays = [];
    for (let i = 0; i < 3; i++) {
      const deliveryDate = new Date(currentDate);
      deliveryDate.setHours(currentDate.getHours() + 72 + (i * 24)); 
      
      const formattedDate = deliveryDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
      const dayName = deliveryDate.toLocaleDateString('en-US', { weekday: 'long' });
      
      expressDeliveryDays.push({
        date: formattedDate,
        day: dayName,
        slots: ["10AM - 2PM", "2PM - 6PM", "6PM - 9PM"]
      });
    }
    
    return {
      standard: {
        title: "Standard Delivery",
        price: 0,
        icon: <Truck className="text-gray-500" />,
        deliveryDays: standardDeliveryDays
      },
      express: {
        title: "Express Delivery",
        price: 9.99,
        icon: <Clock className="text-blue-500" />,
        deliveryDays: expressDeliveryDays
      }
    };
  };

  // Try to fetch delivery options from API, fallback to default options
  const fetchDeliveryOptions = useCallback(async () => {
    try {
      const response = await fetch('/api/delivery-options');
      
      if (!response.ok) {
        throw new Error('API returned error status: ' + response.status);
      }
      
      const data = await response.json();
      setDeliveryOptions(data);
    } catch (error) {
      console.log('API fetch failed, using default delivery options:', error);
      
      const defaultOptions = getDefaultDeliveryOptions();
      setDeliveryOptions(defaultOptions);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveryOptions();

    if (window.app && typeof window.app.initDeliveryPage === 'function') {
      window.app.initDeliveryPage();
    } else {
      initBoxInteractions();
    }

    return () => {
      
    };
  }, [fetchDeliveryOptions]);

  // Handle address selection changes
  const handleAddressSelect = (address) => {
    console.log('Address selected in CheckoutPage:', address);
    setSelectedAddress(address);
    setAddressError(''); // Clear any previous address errors
  };

  useEffect(() => {
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  }, [deliveryType]);

  const initBoxInteractions = () => {
    const boxes = document.querySelectorAll('.delivery-option');
    boxes.forEach(box => {
      box.addEventListener('mouseenter', () => box.classList.add('option-hover'));
      box.addEventListener('mouseleave', () => box.classList.remove('option-hover'));
    });
  };

  const handleContinue = () => {
    // Validate address selection
    if (!selectedAddress) {
      setAddressError('Please select a delivery address to continue');
      return;
    }

    // Validate delivery date and time
    if (!selectedDate || !selectedTimeSlot) {
      alert("Please select both a delivery date and time slot");
      return;
    }

    // Clear any address errors
    setAddressError('');
    setCurrentStep('payment');
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    
    // Simulate PayPal redirect
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      window.location.href = '/confirmation';
    }, 2000);
  };

  const handleBackToDelivery = () => {
    setCurrentStep('delivery');
  };

  const getImageUrl = (item) => {
    if (item.image) return item.image;
    if (item.imageUrl) return item.imageUrl;
    if (item.productImage) return item.productImage;
    
    if (item.product && item.product.imageUrl) return item.product.imageUrl;
    
    return null;
  };

    // Handle coupon application
  const handleCouponApplied = (coupon) => {
    // Calculate discount based on coupon type
    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = (subtotal * coupon.value) / 100;
    } else if (coupon.type === 'FIXED') {
      discount = Math.min(coupon.value, subtotal);
    }
    setDiscountAmount(discount);
  };

  // Handle coupon removal
  const handleCouponRemoved = () => {
    setDiscountAmount(0);
  };

  if (isLoading) {
    return (
      <div className="delivery-container page" id="delivery-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading delivery options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="delivery-container page" id="delivery-page">
      <CheckoutSteps currentStep={currentStep} />

      <h1>{currentStep === 'delivery' ? 'Select Delivery Options' : 'Payment Information'}</h1>

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

              {/* Delivery Type Selection - Only show when address is selected */}
              {selectedAddress && (
                <div className="delivery-section delivery-options">
                  <h2>Delivery Method</h2>
                  <div className="delivery-types">
                    <div
                      className={`delivery-option ${deliveryType === "standard" ? "selected" : ""}`}
                      onClick={() => setDeliveryType("standard")}
                    >
                      <div className="option-icon">
                        <Truck size={20} />
                      </div>
                      <div className="option-details">
                        <h3>Standard Delivery</h3>
                        <p>Delivery within 5 days</p>
                      </div>
                      <div className="option-price">
                        <span>Free</span>
                      </div>
                      {deliveryType === "standard" && (
                        <div className="option-check">
                          <Check size={16} />
                        </div>
                      )}
                    </div>

                    <div
                      className={`delivery-option ${deliveryType === "express" ? "selected" : ""}`}
                      onClick={() => setDeliveryType("express")}
                    >
                      <div className="option-icon">
                        <Clock size={20} />
                      </div>
                      <div className="option-details">
                        <h3>Express Delivery</h3>
                        <p>Get it within 3 days</p>
                      </div>
                      <div className="option-price">
                        <span>${deliveryOptions.express?.price.toFixed(2)}</span>
                      </div>
                      {deliveryType === "express" && (
                        <div className="option-check">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Date Selection - Only show when delivery type is selected */}
              {selectedAddress && deliveryType && (
                <div className="delivery-section delivery-dates">
                  <h2>Delivery Date</h2>
                  <div className="date-options">
                    {deliveryOptions[deliveryType]?.deliveryDays.map((dayOption, index) => (
                      <div
                        key={index}
                        className={`date-option ${selectedDate === dayOption.date ? "selected" : ""}`}
                        onClick={() => {
                          setSelectedDate(dayOption.date);
                          setSelectedTimeSlot(null); // Reset time slot when date changes
                        }}
                      >
                        <div className="date-icon">
                          <Calendar size={16} />
                        </div>
                        <div className="date-details">
                          <h3>{dayOption.day}</h3>
                          <p>{dayOption.date}</p>
                        </div>
                        {selectedDate === dayOption.date && (
                          <div className="date-check">
                            <Check size={16} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Time Slot Selection - Only show when date is selected */}
              {selectedAddress && deliveryType && selectedDate && (
                <div className="delivery-section delivery-slots">
                  <h2>Time Slot</h2>
                  <div className="time-options">
                    {deliveryOptions[deliveryType]?.deliveryDays
                      .find(day => day.date === selectedDate)
                      ?.slots.map((slot, index) => (
                        <div
                          key={index}
                          className={`time-option ${selectedTimeSlot === slot ? "selected" : ""}`}
                          onClick={() => setSelectedTimeSlot(slot)}
                        >
                          <p>{slot}</p>
                          {selectedTimeSlot === slot && (
                            <div className="time-check">
                              <Check size={16} />
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            // Payment Section using the new Payment component
            <Payment 
              deliveryType={deliveryType}
              selectedDate={selectedDate}
              selectedTimeSlot={selectedTimeSlot}
              deliveryOptions={deliveryOptions}
              onBackToDelivery={handleBackToDelivery}
              onPlaceOrder={handlePlaceOrder}
              isProcessing={isProcessing}
            />
          )}
        </div>

        <div className="delivery-sidebar">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="cart-order">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    {getImageUrl(item) ? (
                      <img src={getImageUrl(item)} alt={item.name} />
                    ) : (
                      <div className="placeholder-image">{item.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="item-meta">
                      <p className="item-quantity">Qty: {item.quantity}</p>
                      <p className="item-price">{typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (10%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              
              {/* Discount Coupon Section */}
              <CouponInput
                subtotal={subtotal}
                onCouponApplied={handleCouponApplied}
                onCouponRemoved={handleCouponRemoved}
              />
              
              {discountAmount > 0 && (
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="summary-row total">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {currentStep === 'delivery' && (
              <>
                <div className="delivery-info">
                  {selectedAddress && deliveryType && selectedDate && selectedTimeSlot ? (
                    <div className="selected-delivery">
                      <h3>Selected Delivery:</h3>
                      <p>{deliveryOptions[deliveryType]?.title}</p>
                      <p>{selectedDate} - {selectedTimeSlot}</p>
                      <div className="selected-address">
                        <h4>Delivery Address:</h4>
                        <p>{selectedAddress.streetAddress}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}, {selectedAddress.country}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="delivery-prompt">
                      {!selectedAddress && <p>Please select a delivery address</p>}
                      {selectedAddress && !deliveryType && <p>Please select a delivery method</p>}
                      {selectedAddress && deliveryType && !selectedDate && <p>Please select a delivery date</p>}
                      {selectedAddress && deliveryType && selectedDate && !selectedTimeSlot && <p>Please select a delivery time slot</p>}
                    </div>
                  )}
                </div>

                <button
                  className="continue-button"
                  onClick={handleContinue}
                  disabled={!selectedAddress || !deliveryType || !selectedDate || !selectedTimeSlot}
                >
                  Continue to Payment
                </button>

                <Link to="/cart" className="back-link">
                  Return to Cart
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLayout(CheckoutPage);
