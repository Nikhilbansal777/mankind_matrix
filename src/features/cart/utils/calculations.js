import { TAX_RATE, SHIPPING_COSTS } from './constants';

/**
 * Utility functions for cart and checkout calculations
 */

/**
 * Calculate tax amount based on subtotal and tax rate
 * @param {number} subtotal - The subtotal amount
 * @param {number} taxRate - The tax rate as a decimal (e.g., 0.10 for 10%)
 * @returns {number} The calculated tax amount
 */
export const calculateTax = (subtotal, taxRate = TAX_RATE) => {
  return subtotal * taxRate;
};

/**
 * Calculate shipping cost based on delivery type
 * @param {string} deliveryType - The delivery type ('standard' or 'express')
 * @returns {number} The shipping cost
 */
export const calculateShipping = (deliveryType) => {
  return deliveryType === 'express' ? SHIPPING_COSTS.EXPRESS : SHIPPING_COSTS.STANDARD;
};

/**
 * Calculate final total including tax and shipping
 * @param {number} subtotal - The subtotal amount
 * @param {number} taxAmount - The tax amount
 * @param {number} shipping - The shipping cost
 * @param {number} discountAmount - The discount amount
 * @returns {number} The final total
 */
export const calculateFinalTotal = (subtotal, taxAmount, shipping, discountAmount = 0) => {
  return subtotal + taxAmount + shipping - discountAmount;
};

/**
 * Format currency amount
 * @param {number} amount - The amount to format
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (amount) => {
  return `$${amount.toFixed(2)}`;
};
