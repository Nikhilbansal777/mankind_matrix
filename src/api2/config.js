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
  auth: getServiceUrl('auth'),
  user: getServiceUrl('user'),
  product: getServiceUrl('product'),
  cart: getServiceUrl('cart'),
  wishlist: getServiceUrl('wishlist'),
};

// API Settings
export const settings = {
  // Timeouts and Retry Configuration
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000', 10),
  retryAttempts: parseInt(process.env.REACT_APP_API_RETRY_ATTEMPTS || '3', 10),
  retryDelay: parseInt(process.env.REACT_APP_API_RETRY_DELAY || '1000', 10),
  maxConcurrentRequests: parseInt(process.env.REACT_APP_MAX_CONCURRENT_REQUESTS || '5', 10),
  
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