import axios from 'axios';
import config from './config';

/**
 * Simple API Client
 * Handles all API requests with retry logic and authentication
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

  // Get stored token
  getAuthToken() {
    try {
      return localStorage.getItem('access_token');
    } catch (error) {
      console.error('Error reading auth token:', error);
      return null;
    }
  }

  // Get stored refresh token
  getRefreshToken() {
    try {
      return localStorage.getItem('refresh_token');
    } catch (error) {
      console.error('Error reading refresh token:', error);
      return null;
    }
  }

  // Save new token
  saveToken(token) {
    try {
      localStorage.setItem('access_token', token);
    } catch (error) {
      console.error('Error saving auth token:', error);
    }
  }

  // Save tokens from login response
  saveTokens(accessToken, refreshToken) {
    try {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  }

  // Clear all tokens
  clearTokens() {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  // Create axios instance with retry logic and auth
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
        // Initialize retry count if not present
        if (config._retryCount === undefined) {
          config._retryCount = 0;
        }

        // Add auth token if available
        const token = this.getAuthToken();
        const hasAuth = !!token;
        
        if (hasAuth) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        if (config.settings?.enableLogging) {
          console.log(`[${this.serviceName}] Request:`, {
            method: config.method?.toUpperCase(),
            url: config.url,
            hasAuth: hasAuth,
            retryCount: config._retryCount
          });
        }
        
        return config;
      },
      (error) => {
        if (config.settings?.enableLogging) {
          console.error(`[${this.serviceName}] Request Error:`, error);
        }
        return Promise.reject(error);
      }
    );

    // Add response interceptor with retry logic and token refresh
    client.interceptors.response.use(
      (response) => {
        if (config.settings?.enableLogging) {
          console.log(`[${this.serviceName}] Response:`, {
            status: response.status,
            url: response.config.url,
            hasAuth: !!response.config.headers.Authorization
          });
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Initialize retry count if not present
        if (originalRequest._retryCount === undefined) {
          originalRequest._retryCount = 0;
        }

        // Handle 401 errors by redirecting to login
        if (error.response?.status === 401) {
          if (config.settings?.enableLogging) {
            console.log(`[${this.serviceName}] Authentication failed, redirecting to login`);
          }
          
          // Clear tokens
          this.clearTokens();
          
          // Only redirect to login for auth-related requests, not for all services
          if (this.serviceName === 'auth' || this.serviceName === 'user') {
            window.location.href = '/login';
          }
          
          return Promise.reject(error);
        }

        // Only retry on network errors or timeout (not auth errors)
        const shouldRetry = (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') && 
          !originalRequest._retry && 
          originalRequest._retryCount < config.settings.retryAttempts;

        if (shouldRetry) {
          originalRequest._retry = true;
          originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

          if (config.settings?.enableLogging) {
            console.log(`[${this.serviceName}] Retrying request (${originalRequest._retryCount}/${config.settings.retryAttempts}):`, originalRequest.url);
          }

          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, config.settings.retryDelay));

          // Reset retry flag for next attempt
          originalRequest._retry = false;
          return client(originalRequest);
        }

        if (config.settings?.enableLogging) {
          console.error(`[${this.serviceName}] Response Error:`, {
            status: error.response?.status,
            message: error.message,
            data: error.response?.data,
            code: error.code,
            url: error.config?.url,
            method: error.config?.method?.toUpperCase(),
            retryCount: originalRequest._retryCount || 0,
            hasAuth: !!error.config?.headers?.Authorization
          });
        }

        // Handle common errors
        if (error.response) {
          // Log the full error response for debugging
          if (config.settings?.enableLogging) {
            console.log(`[${this.serviceName}] Full error response:`, {
              status: error.response.status,
              statusText: error.response.statusText,
              data: error.response.data,
              headers: error.response.headers
            });
          }
          
          // Use server error message if available
          if (error.response.data?.message) {
            error.message = error.response.data.message;
          } else if (error.response.data?.error) {
            error.message = error.response.data.error;
          } else if (typeof error.response.data === 'string') {
            error.message = error.response.data;
          } else {
            // Fallback to generic messages
            switch (error.response.status) {
              case 401:
                // Don't redirect here as we handle it in the interceptor
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

  // HTTP Methods with proper retry count handling
  async get(url, params = {}) {
    const config = { 
      params, 
      _retryCount: 0,
      paramsSerializer: {
        serialize: (params) => {
          const searchParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              // Convert arrays to comma-separated strings
              searchParams.append(key, value.join(','));
            } else if (value !== undefined && value !== null) {
              searchParams.append(key, value);
            }
          });
          return searchParams.toString();
        }
      }
    };
    const response = await this.client.get(url, config);
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
  auth: new ApiClient('auth'),
  user: new ApiClient('user'),
  product: new ApiClient('product'),
  cart: new ApiClient('cart'),
  wishlist: new ApiClient('wishlist'),
};

export default api; 