import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Truck, 
  CheckCircle
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
        fullDate: deliveryDate
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
        fullDate: deliveryDate
      });
    }
    
    return {
      standard: {
        title: "Standard Delivery",
        description: DELIVERY_TIMEFRAMES.STANDARD,
        price: SHIPPING_COSTS.STANDARD,
        icon: <Truck className="delivery-icon standard" />,
        deliveryDays: standardDeliveryDays
      },
      express: {
        title: "Express Delivery",
        description: DELIVERY_TIMEFRAMES.EXPRESS,
        price: SHIPPING_COSTS.EXPRESS,
        icon: <Truck className="delivery-icon express" />,
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
            <h3>Select Delivery Date</h3>
          </div>
          
          <div className="delivery-dates">
            {deliveryOptions[deliveryType].deliveryDays.map((day, index) => (
              <button
                key={index}
                className={`delivery-date ${
                  selectedDate === day.date ? 'selected' : ''
                }`}
                onClick={() => onDateSelect(day.date)}
              >
                <div className="date-header">
                  <Calendar className="date-icon" />
                  <div className="date-info">
                    <span className="date-text">{day.date}</span>
                    <span className="day-name">{day.day}</span>
                  </div>
                </div>
                {selectedDate === day.date && (
                  <CheckCircle className="date-check" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Shipping;
