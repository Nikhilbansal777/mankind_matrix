import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Home, Package, ArrowRight } from 'lucide-react';
import withLayout from '../../../layouts/HOC/withLayout';
import styles from './ConfirmationPage.module.css';

const ConfirmationPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Get order data from URL parameters or use defaults
  let orderData = {};
  try {
    const orderDataParam = searchParams.get('orderData');
    if (orderDataParam) {
      orderData = JSON.parse(decodeURIComponent(orderDataParam));
    }
  } catch (error) {
    console.error('Error parsing order data:', error);
  }
  
  // Use order data or generate defaults
  const orderNumber = orderData.orderNumber || `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const orderDate = orderData.orderDate || new Date().toLocaleDateString();
  const totalAmount = orderData.total || 0;

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
              <span className={styles.label}>Total Amount:</span>
              <span className={styles.value}>${totalAmount.toFixed(2)}</span>
            </div>
            <div className={styles.orderInfoItem}>
              <span className={styles.label}>Status:</span>
              <span className={styles.value + ' ' + styles.statusConfirmed}>Confirmed</span>
            </div>
          </div>
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
