import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Package, ArrowRight, AlertCircle } from 'lucide-react';
import withLayout from '../../../layouts/HOC/withLayout';
import { useOrders } from '../../../hooks/useOrders';
import styles from './ConfirmationPage.module.css';

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getOrder, currentOrder, error } = useOrders();
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeOrderData = async () => {
      try {
        // First try to get order data from URL parameters
        const searchParams = new URLSearchParams(location.search);
        const orderDataParam = searchParams.get('orderData');
        
        if (orderDataParam) {
          const parsedData = JSON.parse(decodeURIComponent(orderDataParam));
          setOrderData(parsedData);
          
          // If we have an order ID, try to fetch the full order details
          if (parsedData.orderId || parsedData.id) {
            try {
              await getOrder(parsedData.orderId || parsedData.id);
            } catch (err) {
              console.warn('Could not fetch full order details:', err);
              // Continue with URL data if fetch fails
            }
          }
        } else {
          // No order data in URL, redirect to home
          console.warn('No order data found, redirecting to home');
          navigate('/', { replace: true });
          return;
        }
      } catch (error) {
        console.error('Error parsing order data:', error);
        // Redirect to home on error
        navigate('/', { replace: true });
        return;
      } finally {
        setIsLoading(false);
      }
    };

    initializeOrderData();
  }, [location.search, getOrder, navigate]);

  // Use Redux order data if available, otherwise fall back to URL data
  const order = currentOrder || orderData;
  
  // Extract order information with fallbacks
  const orderNumber = order?.orderNumber || order?.id || 'N/A';
  const orderDate = order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 
                   order?.updatedAt ? new Date(order.updatedAt).toLocaleDateString() :
                   order?.orderDate || new Date().toLocaleDateString();
  const totalAmount = order?.total || order?.totalAmount || 0;
  const status = order?.status || 'CONFIRMED';
  const paymentStatus = order?.paymentStatus || 'PAID';
  const shippingValue = order?.shippingValue || 0;
  const subtotal = order?.subtotal || 0;
  const tax = order?.tax || 0;
  const discounts = order?.discounts || 0;
  const items = order?.items || [];
  const appliedCoupon = order?.appliedCoupon;

  if (isLoading) {
    return (
      <div className={styles.confirmationPage}>
        <div className={styles.confirmationContainer}>
          <div className={styles.loadingSection}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading order confirmation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.confirmationPage}>
        <div className={styles.confirmationContainer}>
          <div className={styles.errorSection}>
            <AlertCircle size={80} className={styles.errorIcon} />
            <h1>Error Loading Order</h1>
            <p className={styles.errorMessage}>
              {error || 'There was an error loading your order confirmation.'}
            </p>
            <Link to="/" className={styles.primaryButton}>
              <Home size={20} />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.confirmationPage}>
      <div className={styles.confirmationContainer}>
        {/* Success Icon and Message */}
        <div className={styles.successSection}>
          <div className={styles.successIcon}>
            <CheckCircle size={80} />
          </div>
          <h1>Payment Successful!</h1>
          <p className={styles.successMessage}>
            Thank you for your order. Your payment has been processed successfully.
          </p>
        </div>

        {/* Order Details */}
        <div className={styles.orderDetailsSection}>
          <h2>Order Details</h2>
          <div className={styles.orderInfoGrid}>
            <div className={styles.orderInfoItem}>
              <span className={styles.label}>Order Number:</span>
              <span className={styles.value}>{orderNumber}</span>
            </div>
            <div className={styles.orderInfoItem}>
              <span className={styles.label}>Order Date:</span>
              <span className={styles.value}>{orderDate}</span>
            </div>
            <div className={styles.orderInfoItem}>
              <span className={styles.label}>Status:</span>
              <span className={`${styles.value} ${styles.statusConfirmed}`}>
                {status}
              </span>
            </div>
            <div className={styles.orderInfoItem}>
              <span className={styles.label}>Payment Status:</span>
              <span className={`${styles.value} ${styles.statusPaid}`}>
                {paymentStatus}
              </span>
            </div>
          </div>

          {/* Order Summary */}
          <div className={styles.orderSummary}>
            <h3>Order Summary</h3>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Subtotal:</span>
                <span className={styles.value}>${subtotal.toFixed(2)}</span>
              </div>
              {tax > 0 && (
                <div className={styles.summaryItem}>
                  <span className={styles.label}>Tax:</span>
                  <span className={styles.value}>${tax.toFixed(2)}</span>
                </div>
              )}
              {shippingValue > 0 && (
                <div className={styles.summaryItem}>
                  <span className={styles.label}>Shipping:</span>
                  <span className={styles.value}>${shippingValue.toFixed(2)}</span>
                </div>
              )}
              {discounts > 0 && (
                <div className={styles.summaryItem}>
                  <span className={styles.label}>Discounts:</span>
                  <span className={styles.value}>-${discounts.toFixed(2)}</span>
                </div>
              )}
              <div className={`${styles.summaryItem} ${styles.totalItem}`}>
                <span className={styles.label}>Total:</span>
                <span className={styles.value}>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Applied Coupon */}
          {appliedCoupon && (
            <div className={styles.couponInfo}>
              <h3>Applied Coupon</h3>
              <div className={styles.couponDetails}>
                <span className={styles.couponCode}>{appliedCoupon.couponCode}</span>
                <span className={styles.couponName}>{appliedCoupon.couponName}</span>
                <span className={styles.couponDiscount}>
                  -${appliedCoupon.discountAmount.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Order Items */}
          {items.length > 0 && (
            <div className={styles.orderItems}>
              <h3>Order Items</h3>
              <div className={styles.itemsList}>
                {items.map((item, index) => (
                  <div key={index} className={styles.itemRow}>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{item.productName}</span>
                      <span className={styles.itemQuantity}>Qty: {item.quantity}</span>
                    </div>
                    <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
                    <span className={styles.itemSubtotal}>${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className={styles.nextStepsSection}>
          <h2>What's Next?</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.stepItem}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3>Order Confirmation</h3>
                <p>You'll receive an email confirmation with your order details.</p>
              </div>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3>Order Processing</h3>
                <p>We'll start processing your order and prepare it for shipping.</p>
              </div>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3>Shipping Updates</h3>
                <p>You'll receive tracking information once your order ships.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <Link to="/orders" className={styles.primaryButton}>
            <Package size={20} />
            View My Orders
            <ArrowRight size={16} />
          </Link>
          
          <Link to="/" className={styles.secondaryButton}>
            <Home size={20} />
            Return to Home
          </Link>
        </div>

        {/* Additional Information */}
        <div className={styles.additionalInfo}>
          <div className={styles.infoCard}>
            <h3>Need Help?</h3>
            <p>If you have any questions about your order, please contact our customer support team.</p>
            <Link to="/contact" className={styles.contactLink}>
              Contact Support
            </Link>
          </div>
          
          <div className={styles.infoCard}>
            <h3>Order Tracking</h3>
            <p>Track your order status and get real-time updates on delivery.</p>
            <Link to="/orders" className={styles.trackingLink}>
              Track Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLayout(ConfirmationPage);
