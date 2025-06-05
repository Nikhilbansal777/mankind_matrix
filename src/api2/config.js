/**
 * API Configuration
 * Centralized configuration for all microservices
 */

// Environment
const ENV = process.env.REACT_APP_ENV || 'development';
const IS_DEV = ENV === 'development';

// Get service URL based on environment
const getServiceUrl = (service) => {
  const prefix = IS_DEV ? 'DEV' : 'PROD';
  const url = process.env[`REACT_APP_${prefix}_${service.toUpperCase()}_SERVICE_URL`];
  
  if (!url && IS_DEV) {
    console.warn(`Missing ${service} service URL for ${prefix} environment`);
  }
  
  return url;
};

// Service URLs
export const services = {
  product: getServiceUrl('product'),
  user: getServiceUrl('user'),
  cart: getServiceUrl('cart'),
  wishlist: getServiceUrl('wishlist'),
};

// API Settings
export const settings = {
  // Timeouts
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000', 10),
  
  // Features
  enableLogging: IS_DEV,
};

// Validate required URLs in development
if (IS_DEV) {
  Object.entries(services).forEach(([service, url]) => {
    if (!url) {
      console.error(`Missing URL for ${service} service`);
    }
  });
}

export default {
  env: ENV,
  isDev: IS_DEV,
  services,
  settings,
}; 