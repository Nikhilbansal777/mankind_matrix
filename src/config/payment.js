/**
 * Payment Configuration
 * Centralized configuration for payment providers and settings
 */

// Environment
const ENV = process.env.REACT_APP_ENV || 'development';
const IS_DEV = ENV === 'development';

// Payment Provider Configuration
export const paymentConfig = {
  stripe: {
    publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
    enabled: true,
  },
  paypal: {
    clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID,
    enabled: false, // Not implemented yet
  },
  // Add more payment providers here
};

// Validate required configuration in development
if (IS_DEV) {
  if (!paymentConfig.stripe.publishableKey) {
    console.warn('Missing Stripe publishable key for development environment');
  }
}

export default paymentConfig;
