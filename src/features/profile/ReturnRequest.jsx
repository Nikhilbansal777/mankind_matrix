import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ReturnRequest.css'; // You'll need to create this CSS file
import withLayout from '../../layouts/HOC/withLayout';
import AccountNavigation from './AccountNavigation';
const ReturnRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [returnReason, setReturnReason] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [returnMethod, setReturnMethod] = useState('refund');
  const [formErrors, setFormErrors] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    offerNotifications: true,
    productNotifications: true
  });

  // Return reason options
  const reasonOptions = [
    'Item damaged',
    'Wrong item received',
    'Item not as described',
    'Changed mind',
    'Ordered by mistake',
    'Better price found elsewhere',
    'Other (please specify)'
  ];

  useEffect(() => {
    // Get order data from navigation state
    if (location.state && location.state.order) {
      setOrder(location.state.order);
      
      // Initialize selected items object
      const initialSelectedItems = {};
      location.state.order.items.forEach(item => {
        initialSelectedItems[item.id] = {
          selected: false,
          quantity: 0,
          maxQuantity: item.quantity
        };
      });
      setSelectedItems(initialSelectedItems);
    } else {
      // If no order data was passed, redirect back to orders page
      navigate('/orders');
    }
  }, [location, navigate]);

  /**
   * Handle changes to item selection
   * @param {string} itemId - Item ID
   * @param {boolean} isChecked - Whether the item is selected
   */
  const handleItemSelect = (itemId, isChecked) => {
    setSelectedItems({
      ...selectedItems,
      [itemId]: {
        ...selectedItems[itemId],
        selected: isChecked,
        quantity: isChecked ? 1 : 0
      }
    });
  };

  /**
   * Handle changes to item return quantity
   * @param {string} itemId - Item ID
   * @param {number} quantity - Return quantity
   */
  const handleQuantityChange = (itemId, quantity) => {
    const maxQuantity = selectedItems[itemId].maxQuantity;
    const validQuantity = Math.min(Math.max(0, quantity), maxQuantity);
    
    setSelectedItems({
      ...selectedItems,
      [itemId]: {
        ...selectedItems[itemId],
        quantity: validQuantity,
        selected: validQuantity > 0
      }
    });
  };

  /**
   * Validate the return form
   * @returns {boolean} - Whether the form is valid
   */
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Check if any items are selected for return
    const hasSelectedItems = Object.values(selectedItems).some(item => item.selected && item.quantity > 0);
    if (!hasSelectedItems) {
      errors.items = 'Please select at least one item to return';
      isValid = false;
    }

    // Check if return reason is provided
    if (!returnReason) {
      errors.reason = 'Please select a return reason';
      isValid = false;
    }

    // Check if additional info is provided when "Other" is selected
    if (returnReason === 'Other (please specify)' && !additionalInfo.trim()) {
      errors.additionalInfo = 'Please provide details for your return reason';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  /**
   * Handle submission of return request
   * @param {Event} e - Form submission event
   */
  const handleSubmitReturn = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare return data
    const returnData = {
      orderId: order.id,
      items: Object.entries(selectedItems)
        .filter(([_, item]) => item.selected && item.quantity > 0)
        .map(([itemId, item]) => ({
          itemId,
          quantity: item.quantity,
          name: order.items.find(orderItem => orderItem.id === itemId).name
        })),
      reason: returnReason,
      additionalInfo: additionalInfo,
      returnMethod: returnMethod
    };

    // Here you would normally send the return data to your API
    console.log('Return request data:', returnData);

    // For demo purposes, show an alert
    alert('Return request submitted successfully! Reference #: ' + Math.random().toString(36).substring(2, 10).toUpperCase());

    // Redirect back to orders page
    navigate('/orders');
  };

  /**
   * Handle cancel action
   */
  const handleCancel = () => {
    navigate('/orders');
  };

  const toggleNotificationSetting = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // Show loading or redirect if no order data
  if (!order) {
    return <div className="loading">Loading return form...</div>;
  }

  return (
    <div className="return-request-container">
      <AccountNavigation />
      
      <div className="return-main-content">
        <div className="return-content-wrapper">
          <div className="return-order-info">
            <h1>Return Request</h1>
            <h2>Order #{order.id}</h2>
            <p>Order Date: {new Date(order.date).toLocaleDateString()}</p>
          </div>

          <form onSubmit={handleSubmitReturn}>
            <div className="return-section">
              <h3>Select Items to Return</h3>
              {formErrors.items && <div className="error-message">{formErrors.items}</div>}
              <div className="return-items-list">
                {order.items.map(item => (
                  <div key={item.id} className="return-item">
                    <div className="return-item-image">
                      <img 
                        src={item.image || '/images/default-product.jpg'} 
                        alt={item.name} 
                      />
                    </div>
                    <div className="return-item-details">
                      <h4>{item.name}</h4>
                      <p className="return-item-price">${item.price.toFixed(2)}</p>
                      <div className="return-item-actions">
                        <label className="return-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedItems[item.id]?.selected || false}
                            onChange={(e) => handleItemSelect(item.id, e.target.checked)}
                          />
                          Return this item
                        </label>
                        {selectedItems[item.id]?.selected && (
                          <div className="return-quantity">
                            <label>
                              Quantity to return:
                              <input
                                type="number"
                                min="1"
                                max={item.quantity}
                                value={selectedItems[item.id]?.quantity || 0}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                              />
                              <span className="max-quantity">of {item.quantity}</span>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="return-section">
              <h3>Reason for Return</h3>
              {formErrors.reason && <div className="error-message">{formErrors.reason}</div>}
              <div className="return-reason">
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="return-reason-select"
                >
                  <option value="">Select a reason</option>
                  {reasonOptions.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              <div className="return-additional-info">
                <label>
                  Additional Information:
                  {formErrors.additionalInfo && <div className="error-message">{formErrors.additionalInfo}</div>}
                  <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Please provide any additional details about your return"
                    rows="4"
                  />
                </label>
              </div>
            </div>

            <div className="return-section">
              <h3>Return Method</h3>
              <div className="return-method">
                <label>
                  <input
                    type="radio"
                    name="returnMethod"
                    value="refund"
                    checked={returnMethod === 'refund'}
                    onChange={() => setReturnMethod('refund')}
                  />
                  Refund to original payment method
                </label>
                <label>
                  <input
                    type="radio"
                    name="returnMethod"
                    value="storeCredit"
                    checked={returnMethod === 'storeCredit'}
                    onChange={() => setReturnMethod('storeCredit')}
                  />
                  Store Credit
                </label>
                <label>
                  <input
                    type="radio"
                    name="returnMethod"
                    value="exchange"
                    checked={returnMethod === 'exchange'}
                    onChange={() => setReturnMethod('exchange')}
                  />
                  Exchange for same item
                </label>
              </div>
            </div>

            <div className="return-policy">
              <h3>Return Policy</h3>
              <p>
                Items must be returned within 30 days of delivery in their original condition to be eligible for a refund.
                Shipping costs are non-refundable. Customer is responsible for return shipping costs unless the item was defective or damaged.
              </p>
            </div>

            <div className="return-form-actions">
              <button type="button" className="btn cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn submit-btn">
                Submit Return Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withLayout(ReturnRequest);