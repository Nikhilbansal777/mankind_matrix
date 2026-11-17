/**
 * Formats a number as currency string
 * @param {number} value - The number to format
 * @param {string} [currency='USD'] - The currency code
 * @param {string} [locale='en-US'] - The locale to use for formatting
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD', locale = 'en-US') => {
  if (value == null || isNaN(value)) return '$0.00';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(value));
  } catch (error) {
    console.error('Error formatting currency:', error);
    return '$0.00';
  }
};

/**
 * Parses a currency string back to a number
 * @param {string} value - The currency string to parse
 * @returns {number} The parsed number
 */
export const parseCurrency = (value) => {
  if (!value) return 0;
  
  try {
    // Remove currency symbol and any non-numeric characters except decimal point
    const numericString = value.replace(/[^0-9.-]+/g, '');
    return parseFloat(numericString) || 0;
  } catch (error) {
    console.error('Error parsing currency:', error);
    return 0;
  }
};
