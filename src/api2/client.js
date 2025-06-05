import axios from 'axios';
import config from './config';

/**
 * Simple API Client
 * Handles all API requests with automatic token management
 */
class ApiClient {
  constructor(serviceName) {
    if (!config.services[serviceName]) {
      throw new Error(`Unknown service: ${serviceName}`);
    }

    this.serviceName = serviceName;
    this.baseURL = config.services[serviceName];
    this.client = this.createClient();
  }

  // Create axios instance
  createClient() {
    const client = axios.create({
      baseURL: this.baseURL,
      timeout: config.settings.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor
    client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        if (config.settings.enableLogging) {
          console.error(`[${this.serviceName}] Request Error:`, error);
        }
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    client.interceptors.response.use(
      (response) => {
        if (config.settings.enableLogging) {
          console.log(`[${this.serviceName}] Response:`, response.status, response.data);
        }
        return response;
      },
      (error) => {
        if (config.settings.enableLogging) {
          console.error(`[${this.serviceName}] Response Error:`, {
            status: error.response?.status,
            message: error.message,
            data: error.response?.data,
            code: error.code,
            url: error.config?.url,
            method: error.config?.method?.toUpperCase()
          });
        }

        // Handle common errors
        if (error.response) {
          // Use server error message if available
          if (error.response.data?.message) {
            error.message = error.response.data.message;
          } else {
            // Fallback to generic messages
            switch (error.response.status) {
              case 401:
                // Clear tokens and redirect to login
                localStorage.removeItem(config.settings.tokenKey);
                localStorage.removeItem(config.settings.refreshTokenKey);
                window.location.href = '/login';
                error.message = 'Authentication required. Please log in again.';
                break;
              case 403:
                error.message = 'You do not have permission to perform this action. Please check your access rights.';
                break;
              case 404:
                error.message = `The requested resource was not found at ${error.config?.url}`;
                break;
              case 422:
                error.message = 'Invalid data provided. Please check your input and try again.';
                break;
              case 429:
                error.message = 'Too many requests. Please wait a moment and try again.';
                break;
              case 500:
                error.message = 'Server error occurred. Our team has been notified. Please try again later.';
                break;
              default:
                error.message = `Server returned an error (${error.response.status}). Please try again later.`;
            }
          }
        } else if (error.code === 'ECONNABORTED') {
          error.message = `Request to ${error.config?.url} timed out after ${config.settings.timeout}ms. Please try again.`;
        } else if (error.code === 'ERR_NETWORK') {
          if (error.message.includes('CORS')) {
            error.message = `Cannot connect to ${this.serviceName} service. CORS error: The service is not accessible from this origin.`;
          } else if (!navigator.onLine) {
            error.message = 'You are currently offline. Please check your internet connection.';
          } else {
            error.message = `Cannot connect to ${this.serviceName} service at ${this.baseURL}. Please check if the service is running.`;
          }
        } else {
          error.message = `Network error while accessing ${this.serviceName} service: ${error.message}`;
        }

        return Promise.reject(error);
      }
    );

    return client;
  }

  // HTTP Methods
  async get(url, params = {}) {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  async post(url, data = {}) {
    const response = await this.client.post(url, data);
    return response.data;
  }

  async put(url, data = {}) {
    const response = await this.client.put(url, data);
    return response.data;
  }

  async patch(url, data = {}) {
    const response = await this.client.patch(url, data);
    return response.data;
  }

  async delete(url) {
    const response = await this.client.delete(url);
    return response.data;
  }
}

// Create and export service clients
export const api = {
  product: new ApiClient('product'),
  user: new ApiClient('user'),
  cart: new ApiClient('cart'),
  wishlist: new ApiClient('wishlist'),
};

export default api; 