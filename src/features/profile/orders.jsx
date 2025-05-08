// Order.js - React component for displaying past orders
import React, { useState, useEffect } from 'react';
import './orders.css'; // Import your CSS styles for the component
import AccountNavigation from './AccountNavigation';
import withLayout from '../../layouts/HOC/withLayout';
// API endpoint configuration - replace with your actual API URL
const API_URL = 'https://your-api-endpoint.com/orders';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  /**
   * Fetches orders from the API
   */
  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Try to fetch from the API
      const response = await fetch(API_URL);
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load your orders. Please try again later.');
      
      // Use mock data in development or when API fails
      if (process.env.NODE_ENV === 'development') {
        setOrders(getMockOrders());
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle reordering an order
   * @param {string} orderId - Order ID
   */
  const handleReorder = (orderId) => {
    // In a real application, this would add all items from the order to the cart
    console.log(`Reordering order #${orderId}`);
    alert(`Items from order #${orderId} have been added to your cart.`);
  };

  /**
   * Handle tracking an order
   * @param {string} orderId - Order ID
   * @param {string} trackingNumber - Tracking number
   */
  const handleTrackOrder = (orderId, trackingNumber) => {
    // In a real application, this would redirect to a tracking page
    console.log(`Tracking order #${orderId} with tracking number ${trackingNumber}`);
    alert(`Tracking information for order #${orderId}: Tracking Number - ${trackingNumber}`);
  };

  /**
   * Open support for an order
   * @param {string} orderId - Order ID
   */
  const handleOpenSupport = (orderId) => {
    // In a real application, this would open a support chat or form
    console.log(`Opening support for order #${orderId}`);
    alert(`Support request initiated for order #${orderId}`);
  };

  /**
   * Formats a date string
   * @param {string} dateString - Date string
   * @returns {string} - Formatted date
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="account-page">
      {/* Add AccountNavigation component here */}
      <AccountNavigation activeTab="orders" />
      
      <div className="orders-container">
        {/* Show loading state */}
        {loading && (
          <div className="loading-spinner">Loading your orders...</div>
        )}
        
        {/* Show error state */}
        {error && (!orders || orders.length === 0) && (
          <div className="error-message">
            <h3>Unable to load orders</h3>
            <p>{error}</p>
            <button className="btn retry-btn" onClick={fetchOrders}>
              Try Again
            </button>
          </div>
        )}
        
        {/* Show warning banner if there's an error but we have orders */}
        {error && orders && orders.length > 0 && (
          <div className="warning-banner">
            <p>{error}</p>
            <button className="btn retry-btn" onClick={fetchOrders}>
              Refresh
            </button>
          </div>
        )}
        
        {/* Show empty state */}
        {!loading && (!orders || orders.length === 0) && !error && (
          <div className="no-orders">
            <h3>No Orders Found</h3>
            <p>You haven't placed any orders yet.</p>
            <button className="btn shop-btn" onClick={() => window.location.href = '/shop'}>
              Start Shopping
            </button>
          </div>
        )}
        
        {/* Show orders when available */}
        {!loading && orders && orders.length > 0 && (
          <>
            <h2>Your Orders</h2>
            
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                {/* Order Header */}
                <div className="order-header">
                  <h3>Order #{order.id}</h3>
                  <span className="order-date">{formatDate(order.date)}</span>
                  <span className={`order-status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item">
                      <div
                        className="item-image"
                        style={{
                          backgroundImage: `url(${item.image || '/images/default-product.jpg'})`
                        }}
                      />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <div className="item-price">${item.price.toFixed(2)}</div>
                        <div className="item-quantity">Qty: {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>${order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="order-shipping">
                  <h4>Shipping Details</h4>
                  <div className="shipping-address">
                    <p>{order.shipping_address.name}</p>
                    <p>{order.shipping_address.street}</p>
                    <p>
                      {order.shipping_address.city}, {order.shipping_address.state}{' '}
                      {order.shipping_address.zip}
                    </p>
                    <p>{order.shipping_address.country}</p>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="order-actions">
                  <button
                    className="btn reorder-btn"
                    onClick={() => handleReorder(order.id)}
                  >
                    Reorder
                  </button>
                  <button
                    className="btn tracking-btn"
                    onClick={() => handleTrackOrder(order.id, order.tracking_number)}
                  >
                    Track Order
                  </button>
                  <button
                    className="btn support-btn"
                    onClick={() => handleOpenSupport(order.id)}
                  >
                    Support
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Returns mock order data for demonstration
 * @returns {Array} - Array of order objects
 */
function getMockOrders() {
  return [
    {
      id: "ORD-12345",
      date: "2025-04-28T14:32:00",
      status: "Delivered",
      items: [
        {
          id: "PROD-001",
          name: "Wireless Bluetooth Headphones",
          price: 129.99,
          quantity: 1,
          image: "/images/headphones.jpg"
        },
        {
          id: "PROD-023",
          name: "Phone Charging Cable",
          price: 19.99,
          quantity: 2,
          image: "/images/cable.jpg"
        }
      ],
      subtotal: 169.97,
      shipping: 5.99,
      tax: 14.03,
      total: 189.99,
      tracking_number: "TRK123456789",
      shipping_address: {
        name: "John Doe",
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345",
        country: "USA"
      }
    },
    {
      id: "ORD-12346",
      date: "2025-04-15T09:18:00",
      status: "Processing",
      items: [
        {
          id: "PROD-045",
          name: "Smart Watch",
          price: 249.99,
          quantity: 1,
          image: "/images/smartwatch.jpg"
        }
      ],
      subtotal: 249.99,
      shipping: 0.00,
      tax: 20.62,
      total: 270.61,
      tracking_number: "TRK987654321",
      shipping_address: {
        name: "John Doe",
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345",
        country: "USA"
      }
    },
    {
      id: "ORD-12347",
      date: "2025-03-22T16:45:00",
      status: "Delivered",
      items: [
        {
          id: "PROD-089",
          name: "Laptop Sleeve",
          price: 39.99,
          quantity: 1,
          image: "/images/laptop-sleeve.jpg"
        },
        {
          id: "PROD-112",
          name: "Wireless Mouse",
          price: 29.99,
          quantity: 1,
          image: "/images/mouse.jpg"
        },
        {
          id: "PROD-154",
          name: "USB-C Hub",
          price: 49.99,
          quantity: 1,
          image: "/images/usb-hub.jpg"
        }
      ],
      subtotal: 119.97,
      shipping: 5.99,
      tax: 9.89,
      total: 135.85,
      tracking_number: "TRK567891234",
      shipping_address: {
        name: "John Doe",
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345",
        country: "USA"
      }
    }
  ];
}

export default withLayout(Order);