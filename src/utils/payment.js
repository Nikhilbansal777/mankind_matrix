/**
 * Payment Utilities
 * Helper functions for payment processing and status checking
 */

/**
 * Check if payment status indicates successful payment
 * @param {string} paymentStatus - The payment status from the order
 * @returns {boolean} - True if payment is successful
 */
export const isPaymentSuccessful = (paymentStatus) => {
  return paymentStatus === 'PAID';
};

/**
 * Check if order status indicates successful order
 * @param {string} orderStatus - The order status from the order
 * @returns {boolean} - True if order is successful
 */
export const isOrderSuccessful = (orderStatus) => {
  return ['PAID', 'CONFIRMED', 'PROCESSING'].includes(orderStatus);
};

/**
 * Format order data for confirmation page
 * @param {Object} order - The order object from API
 * @returns {Object} - Formatted order data for confirmation
 */
export const formatOrderDataForConfirmation = (order) => {
  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    orderDate: new Date(order.createdAt).toLocaleDateString(),
    total: order.total,
    paymentId: order.paymentId,
    items: order.items || [],
    appliedCoupon: order.appliedCoupon,
    status: order.status,
    paymentStatus: order.paymentStatus,
    subtotal: order.subtotal,
    tax: order.tax,
    shippingValue: order.shippingValue,
    discounts: order.discounts
  };
};

/**
 * Handle payment success and redirect to confirmation
 * @param {Object} order - The order object from API
 * @param {string} baseUrl - Base URL for redirect (default: window.location.origin)
 */
export const handlePaymentSuccess = (order, baseUrl = window.location.origin) => {
  if (!isPaymentSuccessful(order.paymentStatus)) {
    throw new Error('Payment not confirmed by backend');
  }

  const orderData = formatOrderDataForConfirmation(order);
  const confirmationUrl = `${baseUrl}/confirmation?orderData=${encodeURIComponent(JSON.stringify(orderData))}`;
  window.location.href = confirmationUrl;
};

/**
 * Handle payment error with user-friendly message using toast notifications
 * @param {Error} error - The error object
 * @param {string} fallbackMessage - Fallback message if error is not user-friendly
 */
export const handlePaymentError = (error, fallbackMessage = 'Payment failed. Please try again.') => {
  console.error('Payment error:', error);
  
  let message = fallbackMessage;
  
  if (error.message) {
    // Check for specific error types
    if (error.message.includes('Payment not confirmed')) {
      message = 'Payment processing. Please check your order status.';
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      message = 'Network error. Please check your connection and try again.';
    } else if (error.message.includes('authentication') || error.message.includes('login')) {
      message = 'Please log in to complete your payment.';
    } else {
      message = error.message;
    }
  }
  
  // Return the error message for the calling component to handle with toast
  return message;
};
