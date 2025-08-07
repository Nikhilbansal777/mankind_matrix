import Reclearct, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Truck, Check, MapPin, CreditCard, ArrowLeft } from 'lucide-react';
import withLayout from '../../layouts/HOC/withLayout';
import './Delivery.css';
import { useCart } from '../../hooks/useCart';

const DeliveryPage = () => {
  const { items, total } = useCart();
  const [deliveryType, setDeliveryType] = useState("standard");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deliveryOptions, setDeliveryOptions] = useState({});
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('delivery'); 
  
  // Discount coupon state
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const taxRate = 0.10;
  const taxAmount = total * taxRate;
  const deliveryFee = deliveryOptions[deliveryType]?.price || 0;
  const finalTotal = total + taxAmount + deliveryFee - discountAmount;

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
  const fetchDeliveryOptions = async () => {
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
  };

  useEffect(() => {
    
    fetchDeliveryOptions();

    
    if (window.app && typeof window.app.initDeliveryPage === 'function') {
      window.app.initDeliveryPage();
    } else {
      
      initBoxInteractions();
    }

    return () => {
      
    };
  }, []);

  
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
    if (!selectedDate || !selectedTimeSlot) {
      alert("Please select both a delivery date and time slot");
      return;
    }

    
    setCurrentStep('payment');
    setPaymentMethod('card'); 
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
   
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      
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

  // Handle coupon code application
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    
    // Simulate coupon validation - in real app, this would be an API call
    const validCoupons = {
      'SAVE10': 0.10, // 10% discount
      'SAVE20': 0.20, // 20% discount
      'SAVE50': 0.50, // 50% discount
      'FREESHIP': 0, // Free shipping (handled separately)
      'WELCOME': 0.15 // 15% discount
    };
    
    const discountRate = validCoupons[couponCode.toUpperCase()];
    
    if (discountRate !== undefined) {
      const subtotal = total;
      const discount = subtotal * discountRate;
      setDiscountAmount(discount);
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
      setDiscountAmount(0);
      setCouponApplied(false);
    }
  };
  
  // Handle coupon code removal
  const handleRemoveCoupon = () => {
    setCouponCode('');
    setDiscountAmount(0);
    setCouponApplied(false);
    setCouponError('');
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
      <div className="checkout-steps">
        <div className="step completed">
          <div className="step-number">1</div>
          <div className="step-label">Cart</div>
        </div>
        <div className="step-divider"></div>
        <div className={`step ${currentStep === 'delivery' ? 'active' : 'completed'}`}>
          <div className="step-number">2</div>
          <div className="step-label">Delivery</div>
        </div>
        <div className="step-divider"></div>
        <div className={`step ${currentStep === 'payment' ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Payment</div>
        </div>
        <div className="step-divider"></div>
        <div className="step">
          <div className="step-number">4</div>
          <div className="step-label">Confirmation</div>
        </div>
      </div>

      <h1>{currentStep === 'delivery' ? 'Select Delivery Options' : 'Payment Information'}</h1>

      <div className="delivery-content">
        <div className="delivery-main">
          {currentStep === 'delivery' ? (
            <>
              {/* Delivery Address Summary */}
              <div className="delivery-section delivery-address">
                <div className="section-header">
                  <h2>Delivery Address</h2>
                  <Link to="/addresses" className="change-link">Change</Link>
                </div>
                <div className="address-details">
                  <div className="address-icon">
                    <MapPin size={20} />
                  </div>
                  <div className="address-info">
                    <p className="address-name">John Doe</p>
                    <p className="address-line">123 Main Street, Apt 4B</p>
                    <p className="address-line">New York, NY 10001</p>
                    <p className="address-line">United States</p>
                    <p className="address-phone">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>

              {/* Delivery Type Selection */}
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

              {/* Date Selection */}
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

              {/* Time Slot Selection */}
              {selectedDate && (
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
            // Payment Section
            <div className="payment-section">
              {/* Updated Delivery Summary */}
              <div className="content-card">
                <h2>Delivery Summary</h2>
                <div className="delivery-summary-content">
                  <div className="delivery-summary-row">
                    <div className="summary-icon">
                      {deliveryType === "express" ? <Clock size={18} /> : <Truck size={18} />}
                    </div>
                    <div className="summary-detail">
                      <span className="detail-label">Method</span>
                      <span className="detail-value">{deliveryOptions[deliveryType]?.title}</span>
                    </div>
                  </div>
                  
                  <div className="delivery-summary-row">
                    <div className="summary-icon">
                      <Calendar size={18} />
                    </div>
                    <div className="summary-detail">
                      <span className="detail-label">Date</span>
                      <span className="detail-value">{selectedDate}</span>
                    </div>
                  </div>
                  
                  <div className="delivery-summary-row">
                    <div className="summary-icon">
                      <Clock size={18} />
                    </div>
                    <div className="summary-detail">
                      <span className="detail-label">Time</span>
                      <span className="detail-value">{selectedTimeSlot}</span>
                    </div>
                  </div>
                  
                  <div className="delivery-summary-row">
                    <div className="summary-icon">
                      <MapPin size={18} />
                    </div>
                    <div className="summary-detail address-detail">
                      <span className="detail-label">Address</span>
                      <span className="detail-value">
                        123 Main Street, Apt 4B<br/>
                        New York, NY 10001
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="payment-methods">
                <h2>Select Payment Method</h2>
                <div 
                  className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodSelect('card')}
                >
                  <div className="method-icon">
                    <CreditCard size={24} />
                  </div>
                  <div className="method-details">
                    <h3>Credit / Debit Card</h3>
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="method-check">
                      <Check size={16} />
                    </div>
                  )}
                </div>
              </div>
              
              {paymentMethod === 'card' && (
                <form className="content-card payment-form" onSubmit={handlePaymentSubmit}>
                  <h2>Payment Information</h2>
                  <div className="form-group">
                    <label htmlFor="card-number">Card Number</label>
                    <input 
                      type="text" 
                      id="card-number" 
                      placeholder="1234 5678 9012 3456" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="card-name">Cardholder Name</label>
                    <input 
                      type="text" 
                      id="card-name" 
                      placeholder="John Doe" 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiry-date">Expiry Date</label>
                      <input 
                        type="text" 
                        id="expiry-date" 
                        placeholder="MM/YY" 
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cvv">CVV</label>
                      <input 
                        type="text" 
                        id="cvv" 
                        placeholder="123" 
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="button-group">
                    <button 
                      type="button" 
                      className="back-button"
                      onClick={handleBackToDelivery}
                    >
                      <ArrowLeft size={16} />
                      <span>Back</span>
                    </button>
                    
                    <button 
                      type="submit" 
                      className="place-order-button"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </form>
              )}
            </div>
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
                <span>${total.toFixed(2)}</span>
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
              <div className="discount-section">
                <div className="coupon-input-group">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                    className="coupon-input"
                  />
                  {!couponApplied ? (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="apply-coupon-btn"
                    >
                      Apply
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="remove-coupon-btn"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {couponError && <div className="coupon-error">{couponError}</div>}
                {couponApplied && (
                  <div className="coupon-success">
                    <span>Coupon applied: {couponCode}</span>
                  </div>
                )}
                {/* Sample coupon suggestion */}
                {!couponApplied && (
                  <div className="sample-coupon-row">
                    <span className="sample-coupon-label">Code: <b>SAVE10</b></span>
                    <button
                      type="button"
                      className="sample-coupon-apply-btn"
                      onClick={() => {
                        setCouponCode('SAVE10');
                        setTimeout(() => handleApplyCoupon(), 0);
                      }}
                    >Apply</button>
                  </div>
                )}
              </div>
              
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
                  {selectedDate && selectedTimeSlot ? (
                    <div className="selected-delivery">
                      <h3>Selected Delivery:</h3>
                      <p>{deliveryOptions[deliveryType]?.title}</p>
                      <p>{selectedDate} - {selectedTimeSlot}</p>
                    </div>
                  ) : (
                    <div className="delivery-prompt">
                      <p>Please select a delivery date and time slot</p>
                    </div>
                  )}
                </div>

                <button
                  className="continue-button"
                  onClick={handleContinue}
                  disabled={!selectedDate || !selectedTimeSlot}
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

export default withLayout(DeliveryPage);