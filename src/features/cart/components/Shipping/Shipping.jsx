import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Truck, 
  Clock,
  Check
} from 'lucide-react';
import { SHIPPING_COSTS, DELIVERY_TIMEFRAMES } from '../../utils/constants';
import './Shipping.css';

const Shipping = ({ 
  deliveryType, 
  onDeliveryTypeChange,
  selectedDate,
  onDateSelect
}) => {
  const [deliveryOptions, setDeliveryOptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Default delivery options if API fails
  const getDefaultDeliveryOptions = () => {
    const currentDate = new Date();
    
    // Standard delivery dates (starting from current date + 5 days)
    const standardDeliveryDays = [];
    for (let i = 0; i < 7; i++) {
      const deliveryDate = new Date(currentDate);
      deliveryDate.setDate(currentDate.getDate() + 5 + i);
      
      const formattedDate = deliveryDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
      const dayName = deliveryDate.toLocaleDateString('en-US', { weekday: 'long' });
      
      standardDeliveryDays.push({
        date: formattedDate,
        day: dayName,
        fullDate: deliveryDate,
        isoDate: deliveryDate.toISOString().split('T')[0] // Add ISO date for API
      });
    }
    
    // Express delivery dates (starting from current date + 2 days)
    const expressDeliveryDays = [];
    for (let i = 0; i < 5; i++) {
      const deliveryDate = new Date(currentDate);
      deliveryDate.setDate(currentDate.getDate() + 2 + i);
      
      const formattedDate = deliveryDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
      const dayName = deliveryDate.toLocaleDateString('en-US', { weekday: 'long' });
      
      expressDeliveryDays.push({
        date: formattedDate,
        day: dayName,
        fullDate: deliveryDate,
        isoDate: deliveryDate.toISOString().split('T')[0] // Add ISO date for API
      });
    }
    
    return {
      standard: {
        title: "Standard Delivery",
        description: "Delivery within 5 days",
        price: SHIPPING_COSTS.STANDARD,
        icon: <Truck className="delivery-icon standard" />,
        deliveryDays: standardDeliveryDays
      },
      express: {
        title: "Express Delivery",
        description: "Get it within 3 days",
        price: SHIPPING_COSTS.EXPRESS,
        icon: <Clock className="delivery-icon express" />,
        deliveryDays: expressDeliveryDays
      }
    };
  };

  // Try to fetch delivery options from API, fallback to default options
  const fetchDeliveryOptions = useCallback(async () => {
    try {
      const response = await fetch('/api/delivery-options');
      if (response.ok) {
        const data = await response.json();
        setDeliveryOptions(data);
      } else {
        setDeliveryOptions(getDefaultDeliveryOptions());
      }
    } catch (error) {
      setDeliveryOptions(getDefaultDeliveryOptions());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveryOptions();
  }, [fetchDeliveryOptions]);

  if (isLoading) {
    return (
      <div className="shipping-section">
        <div className="loading-spinner">
          <Truck className="loading-icon" />
          <span>Loading delivery options...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="shipping-section">
      {/* Delivery Method Section */}
      <div className="delivery-method-section">
        <h2>Delivery Method</h2>
        <div className="delivery-method-options">
          {Object.entries(deliveryOptions).map(([type, option]) => (
            <div 
              key={type}
              className={`delivery-method-card ${deliveryType === type ? 'selected' : ''}`}
              onClick={() => onDeliveryTypeChange(type)}
            >
              <div className="delivery-method-left">
                <div className="delivery-icon-wrapper">
                  {option.icon}
                </div>
                <div className="delivery-method-info">
                  <h3>{option.title}</h3>
                  <p className="delivery-description">{option.description}</p>
                </div>
              </div>
              <div className="delivery-method-right">
                <span className="delivery-price">
                  {option.price === 0 ? 'Free' : `$${option.price}`}
                </span>
                {deliveryType === type && (
                  <Check className="selection-check" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Date Section */}
      {deliveryType && deliveryOptions[deliveryType] && (
        <div className="delivery-date-section">
          <h2>Delivery Date</h2>
          <div className="delivery-date-options">
            {deliveryOptions[deliveryType].deliveryDays.slice(0, 3).map((day, index) => (
              <div
                key={index}
                className={`delivery-date-card ${
                  selectedDate === day.isoDate ? 'selected' : ''
                }`}
                onClick={() => onDateSelect(day.isoDate)}
              >
                <div className="delivery-date-left">
                  <Calendar className="date-icon" />
                  <div className="date-info">
                    <span className="day-name">{day.day}</span>
                    <span className="date-text">{day.date}</span>
                  </div>
                </div>
                {selectedDate === day.date && (
                  <Check className="date-check" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Shipping;
