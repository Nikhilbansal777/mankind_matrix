/**
 * API Configuration
 * Central configuration for API services with environment variable access
 */

// Get environment mode with fallbacks
const getEnvMode = () => process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || 'development';

// Environment configuration
export const ENV_MODE = getEnvMode();
export const IS_DEV_MODE = ENV_MODE === 'development';
export const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';
export const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '10000', 10);

// Configure axios defaults
export const getAxiosConfig = (additionalConfig = {}) => ({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    ...additionalConfig.headers
  },
  ...additionalConfig
});

// Default export for backward compatibility
export default BASE_URL;
