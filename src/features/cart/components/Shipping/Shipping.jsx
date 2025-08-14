import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Truck, 
  CreditCard, 
  MapPin, 
  User, 
  Mail, 
  Home,
  Building,
  Hash,
  Globe,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import './Shipping.css';

const Shipping = ({ 
  deliveryType, 
  onDeliveryTypeChange,
  selectedDate,
  onDateSelect,
  selectedTimeSlot,
  onTimeSlotSelect,
  paymentMethod,
  onPaymentMethodChange,
  cardDetails,
  onCardDetailsChange
}) => {
  const [deliveryOptions, setDeliveryOptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);

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
        description: "5-7 business days",
        price: 0,
        icon: <Truck className="delivery-icon standard" />,
        deliveryDays: standardDeliveryDays
      },
      express: {
        title: "Express Delivery",
        description: "2-3 business days",
        price: 9.99,
        icon: <Clock className="delivery-icon express" />,
        deliveryDays: expressDeliveryDays
      }
    };
  };

  // Try to fetch delivery options from API, fallback to default options
  const fetchDeliveryOptions = async () => {
    try {
      const response = await fetch('/api/delivery-options');
      if (response.ok) {
        const data = await response.json();
        setDeliveryOptions(data);
      } else {
        setDeliveryOptions(getDefaultDeliveryOptions());
      }
    } catch (error) {
      console.log('Using default delivery options');
      setDeliveryOptions(getDefaultDeliveryOptions());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryOptions();
  }, []);

  const handleCardChange = (field, value) => {
    onCardDetailsChange({ ...cardDetails, [field]: value });
  };

  if (isLoading) {
    return (
      <div className="shipping-section">
        <div className="loading-spinner">
          <Clock className="loading-icon" />
          <span>Loading delivery options...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="shipping-section">
      <div className="section-header">
        <Truck className="section-icon" />
        <h2>Delivery Options</h2>
      </div>
      
      <div className="delivery-types">
        {Object.entries(deliveryOptions).map(([type, option]) => (
          <div 
            key={type}
            className={`delivery-type ${deliveryType === type ? 'selected' : ''}`}
            onClick={() => onDeliveryTypeChange(type)}
          >
            <div className="delivery-type-header">
              <div className="delivery-icon-wrapper">
                {option.icon}
              </div>
              <div className="delivery-type-info">
                <h3>{option.title}</h3>
                <p className="delivery-description">{option.description}</p>
                <p className="delivery-price">
                  {option.price === 0 ? 'FREE' : `$${option.price}`}
                </p>
              </div>
              {deliveryType === type && (
                <CheckCircle className="selection-check" />
              )}
            </div>
          </div>
        ))}
      </div>

      {deliveryType && deliveryOptions[deliveryType] && (
        <div className="delivery-details">
          <div className="section-header">
            <Calendar className="section-icon" />
            <h3>Select Delivery Date & Time</h3>
          </div>
          
          <div className="delivery-dates">
            {deliveryOptions[deliveryType].deliveryDays.map((day, index) => (
              <div key={index} className="delivery-date">
                <div className="date-header">
                  <Calendar className="date-icon" />
                  <div className="date-info">
                    <span className="date-text">{day.date}</span>
                    <span className="day-name">{day.day}</span>
                  </div>
                </div>
                
                <div className="time-slots">
                  {day.slots.map((slot, slotIndex) => (
                    <button
                      key={slotIndex}
                      className={`time-slot ${
                        selectedDate === day.date && selectedTimeSlot === slot ? 'selected' : ''
                      }`}
                      onClick={() => {
                        onDateSelect(day.date);
                        onTimeSlotSelect(slot);
                      }}
                    >
                      <Clock className="time-icon" />
                      <span>{slot}</span>
                      {selectedDate === day.date && selectedTimeSlot === slot && (
                        <CheckCircle className="time-check" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="payment-section">
        <div className="section-header">
          <CreditCard className="section-icon" />
          <h2>Payment Method</h2>
        </div>
        
        <div className="payment-methods">
          <div 
            className={`payment-method ${paymentMethod === 'credit-card' ? 'selected' : ''}`}
            onClick={() => onPaymentMethodChange('credit-card')}
          >
            <input 
              type="radio" 
              id="credit-card" 
              name="paymentMethod" 
              value="credit-card" 
              checked={paymentMethod === 'credit-card'} 
              onChange={(e) => onPaymentMethodChange(e.target.value)} 
            />
            <label htmlFor="credit-card">
              <CreditCard className="payment-icon" />
              <span>Credit Card</span>
            </label>
            {paymentMethod === 'credit-card' && (
              <CheckCircle className="selection-check" />
            )}
          </div>
          
          <div 
            className={`payment-method ${paymentMethod === 'paypal' ? 'selected' : ''}`}
            onClick={() => onPaymentMethodChange('paypal')}
          >
            <input 
              type="radio" 
              id="paypal" 
              name="paymentMethod" 
              value="paypal" 
              checked={paymentMethod === 'paypal'} 
              onChange={(e) => onPaymentMethodChange(e.target.value)} 
            />
            <label htmlFor="paypal">
              <span className="paypal-icon">PayPal</span>
            </label>
            {paymentMethod === 'paypal' && (
              <CheckCircle className="selection-check" />
            )}
          </div>
        </div>
        
        {paymentMethod === 'credit-card' && (
          <div className="credit-card-fields">
            <div className="form-group">
              <label htmlFor="cardNumber">
                <Hash className="field-icon" />
                Card Number
              </label>
              <input 
                type="text" 
                id="cardNumber" 
                placeholder="1234 5678 9012 3456" 
                value={cardDetails.cardNumber}
                onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                required 
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cardName">
                  <User className="field-icon" />
                  Cardholder Name
                </label>
                <input 
                  type="text" 
                  id="cardName" 
                  placeholder="John Doe"
                  value={cardDetails.cardName}
                  onChange={(e) => handleCardChange('cardName', e.target.value)}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="expiryDate">
                  <Calendar className="field-icon" />
                  Expiry Date
                </label>
                <input 
                  type="text" 
                  id="expiryDate" 
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChange={(e) => handleCardChange('expiryDate', e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="cvv">
                <Hash className="field-icon" />
                CVV
              </label>
              <input 
                type="text" 
                id="cvv" 
                placeholder="123"
                value={cardDetails.cvv}
                onChange={(e) => handleCardChange('cvv', e.target.value)}
                required 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shipping;
