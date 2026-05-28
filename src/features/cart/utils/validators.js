/**
 * Validation utilities for cart and checkout
 */

/**
 * Validate if address is selected
 * @param {Object|null} address - The selected address
 * @returns {string|null} Error message or null if valid
 */
export const validateAddress = (address) => {
  if (!address) {
    return 'Please select a delivery address to continue';
  }
  return null;
};

/**
 * Validate if delivery date is selected
 * @param {string|null} date - The selected delivery date
 * @returns {string|null} Error message or null if valid
 */
export const validateDeliveryDate = (date) => {
  if (!date) {
    return 'Please select a delivery date';
  }
  return null;
};

/**
 * Validate if cart has items
 * @param {Array} items - The cart items
 * @returns {string|null} Error message or null if valid
 */
export const validateCartItems = (items) => {
  if (!items || items.length === 0) {
    return 'Your cart is empty. Please add items before proceeding.';
  }
  return null;
};

/**
 * Validate checkout form
 * @param {Object} formData - The form data to validate
 * @returns {Object} Object with isValid boolean and errors array
 */
export const validateCheckoutForm = (formData) => {
  const errors = [];
  
  const addressError = validateAddress(formData.selectedAddress);
  if (addressError) errors.push(addressError);
  
  const dateError = validateDeliveryDate(formData.selectedDate);
  if (dateError) errors.push(dateError);
  
  const cartError = validateCartItems(formData.items);
  if (cartError) errors.push(cartError);
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
