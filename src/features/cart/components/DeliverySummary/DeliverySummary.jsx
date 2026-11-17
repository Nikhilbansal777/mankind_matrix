import React from 'react';
import { MapPin, Calendar, Truck } from 'lucide-react';
import './DeliverySummary.css';

const DeliverySummary = ({ 
  deliveryType, 
  selectedDate, 
  selectedAddress,
  title = "Delivery Summary"
}) => {
  return (
    <div className="delivery-summary">
      <h2>{title}</h2>
      <div className="delivery-summary-content">
        <div className="delivery-summary-row">
          <div className="summary-icon">
            <Truck size={18} />
          </div>
          <div className="summary-detail">
            <span className="detail-label">Method</span>
            <span className="detail-value">
              {deliveryType === 'express' ? 'Express Delivery' : 'Standard Delivery'}
            </span>
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
            <MapPin size={18} />
          </div>
          <div className="summary-detail address-detail">
            <span className="detail-label">Address</span>
            <span className="detail-value">
              {selectedAddress ? (
                <>
                  {selectedAddress.streetAddress}<br/>
                  {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}<br/>
                  {selectedAddress.country}
                </>
              ) : (
                'No address selected'
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliverySummary;
