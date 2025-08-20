/**
 * Constants for cart and checkout functionality
 */

// Tax rate (10%)
export const TAX_RATE = 0.10;

// Shipping costs
export const SHIPPING_COSTS = {
  STANDARD: 0,
  EXPRESS: 9.99
};

// Delivery types
export const DELIVERY_TYPES = {
  STANDARD: 'standard',
  EXPRESS: 'express'
};

// Delivery timeframes
export const DELIVERY_TIMEFRAMES = {
  STANDARD: '5-7 business days',
  EXPRESS: '2-3 business days'
};

// Checkout steps
export const CHECKOUT_STEPS = {
  CART: 'cart',
  DELIVERY: 'delivery',
  PAYMENT: 'payment',
  CONFIRMATION: 'confirmation'
};
